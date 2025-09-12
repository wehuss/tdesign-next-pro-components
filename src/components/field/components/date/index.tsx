import { DatePicker } from 'tdesign-vue-next'
import { defineComponent, ref, useModel } from 'vue'
import type { ProFieldMode } from '../../types'

/**
 * Date 组件 - 日期字段
 * 只读模式显示格式化日期，编辑模式显示日期选择器
 */
export const FieldDate = defineComponent({
  name: 'ProFieldDate',
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
      default: 'YYYY-MM-DD',
    },
    valueFormat: {
      type: String,
      default: 'YYYY-MM-DD',
    },
    placeholder: {
      type: [String, Array] as any,
      default: '请选择日期',
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
    const dataEntryRef = ref<InstanceType<typeof DatePicker>>()
    const getDataEntryRef = () => dataEntryRef.value

    expose({
      getDataEntryRef,
      dataEntryRef
    })

    // 格式化日期显示
    const formatDate = (value: any) => {
      if (!value) return '-'

      try {
        let date: Date
        if (value instanceof Date) {
          date = value
        } else if (typeof value === 'string' || typeof value === 'number') {
          date = new Date(value)
        } else {
          return '-'
        }

        if (isNaN(date.getTime())) return '-'

        // 简单的日期格式化
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')

        return props.format
          .replace('YYYY', String(year))
          .replace('MM', month)
          .replace('DD', day)
      } catch {
        return '-'
      }
    }

    return () => {
      // 只读模式显示格式化日期
      if (props.mode === 'read' || props.readonly) {
        return <span>{formatDate(modelValue.value)}</span>
      }

      // 编辑模式显示日期选择器
      return (
        <DatePicker
          ref={dataEntryRef}
          v-model={modelValue.value}
          format={props.format}
          valueFormat={props.valueFormat}
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

export default FieldDate
