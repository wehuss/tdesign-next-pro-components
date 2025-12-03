import { InputNumber, Progress } from 'tdesign-vue-next'
import { computed, defineComponent, ref, useModel } from 'vue'
import type { ProFieldMode } from '../../types'

/**
 * 获取进度条状态
 * @param percent 百分比
 * @returns 状态
 */
const getProgressStatus = (
  percent: number
): 'success' | 'error' | 'warning' | 'active' | undefined => {
  if (percent === 100) {
    return 'success'
  }
  if (percent < 0) {
    return 'error'
  }
  if (percent < 100) {
    return 'active'
  }
  return undefined
}

/**
 * 将值转换为数字
 * @param value 值
 * @returns 数字
 */
const toNumber = (value: string | number | undefined | null): number => {
  if (value === undefined || value === null) return 0
  if (typeof value === 'string') {
    const num = parseFloat(value.replace('%', ''))
    return isNaN(num) ? 0 : num
  }
  return value
}

/**
 * Progress 组件 - 进度条字段
 * 只读模式显示进度条，编辑模式显示数字输入框
 */
export const FieldProgress = defineComponent({
  name: 'ProFieldProgress',
  props: {
    modelValue: {
      type: [Number, String],
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

    // 计算百分比值
    const percentValue = computed(() => toNumber(props.modelValue))

    // 计算状态
    const status = computed(() => getProgressStatus(percentValue.value))

    return () => {
      // 只读模式显示进度条
      if (props.mode === 'read' || props.readonly) {
        return (
          <Progress
            percentage={percentValue.value}
            status={status.value}
            style={{ minWidth: '100px', maxWidth: '320px' }}
            {...props.fieldProps}
          />
        )
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
          max={100}
          suffix="%"
          {...props.fieldProps}
        />
      )
    }
  },
})

export default FieldProgress
