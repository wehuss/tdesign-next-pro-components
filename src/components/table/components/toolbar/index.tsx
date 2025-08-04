import { RefreshIcon, SettingIcon } from 'tdesign-icons-vue-next'
import { Button, Space, Tooltip } from 'tdesign-vue-next'
import type { PropType, VNode } from 'vue'
import { computed, defineComponent, useModel } from 'vue'
import type { ActionRef, ProTableColumn, ToolbarConfig } from '../../types'
import { renderProNode } from '../../utils/node'

export default defineComponent({
  name: 'TableToolBar',
  props: {
    headerTitle: [String, Function] as PropType<string | (() => VNode)>,
    toolbar: {
      type: [Boolean, Object] as PropType<boolean | ToolbarConfig>,
      default: true,
    },
    toolbarRender: Function as PropType<(actionRef: ActionRef) => VNode>,
    columns: {
      type: Array as PropType<ProTableColumn[]>,
      required: true,
    },
    actionRef: Object as PropType<{ value: ActionRef }>,
    onColumnControllerVisibleChange: Function as PropType<
      (visible: boolean) => void
    >,
    columnControllerVisible: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const columnControllerVisible = useModel(props, 'columnControllerVisible')
    const toggleColumnControllerVisible = () => {
      columnControllerVisible.value = !columnControllerVisible.value
    }
    // 处理刷新
    const handleReload = () => {
      props.actionRef?.value?.reload()
    }

    const showHeaderTitle = computed(() => !!props.headerTitle)
    const renderHeaderTitle = () => (
      <div class="t-pro-table-toolbar-title">
        {renderProNode(props.headerTitle)}
      </div>
    )
    return () => {
      const { headerTitle, toolbar, toolbarRender, actionRef } = props

      if (toolbar === false) {
        return null
      }

      // 自定义工具栏按钮
      const customActions = actionRef?.value
        ? toolbarRender?.(actionRef.value) || []
        : []

      // 默认工具栏按钮
      const defaultSettings = [
        <Tooltip content="刷新" key="reload">
          <Button
            variant="text"
            shape="square"
            icon={() => <RefreshIcon />}
            onClick={handleReload}
          />
        </Tooltip>,
        <Tooltip content="列设置" key="setting">
          <Button
            variant="text"
            shape="square"
            icon={() => <SettingIcon />}
            onClick={toggleColumnControllerVisible}
          />
        </Tooltip>,
      ]

      return (
        <div class="t-pro-table-toolbar">
          <div class="t-pro-table-toolbar-left">
            {showHeaderTitle.value ? renderHeaderTitle() : null}
          </div>
          <div class="t-pro-table-toolbar-right">
            <Space size="small">
              {customActions}
              {defaultSettings}
            </Space>
          </div>
        </div>
      )
    }
  },
})
