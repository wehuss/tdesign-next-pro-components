/**
 * ProTable 表格组件
 * 基于 ant-design/pro-components 的 Table.tsx 移植
 * 适配 Vue 3 + TDesign
 */

import useListeners from '@/hooks/listeners'
import { Card, EnhancedTable, type PaginationProps } from 'tdesign-vue-next'
import type { App, PropType, Ref, VNode } from 'vue'
import { computed, defineComponent, onBeforeUnmount, provide, ref, useModel, watch } from 'vue'
import TableAlert from './components/alert'
import TableFormRender from './components/form'
import TableToolBar from './components/toolbar'
import { useFetchData } from './hooks/useFetchData'
import './style/index.less'
import type {
  ActionRef,
  ColumnsState,
  FilterInfo,
  PaginationParams,
  ProNode,
  ProTableColumn,
  RequestData,
  SearchConfig,
  SortInfo,
  ToolbarConfig,
} from './types'
import { genProColumnToColumn } from './utils'

// ProTable 上下文 key
export const ProTableContextKey = Symbol('ProTableContext')

// ProTable 上下文类型
export interface ProTableContext {
  actionRef: Ref<ActionRef | undefined>
  columnsMap: Ref<Record<string, { show?: boolean; fixed?: 'left' | 'right'; order?: number }>>
  setColumnsMap: (
    map: Record<string, { show?: boolean; fixed?: 'left' | 'right'; order?: number }>,
  ) => void
}

// AlertRender 类型导入
import type { AlertRenderType } from './components/alert'

const ProTable = defineComponent({
  name: 'ProTable',
  props: {
    // 数据相关
    request: Function as PropType<
      (
        params: Record<string, any> & { current: number; pageSize: number },
        sort?: SortInfo,
        filter?: FilterInfo,
      ) => Promise<RequestData<any>>
    >,
    dataSource: Array as PropType<any[]>,
    params: Object as PropType<Record<string, any>>,
    defaultData: Array as PropType<any[]>,
    postData: Function as PropType<(data: any[]) => any[]>,

    // 列配置
    columns: {
      type: Array as PropType<ProTableColumn[]>,
      required: true,
    },

    // 搜索表单
    search: {
      type: [Boolean, Object] as PropType<false | SearchConfig>,
      default: true,
    },

    // 工具栏
    toolbar: {
      type: [Boolean, Object] as PropType<false | ToolbarConfig>,
      default: true,
    },
    toolbarRender: Function as PropType<(actionRef: Ref<ActionRef>) => VNode>,

    // 卡片配置
    cardBordered: {
      type: Boolean,
      default: true,
    },
    ghost: {
      type: Boolean,
      default: false,
    },

    // 标题相关
    headerTitle: [String, Function] as PropType<ProNode>,
    tooltip: [String, Function] as PropType<ProNode>,

    // 分页
    pagination: {
      type: [Boolean, Object] as PropType<false | PaginationProps>,
    },

    // 列配置控制
    columnControllerVisible: {
      type: Boolean,
      default: false,
    },

    // 行选择相关
    rowSelection: {
      type: [Boolean, Object] as PropType<boolean | Record<string, any>>,
      default: undefined,
    },
    selectedRowKeys: {
      type: Array as PropType<(string | number)[]>,
      default: undefined,
    },

    // Alert 相关
    tableAlertRender: {
      type: [Function, Boolean] as PropType<AlertRenderType<any>>,
      default: undefined,
    },
    tableAlertOptionRender: {
      type: [Function, Boolean] as PropType<AlertRenderType<any>>,
      default: undefined,
    },

    // 其他 Table 属性
    loading: Boolean,
    rowKey: {
      type: String,
      default: 'id',
    },

    // 请求相关
    manual: {
      type: Boolean,
      default: false,
    },
    manualRequest: {
      type: Boolean,
      default: false,
    },
    polling: [Number, Boolean] as PropType<number | boolean>,
    debounceTime: {
      type: Number,
      default: 20,
    },
    revalidateOnFocus: {
      type: Boolean,
      default: false,
    },

    // 回调函数
    onLoad: Function as PropType<(dataSource: any[], extra: any) => void>,
    onRequestError: Function as PropType<(error: Error) => void>,
    onLoadingChange: Function as PropType<(loading: boolean) => void>,
    onDataSourceChange: Function as PropType<(dataSource: any[]) => void>,

    // 空值文本
    columnEmptyText: {
      type: String,
      default: '-',
    },
    // 自动填充剩余高度
    autoFill: {
      type: Boolean,
      default: false,
    },
  },

  emits: [
    'update:columnControllerVisible',
    'update:dataSource',
    'update:selectedRowKeys',
    'selectionChange',
  ],

  setup(props, { slots, attrs, expose, emit }) {
    const { listeners } = useListeners()
    const columnControllerVisible = useModel(props, 'columnControllerVisible')

    // 列状态管理
    const columnsMap = ref<
      Record<string, { show?: boolean; fixed?: 'left' | 'right'; order?: number }>
    >({})

    // 表格密度状态
    const tableSize = ref<'small' | 'medium' | 'large'>('medium')

    // 排序和筛选状态
    const proSort = ref<SortInfo>({})
    const proFilter = ref<FilterInfo>({})

    // 行选择状态
    const internalSelectedRowKeys = ref<(string | number)[]>([])
    const selectedRows = ref<any[]>([])

    // 计算实际使用的 selectedRowKeys（支持受控和非受控模式）
    const selectedRowKeys = computed(() => {
      return props.selectedRowKeys ?? internalSelectedRowKeys.value
    })

    // 处理选择变化
    const handleSelectionChange = (
      keys: (string | number)[],
      context: { selectedRowData: any[] },
    ) => {
      internalSelectedRowKeys.value = keys
      selectedRows.value = context.selectedRowData || []
      emit('update:selectedRowKeys', keys)
      emit('selectionChange', keys, context)
    }

    // 清空选择
    const clearSelected = () => {
      internalSelectedRowKeys.value = []
      selectedRows.value = []
      emit('update:selectedRowKeys', [])
    }

    // 搜索表单状态
    const formSearch = ref<Record<string, any>>({})
    const searchFormRef = ref<any>(null)

    // 构建请求函数
    const fetchData = computed(() => {
      if (!props.request) return undefined

      return async (pageParams?: { pageSize: number; current: number }) => {
        const actionParams = {
          ...(pageParams || {}),
          ...formSearch.value,
          ...props.params,
        }

        // 删除内部时间戳
        delete (actionParams as any)._timestamp

        const response = await props.request!(actionParams as any, proSort.value, proFilter.value)

        return response
      }
    })

    // 分页配置
    const fetchPagination = computed(() => {
      if (props.pagination === false) {
        return false
      }

      const paginationConfig = typeof props.pagination === 'object' ? props.pagination : {}

      return {
        defaultCurrent: 1,
        defaultPageSize: 20,
        pageSize: 20,
        current: 1,
        ...paginationConfig,
      }
    })

    // 使用 useFetchData hook
    const action = useFetchData(fetchData.value, props.defaultData, {
      pageInfo: fetchPagination.value,
      loading: props.loading,
      dataSource: props.dataSource,
      onDataSourceChange: (data) => {
        props.onDataSourceChange?.(data)
        emit('update:dataSource', data)
      },
      onLoad: props.onLoad,
      onLoadingChange: props.onLoadingChange,
      onRequestError: props.onRequestError,
      postData: props.postData,
      revalidateOnFocus: props.revalidateOnFocus,
      manual: props.manual || props.manualRequest || formSearch.value === undefined,
      polling: props.polling as number | undefined,
      effectsGetter: () =>
        JSON.stringify([props.params, formSearch.value, proFilter.value, proSort.value]),
      debounceTime: props.debounceTime,
      onPageInfoChange: (pageInfo) => {
        if (!props.pagination || !fetchData.value) return

        const paginationConfig = typeof props.pagination === 'object' ? props.pagination : {}

        // 触发分页回调
        paginationConfig.onChange?.(pageInfo as any)
        paginationConfig.onPageSizeChange?.(pageInfo.pageSize, pageInfo as any)
      },
    })

    // 监听 request 变化，重新创建 fetchData
    watch(
      () => props.request,
      () => {
        if (props.request && !props.manual && !props.manualRequest) {
          action.reload()
        }
      },
    )

    // 监听 params 变化
    watch(
      () => props.params,
      () => {
        if (!props.manual && !props.manualRequest) {
          // 参数变化时重置到第一页
          action.setPageInfo({ current: 1 })
        }
      },
      { deep: true },
    )

    // 转换列配置
    const tableColumns = computed(() => {
      return genProColumnToColumn({
        columns: props.columns as ProTableColumn[],
        columnsMap: columnsMap.value,
        columnEmptyText: props.columnEmptyText,
        type: 'table',
        rowKey: props.rowKey,
      })
    })

    // 合并分页配置
    const paginationConfig = computed(() => {
      if (props.pagination === false) {
        return false
      }

      const defaultPagination = typeof props.pagination === 'object' ? props.pagination : {}

      return {
        ...defaultPagination,
        current: action.pageInfo.current,
        pageSize: action.pageInfo.pageSize,
        total: action.pageInfo.total,
        onChange: (pageNumber: any) => {
          // 调用用户的 onChange 回调
          defaultPagination.onChange?.(pageNumber)

          // 更新内部状态
          action.setPageInfo({
            current: pageNumber.current,
            pageSize: pageNumber.pageSize,
          })
        },
        onPageSizeChange: (pageSize: number, pageInfo: any) => {
          // 调用用户的 onPageSizeChange 回调
          defaultPagination.onPageSizeChange?.(pageSize, pageInfo)

          // 页面大小改变时重置到第一页
          action.setPageInfo({
            current: 1,
            pageSize,
          })
        },
      }
    })

    // ActionRef 实现
    const actionRef = computed<ActionRef>(() => ({
      reload: async (resetPageIndex?: boolean) => {
        await action.reload(resetPageIndex)
      },
      reloadAndReset: async () => {
        // 清空搜索表单
        formSearch.value = {}
        searchFormRef.value?.reset?.()

        // 重置排序和筛选
        proSort.value = {}
        proFilter.value = {}

        // 清空选择
        clearSelected()

        // 重置分页并重新加载
        action.reset()
        await action.reload()
      },
      reset: () => {
        // 清空搜索表单
        formSearch.value = {}
        searchFormRef.value?.reset?.()

        // 重置排序和筛选
        proSort.value = {}
        proFilter.value = {}

        // 清空选择
        clearSelected()

        // 重置分页
        action.reset()
      },
      setPageInfo: (pageInfo: Partial<PaginationParams>) => {
        action.setPageInfo(pageInfo)
      },
      clearSelected,
      setSortInfo: (sortInfo: SortInfo) => {
        proSort.value = sortInfo
      },
      setFilterInfo: (filterInfo: FilterInfo) => {
        proFilter.value = filterInfo
      },
    }))

    // 搜索表单提交
    const onFormSearchSubmit = (values: Record<string, any>) => {
      formSearch.value = values
      action.setPageInfo({
        current: 1,
      })
      action.reload()
    }

    // 搜索表单重置
    const onFormSearchReset = () => {
      formSearch.value = {}
      action.setPageInfo({
        current: 1,
      })
    }

    // 排序变化处理
    const onSortChange = (sortConfig: SortInfo | undefined) => {
      if (JSON.stringify(sortConfig) === JSON.stringify(proSort.value)) return
      proSort.value = sortConfig || {}
    }

    // 筛选变化处理
    const onFilterChange = (filterConfig: FilterInfo) => {
      if (JSON.stringify(filterConfig) === JSON.stringify(proFilter.value)) return
      proFilter.value = filterConfig || {}
    }

    // 提供上下文
    provide<ProTableContext>(ProTableContextKey, {
      actionRef: actionRef as any,
      columnsMap,
      setColumnsMap: (map) => {
        columnsMap.value = map
      },
    })

    // 暴露方法给父组件
    expose({
      ...actionRef.value,
      getSearchForm: () => searchFormRef.value,
      getAction: () => action,
    })

    // 清理
    onBeforeUnmount(() => {
      // 清理工作由 useFetchData 内部处理
    })

    return () => {
      const { ghost, cardBordered, toolbar, headerTitle } = props

      // 检查是否有列配置了 form 属性
      const hasFormColumns = (props.columns as ProTableColumn[]).some(
        (column) => column.form !== undefined,
      )

      // 搜索表单节点 - 只有当 search 不为 false 且有列配置了 form 属性时才渲染
      const searchNode =
        props.search !== false && hasFormColumns ? (
          <TableFormRender
            ref={searchFormRef}
            columns={props.columns as ProTableColumn[]}
            search={props.search}
            loading={action._refs.loading.value}
            onSubmit={onFormSearchSubmit}
            onReset={onFormSearchReset}
            manualRequest={props.manual || props.manualRequest}
            ghost={ghost}
            bordered={cardBordered}
          />
        ) : null

      // 工具栏节点
      const toolbarNode =
        toolbar !== false ? (
          <TableToolBar
            headerTitle={headerTitle}
            toolbar={toolbar}
            toolbarRender={
              props.toolbarRender
                ? (_ref: ActionRef) => props.toolbarRender!(actionRef as any)
                : undefined
            }
            columns={props.columns}
            actionRef={{ value: actionRef.value }}
            selectedRowKeys={selectedRowKeys.value}
            selectedRows={selectedRows.value}
            v-model:columnControllerVisible={columnControllerVisible.value}
            density={tableSize.value}
            onUpdate:density={(size: 'small' | 'medium' | 'large') => {
              tableSize.value = size
            }}
            columnsMap={columnsMap.value}
            onColumnsMapChange={(map: Record<string, ColumnsState>) => {
              columnsMap.value = map
            }}
          />
        ) : null

      // 批量操作提示
      const alertNode =
        props.rowSelection !== false ? (
          <TableAlert
            selectedRowKeys={selectedRowKeys.value}
            selectedRows={selectedRows.value}
            onCleanSelected={clearSelected}
            alertInfoRender={props.tableAlertRender}
            alertOptionRender={props.tableAlertOptionRender}
          />
        ) : null

      // 行选择配置
      const rowSelectionConfig = computed(() => {
        if (props.rowSelection === false || props.rowSelection === undefined) {
          return undefined
        }
        const config = typeof props.rowSelection === 'object' ? props.rowSelection : {}
        return {
          ...config,
          selectedRowKeys: selectedRowKeys.value,
        }
      })

      // 表格节点 - 使用转换后的列配置
      const tableNode = (
        <EnhancedTable
          {...attrs}
          {...listeners}
          size={tableSize.value}
          height={props.autoFill ? '100%' : undefined}
          bordered
          data={action._refs.dataSource.value}
          columns={tableColumns.value}
          loading={action._refs.loading.value}
          rowKey={props.rowKey}
          pagination={paginationConfig.value || undefined}
          selectedRowKeys={rowSelectionConfig.value ? selectedRowKeys.value : undefined}
          v-model:columnControllerVisible={columnControllerVisible.value}
          onSelectChange={(keys: (string | number)[], context: { selectedRowData: any[] }) => {
            handleSelectionChange(keys, context)
          }}
          onSortChange={(sort: any) => {
            if (sort) {
              const sortInfo: SortInfo = {}
              if (sort.sortBy) {
                sortInfo[sort.sortBy] = sort.descending ? 'desc' : 'asc'
              }
              onSortChange(sortInfo)
            } else {
              onSortChange(undefined)
            }
          }}
          onFilterChange={(filters: any) => {
            onFilterChange(filters || {})
          }}
          v-slots={slots}
        />
      )

      // 卡片包装
      if (ghost) {
        return (
          <div
            class={[
              't-pro-table',
              't-pro-table-ghost',
              props.autoFill ? 't-pro-table-autofill' : '',
            ]}
          >
            {searchNode}
            {toolbarNode}
            {alertNode}
            {tableNode}
          </div>
        )
      }

      return (
        <div class={['t-pro-table', props.autoFill ? 't-pro-table-autofill' : '']}>
          {searchNode && (
            <Card bordered={cardBordered} class="t-pro-table-search">
              {searchNode}
            </Card>
          )}
          <Card bordered={cardBordered} class="t-pro-table-content">
            {toolbarNode}
            {alertNode}
            {tableNode}
          </Card>
        </div>
      )
    }
  },
})

// 添加 install 方法
ProTable.install = (app: App) => {
  app.component('TProTable', ProTable)
}

export default ProTable
export * from './types'
export type { ProTableColumn, ProTableProps, RequestData } from './types'
