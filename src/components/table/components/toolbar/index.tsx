import { RefreshIcon, SettingIcon } from 'tdesign-icons-vue-next'
import { Button, Space, Tooltip } from 'tdesign-vue-next'
import type { PropType } from 'vue'
import { defineComponent, ref } from 'vue'
import type { ActionRef, ProColumn, ToolbarConfig } from '../../types'

export default defineComponent({
  name: 'TableToolBar',
  props: {
    headerTitle: String,
    toolbar: {
      type: [Boolean, Object] as PropType<boolean | ToolbarConfig>,
      default: true,
    },
    toolbarRender: Function as PropType<(actionRef: ActionRef) => unknown[]>,
    columns: {
      type: Array as PropType<ProColumn[]>,
      required: true,
    },
    actionRef: Object as PropType<{ value: ActionRef }>,
    onColumnControllerVisibleChange: Function as PropType<
      (visible: boolean) => void
    >,
  },
  setup(props) {
    const columnControllerVisible = ref(false)

    // 处理刷新
    const handleReload = () => {
      props.actionRef?.value?.reload()
    }

    // 处理列设置
    const handleColumnSetting = () => {
      columnControllerVisible.value = !columnControllerVisible.value
      props.onColumnControllerVisibleChange?.(columnControllerVisible.value)
    }

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
            onClick={handleColumnSetting}
          />
        </Tooltip>,
      ]

      return (
        <div class="t-pro-table-toolbar">
          <div class="t-pro-table-toolbar-left">
            {headerTitle && (
              <div class="t-pro-table-toolbar-title">{headerTitle}</div>
            )}
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
