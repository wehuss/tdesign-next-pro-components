import { InputNumber } from 'tdesign-vue-next'
import { defineComponent, useModel } from 'vue'
import type { ProFieldMode } from '../../types'

/**
 * Digit 组件 - 数字字段
 * 只读模式显示格式化数字，编辑模式显示数字输入框
 */
export const FieldDigit = defineComponent({
  name: 'ProFieldDigit',
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
      default: 0,
    },
    min: {
      type: Number,
      default: undefined,
    },
    max: {
      type: Number,
      default: undefined,
    },
    step: {
      type: Number,
      default: 1,
    },
    placeholder: {
      type: [String, Array] as any,
      default: '请输入数字',
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
  emits: ['update:modelValue', 'change'],
  setup(props) {
    const modelValue = useModel(props, 'modelValue')

    // 格式化数字显示
    const formatDigit = (value: any) => {
      if (value === null || value === undefined || value === '') return '-'

      const num = Number(value)
      if (isNaN(num)) return '-'

      return num.toFixed(props.precision)
    }

    return () => {
      // 只读模式显示格式化数字
      if (props.mode === 'read' || props.readonly) {
        return <span>{formatDigit(modelValue.value)}</span>
      }

      // 编辑模式显示数字输入框
      return (
        <InputNumber
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
          step={props.step}
          {...props.fieldProps}
        />
      )
    }
  },
})

export default FieldDigit
