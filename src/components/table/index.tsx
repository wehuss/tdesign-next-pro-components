import useListeners from '@/hooks/listeners'
import { Card, Table } from 'tdesign-vue-next'
import type { App } from 'vue'
import { defineComponent, ref } from 'vue'
import TableAlert from './components/alert'
import SearchForm from './components/search-form'
import TableToolBar from './components/toolbar'
import { useProTable } from './hooks/use-pro-table'
import './style/index.less'

const ProTable = defineComponent({
  name: 'TProTable',
  props: {
    // 数据相关
    request: Function,
    dataSource: Array,
    params: Object,

    // 列配置
    columns: {
      type: Array,
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
    toolbarRender: Function,

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
    headerTitle: String,
    tooltip: String,

    // 分页
    pagination: {
      type: [Boolean, Object],
      default: true,
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

  setup(props, { slots, attrs, expose, emit }) {
    const { listeners } = useListeners()
    const columnControllerVisible = ref(props.columnControllerVisible)

    console.log('columns', props.columns, props)
    // 使用核心 hook
    const {
      tableData,
      tableColumns,
      tableLoading,
      searchFormRef,
      actionRef,
      onSearch,
      onReset,
      reload,
    } = useProTable(props)

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

      // 处理列配置显示状态变化
      const handleColumnControllerVisibleChange = (visible: boolean) => {
        columnControllerVisible.value = visible
      }

      // 工具栏节点
      const toolbarNode =
        toolbar !== false ? (
          <TableToolBar
            headerTitle={headerTitle}
            toolbar={toolbar}
            toolbarRender={props.toolbarRender}
            columns={props.columns}
            actionRef={actionRef}
            onColumnControllerVisibleChange={
              handleColumnControllerVisibleChange
            }
          />
        ) : null

      // 批量操作提示
      const alertNode = <TableAlert />

      // 表格节点
      const tableNode = (
        <Table
          {...attrs}
          {...listeners}
          data={tableData.value}
          columns={tableColumns.value}
          loading={tableLoading.value}
          rowKey={props.rowKey}
          pagination={props.pagination}
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
