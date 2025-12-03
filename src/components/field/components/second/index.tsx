import { InputNumber } from 'tdesign-vue-next'
import { computed, defineComponent, ref, useModel } from 'vue'
import type { ProFieldMode } from '../../types'

/**
 * 格式化秒数为可读字符串
 * @param seconds 秒数
 * @returns 格式化后的字符串
 */
export const formatSecond = (seconds: number): string => {
  let result = seconds
  let formatText = ''
  let isPast = false

  if (result < 0) {
    result = -result
    isPast = true
  }

  const d = Math.floor(result / (3600 * 24))
  const h = Math.floor((result / 3600) % 24)
  const m = Math.floor((result / 60) % 60)
  const s = Math.floor(result % 60)

  formatText = `${s}秒`
  if (m > 0) {
    formatText = `${m}分钟${formatText}`
  }
  if (h > 0) {
    formatText = `${h}小时${formatText}`
  }
  if (d > 0) {
    formatText = `${d}天${formatText}`
  }
  if (isPast) {
    formatText += '前'
  }

  return formatText
}

/**
 * Second 组件 - 秒数展示字段
 * 只读模式显示格式化的时间，编辑模式显示数字输入框
 */
export const FieldSecond = defineComponent({
  name: 'ProFieldSecond',
  props: {
    modelValue: {
      type: Number,
      default: 0,
    },
    mode: {
      type: String as () => ProFieldMode,
      default: 'read' as ProFieldMode,
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
      default: '请输入',
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

    // 格式化后的秒数文本
    const formattedText = computed(() => {
      const value = props.modelValue
      if (value === undefined || value === null) return '-'
      return formatSecond(Number(value))
    })

    return () => {
      // 只读模式显示格式化的时间
      if (props.mode === 'read' || props.readonly) {
        return <span>{formattedText.value}</span>
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
          min={0}
          style={{ width: '100%' }}
          {...props.fieldProps}
        />
      )
    }
  },
})

export default FieldSecond
