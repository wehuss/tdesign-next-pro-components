/**
 * ProTable 核心逻辑 Hook
 * 基于 ant-design/pro-components 的 useFetchData 逻辑移植
 */

import { isEmpty } from '@/utils'
import type { TableRowData } from 'tdesign-vue-next'
import type { Ref } from 'vue'
import { computed, ref, watch, watchEffect } from 'vue'
import type {
  ActionRef,
  PaginationParams,
  ProTableColumn,
  ProTableProps,
} from '../types'
import { genProColumnToColumn } from '../utils'

export interface UseProTableOptions<T extends TableRowData = TableRowData> {
  columns: ProTableColumn<T>[]
  request?: ProTableProps<T>['request']
  dataSource?: T[]
  params?: Record<string, unknown>
  manual?: boolean
  polling?: number | boolean
  onLoad?: (dataSource: T[], extra: Record<string, unknown>) => void
  onRequestError?: (error: Error) => void
  postData?: (data: T[]) => T[]
  pagination?: boolean | Record<string, unknown>
}

export interface UseProTableResult<T extends TableRowData = TableRowData> {
  // 数据状态
  tableData: Ref<T[]>
  tableColumns: Ref<any[]>
  tableLoading: Ref<boolean>

  // 分页状态
  pageInfo: Ref<PaginationParams>
  setPageInfo: (pageInfo: Partial<PaginationParams>) => void

  // 操作方法
  reload: () => Promise<void>
  reset: () => void

  // ActionRef
  actionRef: Ref<ActionRef>

  // 搜索表单引用
  searchFormRef: Ref<Record<string, unknown>>

  // 搜索相关
  onSearch: (values: Record<string, unknown>) => void
  onReset: () => void
}

/**
 * ProTable 核心 Hook
 */
export function useProTable<T extends TableRowData = TableRowData>(
  options: UseProTableOptions<T>
): UseProTableResult<T> {
  const {
    columns,
    request,
    dataSource,
    params = {},
    manual = false,
    polling,
    onLoad,
    onRequestError,
    postData,
    pagination = true,
  } = options

  // 数据状态
  const tableData = ref<T[]>([]) as Ref<T[]>
  const tableLoading = ref(false)
  const tableColumns = ref([]) as Ref<any[]>

  // 分页状态
  const pageInfo = ref<PaginationParams>({
    current: 1,
    pageSize: 20,
    total: 0,
  })

  // 搜索表单状态
  const searchFormRef = ref<{ reset?: () => void }>({})
  const searchParams = ref<Record<string, unknown>>({})

  // 列状态管理
  const columnsMap = ref<Record<string, { show?: boolean }>>({})

  // 轮询定时器
  let pollingTimer: number | null = null

  /**
   * 获取请求参数
   */
  function getRequestParams(): Record<string, unknown> {
    const finalParams = {
      ...params,
      ...searchParams.value,
    }

    if (pagination !== false) {
      finalParams.current = pageInfo.value.current
      finalParams.pageSize = pageInfo.value.pageSize
    }

    return finalParams
  }

  /**
   * 发起数据请求
   */
  async function fetchData(isPolling = false): Promise<void> {
    if (!request) {
      if (dataSource) {
        setTableData(dataSource)
      }
      return
    }

    if (!isPolling) {
      tableLoading.value = true
    }

    try {
      const requestParams = getRequestParams()
      const response = await request(
        requestParams as T & { current: number; pageSize: number }
      )

      if (response.success !== false) {
        let finalData = response.data || []

        // 数据后处理
        if (postData) {
          finalData = postData(finalData)
        }

        setTableData(finalData, response.total)
        onLoad?.(finalData, response)
      }
    } catch (error) {
      console.error('Request failed:', error)
      onRequestError?.(error as Error)
    } finally {
      tableLoading.value = false
    }
  }

  /**
   * 设置表格数据
   */
  function setTableData(data: T[], total?: number): void {
    tableData.value = data

    if (typeof total === 'number') {
      pageInfo.value.total = total
    } else if (pagination === false) {
      pageInfo.value.total = data.length
    }
  }

  /**
   * 设置分页信息
   */
  function setPageInfo(newPageInfo: Partial<PaginationParams>): void {
    pageInfo.value = {
      ...pageInfo.value,
      ...newPageInfo,
    }
  }

  /**
   * 重新加载数据
   */
  async function reload(): Promise<void> {
    await fetchData()
  }

  /**
   * 重置到第一页并重新加载
   */
  function reset(): void {
    setPageInfo({ current: 1 })
    searchParams.value = {}
    if (searchFormRef.value?.reset) {
      searchFormRef.value.reset()
    }
  }

  /**
   * 搜索处理
   */
  function onSearch(values: Record<string, unknown>): void {
    searchParams.value = values
    setPageInfo({ current: 1 })
  }

  /**
   * 重置搜索
   */
  function onReset(): void {
    searchParams.value = {}
    setPageInfo({ current: 1 })
  }

  /**
   * 开始轮询
   */
  function startPolling(): void {
    if (!polling || typeof polling !== 'number') return

    pollingTimer = setInterval(() => {
      fetchData(true)
    }, polling) as unknown as number
  }

  /**
   * 停止轮询
   */
  function stopPolling(): void {
    if (pollingTimer) {
      clearInterval(pollingTimer)
      pollingTimer = null
    }
  }

  // 转换列配置 - 使用 computed 而不是 watchEffect 避免循环
  const computedColumns = computed(() => {
    return genProColumnToColumn({
      columns,
      columnsMap: columnsMap.value as Record<string, { show?: boolean }>,
      type: 'table',
    })
  })

  // 将计算结果赋值给 tableColumns
  watchEffect(() => {
    tableColumns.value = computedColumns.value
  })

  // 监听分页变化
  watch(
    () => pageInfo.value,
    () => {
      if (!manual) {
        fetchData()
      }
    },
    { deep: true }
  )

  // 监听搜索参数变化
  watch(
    () => searchParams.value,
    () => {
      if (!manual) {
        fetchData()
      }
    },
    { deep: true }
  )

  // 监听外部参数变化
  watch(
    () => params,
    () => {
      if (!manual) {
        fetchData()
      }
    },
    { deep: true }
  )

  // 初始化数据加载
  watchEffect(() => {
    if (!manual && !isEmpty(columns)) {
      if (dataSource) {
        setTableData(dataSource)
      } else if (request) {
        fetchData()
      }
    }
  })

  // 轮询控制
  watchEffect(() => {
    if (polling) {
      startPolling()
    } else {
      stopPolling()
    }
  })

  // ActionRef 实现
  const actionRef = computed<ActionRef>(() => ({
    reload,
    reloadAndReset: async () => {
      reset()
      await reload()
    },
    reset,
    setPageInfo,
    clearSelected: () => {
      // TODO: 实现清除选中逻辑
    },
  }))

  return {
    tableData,
    tableColumns,
    tableLoading,
    pageInfo,
    setPageInfo,
    reload,
    reset,
    actionRef,
    searchFormRef,
    onSearch,
    onReset,
  }
}
