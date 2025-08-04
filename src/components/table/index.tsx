import useListeners from '@/hooks/listeners'
import { Card, EnhancedTable, type PaginationProps } from 'tdesign-vue-next'
import type { App, PropType, Ref, VNode } from 'vue'
import { computed, defineComponent, useModel } from 'vue'
import TableAlert from './components/alert'
import SearchForm from './components/search-form'
import TableToolBar from './components/toolbar'
import { useProTable } from './hooks/use-pro-table'
import './style/index.less'
import type { ActionRef, ProNode, ProTableColumn } from './types'
import { mergePagination } from './utils/pagination-utils'

const ProTable = defineComponent({
  name: 'ProTable',
  extends: EnhancedTable,
  props: {
    // 数据相关
    request: Function,
    dataSource: Array,
    params: Object,

    // 列配置
    columns: {
      type: Array as PropType<ProTableColumn[]>,
      required: true,
    },

    // 搜索表单
    search: {
      type: [Boolean, Object],
      default: true,
    },

    // 工具栏
    toolbar: {
      type: [Boolean, Object],
      default: true,
    },
    toolbarRender: Function as PropType<(actionRef: ActionRef) => VNode>,

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

    // 其他 Table 属性
    loading: Boolean,
    rowKey: {
      type: String,
      default: 'id',
    },
  },

  setup(props, { slots, attrs, expose }) {
    const { listeners } = useListeners()
    const columnControllerVisible = useModel(props, 'columnControllerVisible')

    // 使用核心 hook
    const {
      tableData,
      tableColumns,
      tableLoading,
      searchFormRef,
      actionRef,
      pageInfo,
      onSearch,
      onReset,
      reload,
      setPageInfo,
    } = useProTable(props as any)

    // 合并分页配置
    const paginationConfig = computed(() => {
      return mergePagination(props.pagination, pageInfo.value, newPageInfo => {
        setPageInfo(newPageInfo)
      })
    })

    // 暴露方法给父组件
    expose({
      reload,
      reset: onReset,
      getSearchForm: () => searchFormRef.value,
      ...actionRef.value,
    })

    return () => {
      const { ghost, cardBordered, search, toolbar, headerTitle } = props

      // 搜索表单节点
      const searchNode =
        search !== false ? (
          <SearchForm
            ref={searchFormRef}
            columns={props.columns}
            search={search}
            onSubmit={onSearch}
            onReset={onReset}
          />
        ) : null

      // 工具栏节点
      const toolbarNode =
        toolbar !== false ? (
          <TableToolBar
            headerTitle={headerTitle}
            toolbar={toolbar}
            toolbarRender={props.toolbarRender}
            columns={props.columns}
            actionRef={actionRef as Ref<ActionRef>}
            v-model:columnControllerVisible={columnControllerVisible.value}
          />
        ) : null

      // 批量操作提示
      const alertNode = <TableAlert />

      // 表格节点
      const tableNode = (
        <EnhancedTable
          {...attrs}
          {...listeners}
          {...props}
          data={tableData.value}
          columns={tableColumns.value}
          loading={tableLoading.value}
          rowKey={props.rowKey}
          pagination={paginationConfig.value || undefined}
          v-model:columnControllerVisible={columnControllerVisible.value}
          v-slots={slots}
        />
      )

      // 卡片包装
      if (ghost) {
        return (
          <div class="t-pro-table t-pro-table-ghost">
            {searchNode}
            {toolbarNode}
            {alertNode}
            {tableNode}
          </div>
        )
      }

      return (
        <div class="t-pro-table">
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
