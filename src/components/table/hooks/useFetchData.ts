/**
 * useFetchData Hook
 * 用于获取数据并控制数据的状态和分页
 * 移植自 ant-design/pro-components 适配 Vue 3
 */

import type { Ref } from 'vue'
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { RequestData } from '../types'

export interface PageInfo {
  pageSize: number
  total: number
  current: number
}

export interface UseFetchDataAction<T = any> {
  dataSource: T[]
  setDataSource: (dataSource: T[]) => void
  loading: boolean
  pageInfo: PageInfo
  reload: (resetPageIndex?: boolean) => Promise<void>
  /** 跳过 effectsGetter 触发的请求并手动 reload（用于搜索表单提交）
   * @param resetPageIndex 是否重置分页到第一页
   * @param beforeFetch 可选的回调函数，在跳过 watcher 后、发起请求前执行（用于原子性更新状态）
   */
  skipAndReload: (resetPageIndex?: boolean, beforeFetch?: () => void) => Promise<void>
  reset: () => void
  pollingLoading: boolean
  setPageInfo: (pageInfo: Partial<PageInfo>) => void
  /** 内部 refs，用于外部 watch */
  _refs: {
    dataSource: Ref<T[]>
    loading: Ref<boolean>
    pageInfo: Ref<PageInfo>
    pollingLoading: Ref<boolean>
  }
}

export interface UseFetchDataOptions<T = any> {
  /** 数据源（受控） */
  dataSource?: T[]
  /** 加载状态（受控） */
  loading?: boolean
  /** 加载状态变化回调 */
  onLoadingChange?: (loading: boolean) => void
  /** 数据加载完成回调 */
  onLoad?: (dataSource: T[], extra: any) => void
  /** 数据源变化回调 */
  onDataSourceChange?: (dataSource: T[]) => void
  /** 数据后处理 */
  postData?: (data: T[]) => T[]
  /** 分页信息 */
  pageInfo?:
    | {
        current?: number
        pageSize?: number
        defaultCurrent?: number
        defaultPageSize?: number
      }
    | false
  /** 分页信息变化回调 */
  onPageInfoChange?: (pageInfo: PageInfo) => void
  /** 依赖项 getter 函数，返回序列化后的依赖值用于比较 */
  effectsGetter?: () => string
  /** 请求错误回调 */
  onRequestError?: (e: Error) => void
  /** 是否手动触发请求 */
  manual?: boolean
  /** 防抖时间 */
  debounceTime?: number
  /** 轮询时间或轮询条件函数 */
  polling?: number | ((dataSource: T[]) => number)
  /** 是否在页面获得焦点时重新验证数据 */
  revalidateOnFocus?: boolean
}

/**
 * 合并用户配置和默认值
 */
function mergeOptionAndPageInfo(options: UseFetchDataOptions): PageInfo {
  if (options.pageInfo) {
    const { current, defaultCurrent, pageSize, defaultPageSize } = options.pageInfo
    return {
      current: current || defaultCurrent || 1,
      total: 0,
      pageSize: pageSize || defaultPageSize || 20,
    }
  }
  return { current: 1, total: 0, pageSize: 20 }
}

/**
 * 数据后处理管道
 */
function postDataPipeline<T>(data: T[], processors: ((data: T[]) => T[])[]): T[] {
  return processors.reduce((result, processor) => processor(result), data)
}

/**
 * useFetchData Hook
 * @param getData 获取数据的函数
 * @param defaultData 默认数据
 * @param options 配置项
 */
export function useFetchData<T = any>(
  getData:
    | undefined
    | ((params?: { pageSize: number; current: number }) => Promise<RequestData<T>>),
  defaultData: T[] | undefined,
  options: UseFetchDataOptions<T>,
): UseFetchDataAction<T> {
  const {
    onLoad,
    manual = false,
    polling,
    onRequestError,
    debounceTime = 20,
    effectsGetter,
    onLoadingChange,
    onDataSourceChange,
    postData,
    revalidateOnFocus = false,
  } = options

  // 组件是否已卸载
  const unmountedRef = ref(false)

  // 是否首次加载（手动模式）
  const manualRequestRef = ref(manual)

  // 轮询定时器
  const pollingTimerRef = ref<ReturnType<typeof setTimeout> | null>(null)

  // 防抖定时器
  const debounceTimerRef = ref<ReturnType<typeof setTimeout> | null>(null)

  // 请求取消标记
  const abortRef = ref(false)

  // 表格数据
  const tableDataList = ref<T[]>(defaultData || []) as Ref<T[]>

  // 加载状态
  const tableLoading = ref(false)

  // 轮询加载状态
  const pollingLoading = ref(false)

  // 分页信息
  const pageInfoState = ref<PageInfo>(mergeOptionAndPageInfo(options))

  // 上一次的分页信息
  const prevPageRef = ref<number | undefined>(undefined)
  const prevPageSizeRef = ref<number | undefined>(undefined)

  // 跳过下一次 effectsGetter 触发的请求（用于手动 reload 场景）
  const skipNextEffectsWatch = ref(false)

  /**
   * 设置分页信息
   */
  function setPageInfo(changePageInfo: Partial<PageInfo>) {
    const newPageInfo = {
      ...pageInfoState.value,
      ...changePageInfo,
    }

    if (
      newPageInfo.current !== pageInfoState.value.current ||
      newPageInfo.pageSize !== pageInfoState.value.pageSize ||
      newPageInfo.total !== pageInfoState.value.total
    ) {
      pageInfoState.value = newPageInfo
      options.onPageInfoChange?.(newPageInfo)
    }
  }

  /**
   * 设置数据和加载状态
   */
  function setDataAndLoading(newData: T[], dataTotal: number) {
    tableDataList.value = newData
    onDataSourceChange?.(newData)

    if (pageInfoState.value.total !== dataTotal) {
      setPageInfo({
        total: dataTotal || newData.length,
      })
    }
  }

  /**
   * 请求完成处理
   */
  function requestFinally() {
    tableLoading.value = false
    pollingLoading.value = false
    onLoadingChange?.(false)
  }

  /**
   * 请求数据
   */
  async function fetchList(isPolling: boolean): Promise<T[]> {
    console.log('fetchList')
    // 需要手动触发的首次请求
    if (manualRequestRef.value) {
      manualRequestRef.value = false
      return []
    }

    if (!isPolling) {
      tableLoading.value = true
      onLoadingChange?.(true)
    } else {
      pollingLoading.value = true
    }

    const { pageSize, current } = pageInfoState.value

    try {
      const pageParams =
        options.pageInfo !== false
          ? {
              current,
              pageSize,
            }
          : undefined

      const response = await getData?.(pageParams)

      if (!response) {
        return []
      }

      const { data = [], success, total = 0, ...rest } = response

      // 如果失败了，直接返回
      if (success === false) {
        return []
      }

      const responseData = postDataPipeline<T>(
        data,
        [postData].filter(Boolean) as ((data: T[]) => T[])[],
      )

      // 设置表格数据
      setDataAndLoading(responseData, total)
      onLoad?.(responseData, rest)

      return responseData
    } catch (e) {
      // 如果没有传递错误处理方法，需要把错误抛出去
      if (onRequestError === undefined) {
        throw e
      }

      if (tableDataList.value === undefined) {
        tableDataList.value = []
      }

      onRequestError(e as Error)
      return []
    } finally {
      requestFinally()
    }
  }

  /**
   * 防抖请求
   */
  function fetchListDebounce(isPolling: boolean): Promise<T[]> {
    return new Promise((resolve, reject) => {
      // 清除之前的定时器
      if (debounceTimerRef.value) {
        clearTimeout(debounceTimerRef.value)
      }

      // 清除轮询定时器
      if (pollingTimerRef.value) {
        clearTimeout(pollingTimerRef.value)
      }

      if (!getData) {
        resolve([])
        return
      }

      // 重置取消标记
      abortRef.value = false

      debounceTimerRef.value = setTimeout(async () => {
        try {
          if (abortRef.value) {
            resolve([])
            return
          }

          const result = await fetchList(isPolling)

          if (abortRef.value) {
            resolve([])
            return
          }

          // 处理轮询
          const needPolling = typeof polling === 'function' ? polling(result) : polling

          if (needPolling && !unmountedRef.value) {
            pollingTimerRef.value = setTimeout(
              () => {
                fetchListDebounce(true)
              },
              Math.max(needPolling as number, 2000),
            )
          }

          resolve(result)
        } catch (error) {
          reject(error)
        }
      }, debounceTime || 30)
    })
  }

  /**
   * 取消请求
   */
  function abortFetch() {
    abortRef.value = true

    if (debounceTimerRef.value) {
      clearTimeout(debounceTimerRef.value)
      debounceTimerRef.value = null
    }

    requestFinally()
  }

  // 监听分页变化
  watch(
    () => pageInfoState.value.current,
    (current, prevCurrent) => {
      if (prevCurrent === undefined) {
        prevPageRef.value = current
        return
      }

      // 如果页码没变，不需要请求
      if (prevPageRef.value === current) {
        return
      }

      prevPageRef.value = current

      // 如果数据长度小于等于 pageSize，说明是真分页，需要请求
      if (tableDataList.value && tableDataList.value.length <= pageInfoState.value.pageSize) {
        abortFetch()
        fetchListDebounce(false)
      }
    },
  )

  // 监听 pageSize 变化
  watch(
    () => pageInfoState.value.pageSize,
    (pageSize, prevPageSize) => {
      if (prevPageSize === undefined) {
        prevPageSizeRef.value = pageSize
        return
      }

      if (prevPageSizeRef.value === pageSize) {
        return
      }

      prevPageSizeRef.value = pageSize
      abortFetch()
      fetchListDebounce(false)
    },
  )

  // 监听 effects 变化 - 使用 getter 函数确保 Vue 能正确追踪响应式依赖
  if (effectsGetter) {
    watch(effectsGetter, () => {
      // 如果设置了跳过标记，则不触发请求（用于手动 reload 场景）
      if (skipNextEffectsWatch.value) {
        skipNextEffectsWatch.value = false
        return
      }

      console.log('effectsGetter change!')
      abortFetch()
      fetchListDebounce(false)

      if (!manual) {
        manualRequestRef.value = false
      }
    })
  }

  // 监听轮询配置变化
  watch(
    () => polling,
    (newPolling, oldPolling) => {
      if (!newPolling) {
        if (pollingTimerRef.value) {
          clearTimeout(pollingTimerRef.value)
          pollingTimerRef.value = null
        }
      }

      if (!oldPolling && newPolling) {
        fetchListDebounce(true)
      }
    },
  )

  // 监听受控数据源
  watch(
    () => options.dataSource,
    (newDataSource) => {
      if (newDataSource !== undefined) {
        tableDataList.value = newDataSource
      }
    },
  )

  // 监听受控加载状态
  watch(
    () => options.loading,
    (newLoading) => {
      if (newLoading !== undefined) {
        tableLoading.value = newLoading
      }
    },
  )

  // 组件挂载时
  onMounted(() => {
    unmountedRef.value = false

    // 初始加载
    if (!manual && getData) {
      nextTick(() => {
        fetchListDebounce(false)
      })
    }

    // 聚焦时重新请求
    if (revalidateOnFocus && getData) {
      const handleVisibilityChange = () => {
        if (document.visibilityState === 'visible') {
          fetchListDebounce(false)
        }
      }

      document.addEventListener('visibilitychange', handleVisibilityChange)

      onBeforeUnmount(() => {
        document.removeEventListener('visibilitychange', handleVisibilityChange)
      })
    }
  })

  // 组件卸载时
  onBeforeUnmount(() => {
    unmountedRef.value = true

    if (pollingTimerRef.value) {
      clearTimeout(pollingTimerRef.value)
    }

    if (debounceTimerRef.value) {
      clearTimeout(debounceTimerRef.value)
    }
  })

  // 返回响应式对象
  return {
    // 使用 computed 确保响应式
    get dataSource() {
      return tableDataList.value
    },
    setDataSource: (data: T[]) => {
      tableDataList.value = data
      onDataSourceChange?.(data)
    },
    get loading() {
      return tableLoading.value
    },
    get pageInfo() {
      return pageInfoState.value
    },
    get pollingLoading() {
      return pollingLoading.value
    },
    reload: async (resetPageIndex?: boolean) => {
      abortFetch()
      manualRequestRef.value = false

      if (resetPageIndex) {
        setPageInfo({ current: 1 })
      }

      await fetchListDebounce(false)
    },
    // 跳过下一次 effectsGetter 触发的请求并手动 reload（用于搜索表单提交场景）
    skipAndReload: async (resetPageIndex?: boolean, beforeFetch?: () => void) => {
      // 设置跳过标记，防止 effectsGetter watcher 触发重复请求
      skipNextEffectsWatch.value = true

      // 执行 beforeFetch 回调（用于更新 formSearch 等响应式状态）
      // 此时 skip 标记已设置，watcher 不会触发请求
      beforeFetch?.()

      abortFetch()
      manualRequestRef.value = false

      if (resetPageIndex) {
        setPageInfo({ current: 1 })
      }

      await fetchListDebounce(false)
    },
    reset: () => {
      const { pageInfo: optionPageInfo } = options
      const { defaultCurrent = 1, defaultPageSize = 20 } = (optionPageInfo as any) || {}

      setPageInfo({
        current: defaultCurrent,
        total: 0,
        pageSize: defaultPageSize,
      })
    },
    setPageInfo: (info: Partial<PageInfo>) => {
      setPageInfo(info)
    },
    // 暴露内部 refs 以便外部可以 watch
    _refs: {
      dataSource: tableDataList,
      loading: tableLoading,
      pageInfo: pageInfoState,
      pollingLoading,
    },
  }
}

export default useFetchData
