import { InputNumber } from 'tdesign-vue-next'
import { defineComponent, ref, useModel } from 'vue'
import type { ProFieldMode } from '../../types'

/**
 * Money 组件 - 金额字段
 * 只读模式显示格式化金额，编辑模式显示数字输入框
 */
export const FieldMoney = defineComponent({
  name: 'ProFieldMoney',
  props: {
    modelValue: {
      type: [String, Number] as any,
      default: 0,
    },
    mode: {
      type: String as () => ProFieldMode,
      default: 'read' as ProFieldMode,
    },
    currency: {
      type: String,
      default: '¥',
    },
    locale: {
      type: String,
      default: 'zh-CN',
    },
    precision: {
      type: Number,
      default: 2,
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
    placeholder: {
      type: [String, Array] as any,
      default: '请输入金额',
    },
    min: {
      type: Number,
      default: undefined,
    },
    max: {
      type: Number,
      default: undefined,
    },
  },
  emits: ['update:modelValue', 'change'],
  setup(props, { expose }) {
    const modelValue = useModel(props, 'modelValue')
    const dataEntryRef = ref<InstanceType<typeof InputNumber>>()
    const getDataEntryRef = () => dataEntryRef.value

    expose({
      getDataEntryRef,
      dataEntryRef,
    })

    // 格式化金额显示
    const formatMoney = (value: string | number | null | undefined) => {
      if (value === null || value === undefined || value === '') return '-'

      const num = Number(value)
      if (isNaN(num)) return '-'
      console.log('props.currency', props.currency)
      try {
        return `${props.currency} ${num.toLocaleString(props.locale, {
          minimumFractionDigits: props.precision,
          maximumFractionDigits: props.precision,
        })}`
      } catch {
        return `${props.currency} ${num.toFixed(props.precision)}`
      }
    }

    return () => {
      // 只读模式显示格式化金额
      if (props.mode === 'read' || props.readonly) {
        return <span>{formatMoney(modelValue.value)}</span>
      }

      // 编辑模式显示数字输入框
      return (
        <InputNumber
          ref={dataEntryRef}
          v-model={modelValue.value}
          placeholder={props.placeholder}
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

export default FieldMoney
