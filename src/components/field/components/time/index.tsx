import { TimePicker } from 'tdesign-vue-next'
import { defineComponent, ref, useModel } from 'vue'
import type { ProFieldMode } from '../../types'

/**
 * Time 组件 - 时间字段
 * 只读模式显示格式化时间，编辑模式显示时间选择器
 */
export const FieldTime = defineComponent({
  name: 'ProFieldTime',
  props: {
    modelValue: {
      type: [String, Number, Date, Object, null, undefined] as any,
      default: null,
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
      type: [String, Array] as any,
      default: '请选择时间',
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
  setup(props, { expose }) {
    const modelValue = useModel(props, 'modelValue')
    const dataEntryRef = ref<InstanceType<typeof TimePicker>>()
    const getDataEntryRef = () => dataEntryRef.value

    expose({
      getDataEntryRef,
      dataEntryRef
    })

    // 格式化时间显示
    const formatTime = (value: any) => {
      if (!value) return '-'

      try {
        let date: Date
        if (value instanceof Date) {
          date = value
        } else if (typeof value === 'string') {
          // 如果是时间字符串，尝试解析
          if (value.includes(':')) {
            const today = new Date()
            const [hours, minutes, seconds] = value.split(':').map(Number)
            date = new Date(
              today.getFullYear(),
              today.getMonth(),
              today.getDate(),
              hours,
              minutes,
              seconds || 0
            )
          } else {
            date = new Date(value)
          }
        } else if (typeof value === 'number') {
          date = new Date(value)
        } else {
          return '-'
        }

        if (isNaN(date.getTime())) return '-'

        const hours = String(date.getHours()).padStart(2, '0')
        const minutes = String(date.getMinutes()).padStart(2, '0')
        const seconds = String(date.getSeconds()).padStart(2, '0')

        return props.format
          .replace('HH', hours)
          .replace('mm', minutes)
          .replace('ss', seconds)
      } catch {
        return '-'
      }
    }

    return () => {
      // 只读模式显示格式化时间
      if (props.mode === 'read' || props.readonly) {
        return <span>{formatTime(modelValue.value)}</span>
      }

      // 编辑模式显示时间选择器
      return (
        <TimePicker
          ref={dataEntryRef}
          v-model={modelValue.value}
          format={props.format}
          placeholder={
            Array.isArray(props.placeholder)
              ? props.placeholder[0]
              : props.placeholder
          }
          disabled={props.disabled}
          {...props.fieldProps}
        />
      )
    }
  },
})

export default FieldTime
