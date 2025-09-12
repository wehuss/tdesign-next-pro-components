import { DateRangePicker } from 'tdesign-vue-next'
import { defineComponent, ref, useModel, type PropType } from 'vue'
import type { ProFieldMode } from '../../types'

/**
 * DateRange 组件 - 日期范围字段
 * 只读模式显示格式化日期范围，编辑模式显示日期范围选择器
 */
export const FieldDateRange = defineComponent({
  name: 'ProFieldDateRange',
  props: {
    modelValue: {
      type: [Array] as PropType<string[] | Date[]>,
      default: () => [],
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
    separator: {
      type: String,
      default: ' ~ ',
    },
    placeholder: {
      type: [String, Array] as PropType<string | string[]>,
      default: () => ['开始日期', '结束日期'],
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
    const dataEntryRef = ref<InstanceType<typeof DateRangePicker>>()
    const getDataEntryRef = () => dataEntryRef.value

    expose({
      getDataEntryRef,
      dataEntryRef
    })

    // 格式化单个日期
    const formatSingleDate = (value: any) => {
      if (!value) return ''

      try {
        let date: Date
        if (value instanceof Date) {
          date = value
        } else if (typeof value === 'string' || typeof value === 'number') {
          date = new Date(value)
        } else {
          return ''
        }

        if (isNaN(date.getTime())) return ''

        // 简单的日期格式化
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')

        return props.format
          .replace('YYYY', String(year))
          .replace('MM', month)
          .replace('DD', day)
      } catch {
        return ''
      }
    }

    // 格式化日期范围显示
    const formatDateRange = (value: string[] | Date[] | null | undefined) => {
      if (!value || !Array.isArray(value) || value.length !== 2) return '-'

      const startDate = formatSingleDate(value[0])
      const endDate = formatSingleDate(value[1])

      if (!startDate || !endDate) return '-'

      return `${startDate}${props.separator}${endDate}`
    }

    return () => {
      // 只读模式显示格式化日期范围
      if (props.mode === 'read' || props.readonly) {
        return <span>{formatDateRange(modelValue.value)}</span>
      }

      // 编辑模式显示日期范围选择器
      return (
        <DateRangePicker
          ref={dataEntryRef}
          v-model={modelValue.value}
          format={props.format}
          valueFormat={props.valueFormat}
          placeholder={
            Array.isArray(props.placeholder)
              ? props.placeholder
              : [props.placeholder, props.placeholder]
          }
          disabled={props.disabled}
          separator={props.separator}
          {...props.fieldProps}
        />
      )
    }
  },
})

export default FieldDateRange
