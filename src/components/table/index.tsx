/**
 * ProTable 表格组件
 * 基于 ant-design/pro-components 的 Table.tsx 移植
 */

import useListeners from '@/hooks/listeners'
import { Card, EnhancedTable, type PaginationProps } from 'tdesign-vue-next'
import type { App, PropType, Ref, VNode } from 'vue'
import { computed, defineComponent, useModel } from 'vue'
import TableAlert from './components/alert'
import TableToolBar from './components/toolbar'
import { useProTable } from './hooks/use-pro-table'
import './style/index.less'
import type { ActionRef, ProNode, ProTableColumn } from './types'

const ProTable = defineComponent({
  name: 'ProTable',
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

    // 请求相关
    manual: {
      type: Boolean,
      default: false,
    },
    polling: [Number, Boolean] as PropType<number | boolean>,
    onLoad: Function,
    onRequestError: Function,
    postData: Function,
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
    } = useProTable({
      columns: props.columns as any,
      request: props.request as any,
      dataSource: props.dataSource as any,
      params: props.params,
      manual: props.manual,
      polling: props.polling,
      onLoad: props.onLoad as any,
      onRequestError: props.onRequestError as any,
      postData: props.postData as any,
      pagination: props.pagination as any,
    })

    // 合并分页配置
    const paginationConfig = computed(() => {
      if (props.pagination === false) {
        return false
      }

      const defaultPagination =
        typeof props.pagination === 'object' ? props.pagination : {}

      return {
        ...defaultPagination,
        current: pageInfo.value.current,
        pageSize: pageInfo.value.pageSize,
        total: pageInfo.value.total,
        onChange: (pageNumber: any) => {
          // 调用用户的 onChange 回调
          defaultPagination.onChange?.(pageNumber)

          // 更新内部状态
          setPageInfo({
            current: pageNumber.current,
            pageSize: pageNumber.pageSize,
          })
        },
        onPageSizeChange: (pageSize: number, pageInfo: any) => {
          // 调用用户的 onPageSizeChange 回调
          defaultPagination.onPageSizeChange?.(pageSize, pageInfo)

          // 页面大小改变时重置到第一页
          setPageInfo({
            current: 1,
            pageSize,
          })
        },
      }
    })

    // 暴露方法给父组件
    expose({
      ...actionRef.value,
      getSearchForm: () => searchFormRef.value,
    })

    return () => {
      const { ghost, cardBordered, toolbar, headerTitle } = props

      // 搜索表单节点（暂时为空，稍后实现）
      const searchNode = null

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

      // 表格节点 - 使用转换后的列配置
      const tableNode = (
        <EnhancedTable
          {...attrs}
          {...listeners}
          {...props}
          bordered
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
