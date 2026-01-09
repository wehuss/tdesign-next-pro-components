/**
 * TableAlert 组件
 * 用于显示表格选中状态和批量操作
 * 参考 ant-design/pro-components Alert 组件
 */

import { Link, Space } from 'tdesign-vue-next'
import type { PropType, VNode } from 'vue'
import { computed, defineComponent } from 'vue'
import './style.less'

// 国际化类型（简化版）
export interface IntlType {
  getMessage: (id: string, defaultMessage: string) => string
}

// 默认国际化实现
const defaultIntl: IntlType = {
  getMessage: (_id: string, defaultMessage: string) => defaultMessage,
}

// AlertRender 类型
export type AlertRenderType<T> =
  | ((props: {
      intl: IntlType
      selectedRowKeys: (number | string)[]
      selectedRows: T[]
      onCleanSelected: () => void
    }) => VNode | VNode[] | string | null)
  | false

// TableAlert Props 类型
export interface TableAlertProps<T = any> {
  selectedRowKeys: (number | string)[]
  selectedRows: T[]
  alwaysShowAlert?: boolean
  alertInfoRender?: AlertRenderType<T>
  onCleanSelected: () => void
  alertOptionRender?: AlertRenderType<T>
}

// 默认的选项渲染函数
const defaultAlertOptionRender = (props: { intl: IntlType; onCleanSelected: () => void }) => {
  const { intl, onCleanSelected } = props
  return (
    <Link theme="primary" onClick={onCleanSelected}>
      {intl.getMessage('alert.clear', '清空')}
    </Link>
  )
}

// 默认的信息渲染函数
const defaultAlertInfoRender = <T,>(props: {
  intl: IntlType
  selectedRowKeys: (number | string)[]
  selectedRows: T[]
  onCleanSelected: () => void
}) => {
  const { intl, selectedRowKeys } = props
  return (
    <Space>
      <span>{intl.getMessage('alert.selected', '已选择')}</span>
      <span class="t-pro-table-alert-info-highlight">{selectedRowKeys.length}</span>
      <span>{intl.getMessage('alert.item', '项')}</span>
    </Space>
  )
}

export default defineComponent({
  name: 'TableAlert',
  props: {
    // 选中的行 keys
    selectedRowKeys: {
      type: Array as PropType<(number | string)[]>,
      default: () => [],
    },
    // 选中的行数据
    selectedRows: {
      type: Array as PropType<any[]>,
      default: () => [],
    },
    // 是否始终显示 Alert
    alwaysShowAlert: {
      type: Boolean,
      default: false,
    },
    // 自定义信息渲染
    alertInfoRender: {
      type: [Function, Boolean] as PropType<AlertRenderType<any>>,
      default: undefined,
    },
    // 清空选中回调
    onCleanSelected: {
      type: Function as PropType<() => void>,
      default: () => {},
    },
    // 自定义选项渲染
    alertOptionRender: {
      type: [Function, Boolean] as PropType<AlertRenderType<any>>,
      default: undefined,
    },
    // 国际化（可选）
    intl: {
      type: Object as PropType<IntlType>,
      default: () => defaultIntl,
    },
  },

  setup(props) {
    // 计算是否应该显示
    const shouldShow = computed(() => {
      // 如果 alertInfoRender 为 false，不显示
      if (props.alertInfoRender === false) {
        return false
      }
      // 如果没有选中项且不是始终显示，不显示
      if (props.selectedRowKeys.length < 1 && !props.alwaysShowAlert) {
        return false
      }
      return true
    })

    // 渲染信息内容
    const renderInfo = computed(() => {
      const intl = props.intl || defaultIntl
      const renderProps = {
        intl,
        selectedRowKeys: props.selectedRowKeys,
        selectedRows: props.selectedRows,
        onCleanSelected: props.onCleanSelected,
      }

      // 使用自定义渲染或默认渲染
      if (typeof props.alertInfoRender === 'function') {
        return props.alertInfoRender(renderProps)
      }
      return defaultAlertInfoRender(renderProps)
    })

    // 渲染选项内容
    const renderOption = computed(() => {
      const intl = props.intl || defaultIntl
      const renderProps = {
        intl,
        selectedRowKeys: props.selectedRowKeys,
        selectedRows: props.selectedRows,
        onCleanSelected: props.onCleanSelected,
      }

      // 如果 alertOptionRender 为 false，不渲染选项
      if (props.alertOptionRender === false) {
        return null
      }

      // 使用自定义渲染或默认渲染
      if (typeof props.alertOptionRender === 'function') {
        return props.alertOptionRender(renderProps)
      }
      return defaultAlertOptionRender(renderProps)
    })

    return () => {
      if (!shouldShow.value) {
        return null
      }

      // 检查 renderInfo 是否返回 false（自定义渲染函数可能返回 false）
      const infoContent = renderInfo.value as VNode | VNode[] | string | null | false
      if (infoContent === false || infoContent === null) {
        return null
      }

      return (
        <div class="t-pro-table-alert">
          <div class="t-pro-table-alert-container">
            <div class="t-pro-table-alert-info">
              <div class="t-pro-table-alert-info-content">{infoContent}</div>
              {renderOption.value && (
                <div class="t-pro-table-alert-info-option">{renderOption.value}</div>
              )}
            </div>
          </div>
        </div>
      )
    }
  },
})
