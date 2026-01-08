import { TimeRangePicker } from 'tdesign-vue-next'
import { defineComponent, ref, useModel, type PropType } from 'vue'
import type { ProFieldMode } from '../../types'

/**
 * TimeRange 组件 - 时间范围字段
 * 只读模式显示格式化时间范围，编辑模式显示时间范围选择器
 */
export const FieldTimeRange = defineComponent({
  name: 'ProFieldTimeRange',
  props: {
    modelValue: {
      type: [Array] as PropType<string[]>,
      default: () => [],
    },
    mode: {
      type: String as () => ProFieldMode,
      default: 'read' as ProFieldMode,
    },
    format: {
      type: String,
      default: 'HH:mm:ss',
    },
    placeholder: {
      type: [String, Array] as PropType<string | string[]>,
      default: () => ['开始时间', '结束时间'],
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
    separator: {
      type: String,
      default: ' - ',
    },
  },
  emits: ['update:modelValue', 'change'],
  setup(props, { expose }) {
    const modelValue = useModel(props, 'modelValue')
    const dataEntryRef = ref<InstanceType<typeof TimeRangePicker>>()
    const getDataEntryRef = () => dataEntryRef.value

    expose({
      getDataEntryRef,
      dataEntryRef,
    })

    // 格式化时间范围显示
    const formatTimeRange = (value: string[] | null | undefined) => {
      if (!value || !Array.isArray(value) || value.length !== 2) return '-'
      if (!value[0] && !value[1]) return '-'

      return `${value[0] || ''}${props.separator}${value[1] || ''}`
    }

    return () => {
      // 只读模式显示格式化时间范围
      if (props.mode === 'read' || props.readonly) {
        return <span>{formatTimeRange(modelValue.value)}</span>
      }

      // 编辑模式显示时间范围选择器
      return (
        <TimeRangePicker
          ref={dataEntryRef}
          v-model={modelValue.value}
          format={props.format}
          placeholder={props.placeholder}
          disabled={props.disabled}
          {...props.fieldProps}
        />
      )
    }
  },
})

export default FieldTimeRange
