import { useDebouncedRef, useLatest } from '@/utils'
import type { TableRowData } from 'tdesign-vue-next'
import { computed, onMounted, onUnmounted, ref, watch, watchEffect } from 'vue'
import type {
  ActionRef,
  FilterInfo,
  PaginationParams,
  ProTableProps,
  RequestData,
  SortInfo,
} from '../types'
import { transformColumns } from '../utils/column-utils'
import {
  getDefaultPagination,
  isPaginationChanged,
  shouldFetchData,
} from '../utils/pagination-utils'

export function useProTable<T extends TableRowData = TableRowData>(
  props: ProTableProps<T>
) {
  // 数据状态
  const tableData = ref<T[]>([])
  const tableLoading = ref(false)
  const searchParams = ref<Record<string, unknown>>({})

  // 分页状态初始化 - 使用工具函数
  const pageInfo = ref<PaginationParams>(getDefaultPagination(props.pagination))

  // 排序和筛选状态
  const sortInfo = ref<SortInfo>({})
  const filterInfo = ref<FilterInfo>({})

  // 请求控制
  const abortController = ref<InstanceType<
    typeof globalThis.AbortController
  > | null>(null)
  const pollingTimer = ref<ReturnType<typeof setTimeout> | null>(null)
  const manualRequest = ref<boolean>(!!props.manualRequest)

  // 引用
  const searchFormRef = ref()
  const actionRef = ref<ActionRef>()

  // 防抖搜索参数
  const debouncedSearchParams = useDebouncedRef(
    searchParams,
    props.debounceTime || 300
  )
  const latestProps = useLatest(props)

  // 处理列配置
  const tableColumns = computed(() => {
    return transformColumns(props.columns)
  })

  // 上一次的分页信息，用于判断是否需要重新请求
  const prevPageInfo = ref<PaginationParams>({ ...pageInfo.value })

  // 设置分页信息 - 使用工具函数检查变化
  const updatePageInfo = (info: Partial<PaginationParams>) => {
    const newPageInfo = { ...pageInfo.value, ...info }

    // 检查分页信息是否真的发生了变化
    if (isPaginationChanged(newPageInfo, pageInfo.value)) {
      const prevInfo = { ...pageInfo.value }
      prevPageInfo.value = prevInfo
      pageInfo.value = newPageInfo

      // 判断是否需要请求数据
      if (
        shouldFetchData({
          current: newPageInfo,
          prev: prevInfo,
          dataLength: tableData.value.length,
          hasRequest: !!props.request,
        })
      ) {
        // 页面大小改变时，重置到第一页
        if (info.pageSize && info.pageSize !== prevInfo.pageSize) {
          pageInfo.value.current = 1
          fetchData(searchParams.value, sortInfo.value, filterInfo.value, {
            resetPageIndex: false, // 已经手动设置了 current = 1
          })
        } else if (info.current && info.current !== prevInfo.current) {
          // 仅页码改变时，不重置页码
          fetchData(searchParams.value, sortInfo.value, filterInfo.value)
        }
      }
    }
  }

  // 取消请求
  const cancelRequest = () => {
    if (abortController.value) {
      abortController.value.abort()
      abortController.value = null
    }
    if (pollingTimer.value) {
      clearTimeout(pollingTimer.value)
      pollingTimer.value = null
    }
  }

  // 数据请求
  const fetchData = async (
    params: Record<string, unknown> = {},
    sort: SortInfo = {},
    filter: FilterInfo = {},
    options: {
      isPolling?: boolean
      resetPageIndex?: boolean
      skipLoading?: boolean
    } = {}
  ) => {
    const {
      request,
      params: propsParams,
      postData,
      onLoad,
      onRequestError,
    } = latestProps.value

    if (!request) {
      return []
    }

    // 取消之前的请求
    cancelRequest()

    // 创建新的 AbortController
    const controller = globalThis.AbortController
      ? new globalThis.AbortController()
      : null
    abortController.value = controller

    // 设置页码
    if (options.resetPageIndex) {
      pageInfo.value.current = 1
    }

    if (!options.skipLoading) {
      tableLoading.value = true
    }

    try {
      const requestParams = {
        ...params,
        ...propsParams,
        current: pageInfo.value.current,
        pageSize: pageInfo.value.pageSize,
      }

      const response: RequestData<T> = await request(
        requestParams as T & PaginationParams,
        sort,
        filter
      )

      // 检查请求是否被取消
      if (controller?.signal.aborted) {
        return []
      }

      if (response.success !== false) {
        let responseData = response.data || []

        // 数据后处理
        if (postData && typeof postData === 'function') {
          responseData = postData(responseData)
        }

        tableData.value = responseData
        pageInfo.value.total = response.total || responseData.length || 0

        // 触发数据加载完成回调
        if (onLoad && typeof onLoad === 'function') {
          onLoad(responseData, response)
        }

        // 轮询处理
        if (props.polling && !options.isPolling) {
          const pollingTime =
            typeof props.polling === 'number' ? props.polling : 2000
          pollingTimer.value = setTimeout(
            () => {
              fetchData(params, sort, filter, {
                isPolling: true,
                skipLoading: true,
              })
            },
            Math.max(pollingTime, 2000)
          )
        }

        return responseData
      } else {
        throw new Error(response.errorMessage || 'Request failed')
      }
    } catch (error: unknown) {
      // 如果是取消请求，不处理错误
      if (
        (error as Error).name === 'AbortError' ||
        controller?.signal.aborted
      ) {
        return []
      }

      console.error('ProTable request error:', error)

      // 触发错误回调
      if (onRequestError && typeof onRequestError === 'function') {
        onRequestError(error as Error)
      } else if (!onRequestError) {
        // 如果没有错误处理函数，抛出错误
        throw error
      }

      return []
    } finally {
      if (!options.skipLoading) {
        tableLoading.value = false
      }

      // 清理 AbortController
      if (abortController.value === controller) {
        abortController.value = null
      }
    }
  }

  // 搜索处理
  const onSearch = (values: Record<string, unknown>) => {
    searchParams.value = values
    fetchData(values, sortInfo.value, filterInfo.value, {
      resetPageIndex: true,
    })
  }

  // 重置处理
  const onReset = () => {
    searchParams.value = {}
    fetchData({}, {}, {}, { resetPageIndex: true })
  }

  // 刷新数据
  const reload = async (resetPageIndex?: boolean) => {
    await fetchData(searchParams.value, sortInfo.value, filterInfo.value, {
      resetPageIndex,
    })
  }

  // 重置并刷新
  const reloadAndReset = async () => {
    searchParams.value = {}
    sortInfo.value = {}
    filterInfo.value = {}
    await fetchData({}, {}, {}, { resetPageIndex: true })
  }

  // 设置排序信息
  const setSortInfo = (sort: SortInfo) => {
    sortInfo.value = sort
    fetchData(searchParams.value, sort, filterInfo.value, {
      resetPageIndex: true,
    })
  }

  // 设置筛选信息
  const setFilterInfo = (filter: FilterInfo) => {
    filterInfo.value = filter
    fetchData(searchParams.value, sortInfo.value, filter, {
      resetPageIndex: true,
    })
  }

  // 设置 ActionRef
  actionRef.value = {
    reload,
    reloadAndReset,
    reset: onReset,
    setPageInfo: updatePageInfo,
    setSortInfo,
    setFilterInfo,
    clearSelected: () => {
      // 清空选择状态的实现
    },
  }

  // 监听 props.dataSource 变化（静态数据源）
  watch(
    () => props.dataSource,
    newData => {
      if (newData && !props.request) {
        tableData.value = newData
        pageInfo.value.total = newData.length
      }
    },
    { immediate: true }
  )

  // 监听 params 变化，防抖处理
  watchEffect(() => {
    if (props.request && debouncedSearchParams.value !== searchParams.value) {
      fetchData(searchParams.value, sortInfo.value, filterInfo.value, {
        resetPageIndex: true,
      })
    }
  })

  // 监听 props.params 变化
  watch(
    () => props.params,
    (newParams, oldParams) => {
      if (
        props.request &&
        JSON.stringify(newParams) !== JSON.stringify(oldParams)
      ) {
        fetchData(searchParams.value, sortInfo.value, filterInfo.value, {
          resetPageIndex: true,
        })
      }
    },
    { deep: true }
  )

  // 初始加载
  onMounted(() => {
    if (props.request && !manualRequest.value) {
      fetchData()
    }
  })

  // 组件卸载时清理
  onUnmounted(() => {
    cancelRequest()
  })

  return {
    tableData,
    tableColumns,
    tableLoading,
    searchFormRef,
    actionRef,
    pageInfo,
    sortInfo,
    filterInfo,
    onSearch,
    onReset,
    reload,
    reloadAndReset,
    fetchData,
    setPageInfo: updatePageInfo,
    setSortInfo,
    setFilterInfo,
  }
}
