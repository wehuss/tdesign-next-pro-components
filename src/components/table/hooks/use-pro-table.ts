import type { TableRowData } from 'tdesign-vue-next'
import { computed, onMounted, ref, watch } from 'vue'
import type { ActionRef, ProTableProps, RequestData } from '../types'
import { transformColumns } from '../utils/column-utils'

export function useProTable<T extends TableRowData = TableRowData>(
  props: ProTableProps<T>
) {
  // 数据状态
  const tableData = ref<T[]>([])
  const tableLoading = ref(false)
  const searchParams = ref<Record<string, unknown>>({})
  const pageInfo = ref({
    current: 1,
    pageSize: 20,
    total: 0,
  })

  // 引用
  const searchFormRef = ref()
  const actionRef = ref<ActionRef>()

  // 处理列配置
  const tableColumns = computed(() => {
    return transformColumns(props.columns)
  })

  // 数据请求
  const fetchData = async (params: Record<string, unknown> = {}) => {
    if (!props.request) {
      return
    }

    tableLoading.value = true
    try {
      const requestParams = {
        ...params,
        ...props.params,
        current: pageInfo.value.current,
        pageSize: pageInfo.value.pageSize,
      }

      const response: RequestData<T> = await props.request(
        requestParams as T & {
          current: number
          pageSize: number
        }
      )

      if (response.success !== false) {
        tableData.value = response.data || []
        pageInfo.value.total = response.total || response.data?.length || 0
      }
    } catch (error) {
      console.error('ProTable request error:', error)
    } finally {
      tableLoading.value = false
    }
  }

  // 搜索处理
  const onSearch = (values: Record<string, unknown>) => {
    searchParams.value = values
    pageInfo.value.current = 1
    fetchData(values)
  }

  // 重置处理
  const onReset = () => {
    searchParams.value = {}
    pageInfo.value.current = 1
    fetchData()
  }

  // 刷新数据
  const reload = async (resetPageIndex?: boolean) => {
    if (resetPageIndex) {
      pageInfo.value.current = 1
    }
    await fetchData(searchParams.value)
  }

  // 设置 ActionRef
  actionRef.value = {
    reload,
    reloadAndRest: async () => {
      pageInfo.value.current = 1
      searchParams.value = {}
      await fetchData()
    },
    reset: onReset,
    setPageInfo: info => {
      Object.assign(pageInfo.value, info)
    },
  }

  // 监听 props.dataSource 变化
  watch(
    () => props.dataSource,
    newData => {
      if (newData && !props.request) {
        tableData.value = newData
      }
    },
    { immediate: true }
  )

  // 监听 params 变化
  watch(
    () => props.params,
    () => {
      if (props.request) {
        fetchData(searchParams.value)
      }
    },
    { deep: true }
  )

  // 初始加载
  onMounted(() => {
    if (props.request) {
      fetchData()
    }
  })

  return {
    tableData,
    tableColumns,
    tableLoading,
    searchFormRef,
    actionRef,
    pageInfo,
    onSearch,
    onReset,
    reload,
    fetchData,
  }
}
