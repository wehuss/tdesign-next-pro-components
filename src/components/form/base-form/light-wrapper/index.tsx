import { ChevronDownIcon, CloseCircleFilledIcon } from 'tdesign-icons-vue-next'
import { Button, Popup } from 'tdesign-vue-next'
import type { CSSProperties, PropType, VNode } from 'vue'
import { cloneVNode, computed, defineComponent, ref, watch } from 'vue'
import type { LightFilterFooterRender } from '../../typing'

export type SizeType = 'small' | 'medium' | 'large'

export interface LightWrapperProps {
  /** 标签文本 */
  label?: string | VNode
  /** 是否禁用 */
  disabled?: boolean
  /** 占位符 */
  placeholder?: string | VNode
  /** 尺寸 */
  size?: SizeType
  /** 当前值 */
  value?: any
  /** 值变化回调 */
  onChange?: (value?: any) => void
  /** 失焦回调 */
  onBlur?: (value?: any) => void
  /** 样式 */
  style?: CSSProperties
  /** 类名 */
  className?: string
  /** 值属性名 */
  valuePropName?: string
  /** 是否自定义轻量模式 */
  customLightMode?: boolean
  /** 是否启用轻量模式 */
  light?: boolean
  /** 自定义label值格式化 */
  labelFormatter?: (value: any) => string | VNode
  /** 变体样式 */
  variant?: 'outlined' | 'filled' | 'borderless'
  /** 其他字段属性 */
  otherFieldProps?: any
  /** 值类型 */
  valueType?: string
  /** 是否允许清除 */
  allowClear?: boolean
  /** 底部渲染函数 */
  footerRender?: LightFilterFooterRender
  /** 弹出位置 */
  placement?:
    | 'top'
    | 'bottom'
    | 'left'
    | 'right'
    | 'top-left'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-right'
}

/**
 * 日期格式映射
 */
const dateFormatterMap: Record<string, string> = {
  date: 'YYYY-MM-DD',
  dateTime: 'YYYY-MM-DD HH:mm:ss',
  dateWeek: 'YYYY-wo',
  dateMonth: 'YYYY-MM',
  dateQuarter: 'YYYY-[Q]Q',
  dateYear: 'YYYY',
  dateRange: 'YYYY-MM-DD',
  dateTimeRange: 'YYYY-MM-DD HH:mm:ss',
  time: 'HH:mm:ss',
  timeRange: 'HH:mm:ss',
}

/**
 * 格式化日期数组
 */
const dateArrayFormatter = (value: any[], _format: string): string => {
  if (!Array.isArray(value) || value.length === 0) return ''
  return value.join(' ~ ')
}

export const LightWrapper = defineComponent({
  name: 'LightWrapper',
  props: {
    label: {
      type: [String, Function] as PropType<string | (() => VNode)>,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: [String, Function] as PropType<string | (() => VNode)>,
    },
    size: {
      type: String as PropType<SizeType>,
      default: 'medium',
    },
    value: {
      type: null as unknown as PropType<any>,
    },
    onChange: {
      type: Function as PropType<(value?: any) => void>,
    },
    onBlur: {
      type: Function as PropType<(value?: any) => void>,
    },
    style: {
      type: Object as PropType<CSSProperties>,
      default: () => ({}),
    },
    className: {
      type: String,
    },
    valuePropName: {
      type: String,
      default: 'value',
    },
    customLightMode: {
      type: Boolean,
      default: false,
    },
    light: {
      type: Boolean,
      default: false,
    },
    labelFormatter: {
      type: Function as PropType<(value: any) => string | VNode>,
    },
    variant: {
      type: String as PropType<'outlined' | 'filled' | 'borderless'>,
      default: 'outlined',
    },
    otherFieldProps: {
      type: Object,
      default: () => ({}),
    },
    valueType: {
      type: String,
    },
    allowClear: {
      type: Boolean,
      default: true,
    },
    footerRender: {
      type: [Function, Boolean] as PropType<LightFilterFooterRender>,
      default: undefined,
    },
    placement: {
      type: String as PropType<
        | 'top'
        | 'bottom'
        | 'left'
        | 'right'
        | 'top-left'
        | 'top-right'
        | 'bottom-left'
        | 'bottom-right'
      >,
      default: 'bottom-left',
    },
  },
  setup(props, { slots }) {
    const open = ref(false)
    const tempValue = ref<any>(null)

    // 监听外部值变化，同步到临时值
    watch(
      () => props.value,
      (newVal) => {
        tempValue.value = newVal
      },
      { immediate: true },
    )

    // 处理值变化
    const handleChange = (...args: any[]) => {
      props.otherFieldProps?.onChange?.(...args)
      props.onChange?.(...args)
    }

    // 处理清除
    const handleClear = (e?: Event) => {
      e?.stopPropagation()
      handleChange(undefined)
      tempValue.value = null
    }

    // 处理确认
    const handleConfirm = () => {
      handleChange(tempValue.value)
      open.value = false
    }

    // 处理临时值变化
    const handleTempChange = (e: any) => {
      tempValue.value = e?.target ? e.target.value : e
    }

    // 计算显示的标签值文本
    const labelValueText = computed(() => {
      const labelValue = props.value
      if (!labelValue) return labelValue

      // 处理日期范围类型
      if (
        props.valueType?.toLowerCase()?.endsWith('range') &&
        props.valueType !== 'digitRange' &&
        !props.labelFormatter
      ) {
        return dateArrayFormatter(labelValue, dateFormatterMap[props.valueType] || 'YYYY-MM-DD')
      }

      // 处理数组值（如多选）
      if (Array.isArray(labelValue)) {
        return labelValue
          .map((item) => {
            if (typeof item === 'object' && item?.label && item?.value) {
              return item.label
            }
            return item
          })
          .join(', ')
      }

      return labelValue
    })

    // 格式化显示文本
    const formattedText = computed(() => {
      if (props.labelFormatter) {
        return props.labelFormatter(labelValueText.value)
      }
      return labelValueText.value
    })

    // 是否有值
    const hasValue = computed(() => {
      const val = props.value
      if (val === undefined || val === null || val === '') return false
      if (Array.isArray(val) && val.length === 0) return false
      return true
    })

    // 获取显示文本
    const getDisplayText = () => {
      if (hasValue.value) {
        const prefix = props.label ? (
          <span class="t-pro-light-wrapper-label-text">{props.label}:</span>
        ) : null

        return (
          <span class="t-pro-light-wrapper-value">
            {prefix}
            <span class="t-pro-light-wrapper-value-text">{formattedText.value}</span>
          </span>
        )
      }
      return props.label || props.placeholder
    }

    // 尺寸映射
    const sizeClassMap = {
      small: 't-pro-light-wrapper--small',
      medium: 't-pro-light-wrapper--medium',
      large: 't-pro-light-wrapper--large',
    }

    // 渲染标签触发器
    const renderLabel = () => {
      const sizeClass = sizeClassMap[props.size || 'medium']
      const variantClass = props.variant !== 'borderless' ? 't-pro-light-wrapper--bordered' : ''
      const activeClass = hasValue.value ? 't-pro-light-wrapper--active' : ''
      const disabledClass = props.disabled ? 't-pro-light-wrapper--disabled' : ''
      const clearableClass = props.allowClear ? 't-pro-light-wrapper--clearable' : ''

      return (
        <span
          class={[
            't-pro-light-wrapper-trigger',
            sizeClass,
            variantClass,
            activeClass,
            disabledClass,
            clearableClass,
            props.className,
          ]}
          style={props.style}
        >
          {getDisplayText()}
          {hasValue.value && props.allowClear && !props.disabled && (
            <CloseCircleFilledIcon
              class="t-pro-light-wrapper-icon t-pro-light-wrapper-close"
              onClick={(context: { e: MouseEvent }) => handleClear(context.e)}
            />
          )}
          <ChevronDownIcon class="t-pro-light-wrapper-icon t-pro-light-wrapper-arrow" />
        </span>
      )
    }

    // 渲染底部
    const renderFooter = () => {
      if (props.footerRender === false) return null

      if (typeof props.footerRender === 'function') {
        return props.footerRender(handleConfirm, () => {
          tempValue.value = null
        })
      }

      return (
        <div class="t-pro-light-wrapper-footer">
          <Button
            size="small"
            variant="text"
            onClick={() => {
              tempValue.value = null
            }}
          >
            清除
          </Button>
          <Button size="small" theme="primary" onClick={() => handleConfirm()}>
            确定
          </Button>
        </div>
      )
    }

    // 渲染内容
    const renderContent = () => {
      const children = slots.default?.()
      if (!children || children.length === 0) return null

      // 克隆子元素并注入props
      const clonedChildren = children.map((child) => {
        if (typeof child === 'object' && child !== null) {
          return cloneVNode(child, {
            [props.valuePropName]: tempValue.value,
            onChange: handleTempChange,
            'onUpdate:modelValue': handleTempChange,
          })
        }
        return child
      })

      return (
        <div class="t-pro-light-wrapper-content">
          <div class="t-pro-light-wrapper-container">{clonedChildren}</div>
          {renderFooter()}
        </div>
      )
    }

    return () => {
      // 如果不是light模式或者是自定义light模式，直接渲染children
      if (!props.light || props.customLightMode) {
        return slots.default?.()
      }

      return (
        <Popup
          trigger="click"
          visible={open.value}
          onVisibleChange={(visible: boolean) => {
            if (!props.disabled) {
              open.value = visible
            }
          }}
          placement={props.placement}
          overlayClassName="t-pro-light-wrapper-popup"
          content={renderContent}
          disabled={props.disabled}
        >
          {renderLabel()}
        </Popup>
      )
    }
  },
})

export default LightWrapper
