import { InputNumber, Progress } from 'tdesign-vue-next'
import { defineComponent, ref, useModel } from 'vue'
import type { ProFieldMode } from '../../types'

/**
 * Percent 组件 - 百分比字段
 * 只读模式显示百分比或进度条，编辑模式显示数字输入框
 */
export const FieldPercent = defineComponent({
  name: 'ProFieldPercent',
  props: {
    modelValue: {
      type: [String, Number, null, undefined] as any,
      default: null,
    },
    mode: {
      type: String as () => ProFieldMode,
      default: 'read' as ProFieldMode,
    },
    precision: {
      type: Number,
      default: 2,
    },
    showSymbol: {
      type: Boolean,
      default: true,
    },
    showProgress: {
      type: Boolean,
      default: false,
    },
    min: {
      type: Number,
      default: 0,
    },
    max: {
      type: Number,
      default: 100,
    },
    placeholder: {
      type: [String, Array] as any,
      default: '请输入百分比',
    },
    fieldProps: {
      type: Object as any,
      default: () => ({}),
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { expose }) {
    const modelValue = useModel(props, 'modelValue')
    const dataEntryRef = ref<InstanceType<typeof InputNumber>>()
    const getDataEntryRef = () => dataEntryRef.value

    expose({
      getDataEntryRef,
      dataEntryRef
    })
    // 格式化百分比显示
    const formatPercent = (value: any) => {
      if (value === null || value === undefined || value === '') return '-'

      const num = Number(value)
      if (isNaN(num)) return '-'

      const formatted = num.toFixed(props.precision)
      return props.showSymbol ? `${formatted}%` : formatted
    }

    // 获取进度条状态
    const getProgressStatus = (
      value: number
    ): 'success' | 'error' | 'warning' | undefined => {
      if (value >= 100) return 'success'
      if (value >= 30) return undefined // normal
      if (value >= 60) return 'warning'
      return 'error'
    }

    return () => {
      const numValue = Number(modelValue.value) || 0

      // 只读模式显示百分比或进度条
      if (props.mode === 'read' || props.readonly) {
        if (props.showProgress) {
          return (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Progress
                percentage={numValue}
                status={getProgressStatus(numValue)}
                size="small"
                style={{ flex: 1 }}
              />
              <span style={{ minWidth: '50px', textAlign: 'right' }}>
                {formatPercent(modelValue.value)}
              </span>
            </div>
          )
        }
        return <span>{formatPercent(modelValue.value)}</span>
      }

      // 编辑模式显示数字输入框
      return (
        <InputNumber
          ref={dataEntryRef}
          v-model={modelValue.value}
          placeholder={
            Array.isArray(props.placeholder)
              ? props.placeholder[0]
              : props.placeholder
          }
          disabled={props.disabled}
          decimalPlaces={props.precision}
          min={props.min}
          max={props.max}
          {...props.fieldProps}
        />
      )
    }
  },
})

export default FieldPercent
