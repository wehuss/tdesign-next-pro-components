import { DatePicker, Tooltip } from 'tdesign-vue-next'
import { computed, defineComponent, ref, useModel } from 'vue'
import type { ProFieldMode } from '../../types'

/**
 * 计算相对时间
 * @param date 日期
 * @returns 相对时间字符串
 */
const getRelativeTime = (date: Date | string | number): string => {
  const now = new Date()
  const target = new Date(date)
  const diff = now.getTime() - target.getTime()
  const absDiff = Math.abs(diff)
  const isPast = diff > 0

  const seconds = Math.floor(absDiff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  const months = Math.floor(days / 30)
  const years = Math.floor(days / 365)

  let result: string
  if (years > 0) {
    result = `${years}年`
  } else if (months > 0) {
    result = `${months}个月`
  } else if (days > 0) {
    result = `${days}天`
  } else if (hours > 0) {
    result = `${hours}小时`
  } else if (minutes > 0) {
    result = `${minutes}分钟`
  } else {
    result = '刚刚'
    return result
  }

  return isPast ? `${result}前` : `${result}后`
}

/**
 * 格式化日期
 * @param date 日期
 * @param format 格式
 * @returns 格式化后的日期字符串
 */
const formatDate = (
  date: Date | string | number,
  format: string = 'YYYY-MM-DD HH:mm:ss',
): string => {
  const d = new Date(date)
  if (isNaN(d.getTime())) return '-'

  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  const seconds = String(d.getSeconds()).padStart(2, '0')

  return format
    .replace('YYYY', String(year))
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds)
}

/**
 * FromNow 组件 - 相对时间字段
 * 显示相对于当前时间的时间差
 */
export const FieldFromNow = defineComponent({
  name: 'ProFieldFromNow',
  props: {
    modelValue: {
      type: [String, Number, Date] as any,
      default: undefined,
    },
    mode: {
      type: String as () => ProFieldMode,
      default: 'read' as ProFieldMode,
    },
    format: {
      type: String,
      default: 'YYYY-MM-DD HH:mm:ss',
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
      default: '请选择',
    },
  },
  emits: ['update:modelValue', 'change'],
  setup(props, { expose }) {
    const modelValue = useModel(props, 'modelValue')
    const dataEntryRef = ref<InstanceType<typeof DatePicker>>()
    const getDataEntryRef = () => dataEntryRef.value

    expose({
      getDataEntryRef,
      dataEntryRef,
    })

    // 相对时间
    const relativeTime = computed(() => {
      if (!props.modelValue) return '-'
      return getRelativeTime(props.modelValue)
    })

    // 完整时间（用于 tooltip）
    const fullTime = computed(() => {
      if (!props.modelValue) return ''
      const format = props.fieldProps?.format || props.format
      return formatDate(props.modelValue, format)
    })

    return () => {
      // 只读模式显示相对时间，hover 显示完整时间
      if (props.mode === 'read' || props.readonly) {
        if (!props.modelValue) return <span>-</span>

        return (
          <Tooltip content={fullTime.value}>
            <span style={{ cursor: 'pointer' }}>{relativeTime.value}</span>
          </Tooltip>
        )
      }

      // 编辑模式显示日期时间选择器
      return (
        <DatePicker
          ref={dataEntryRef}
          v-model={modelValue.value}
          placeholder={Array.isArray(props.placeholder) ? props.placeholder[0] : props.placeholder}
          disabled={props.disabled}
          enableTimePicker
          {...props.fieldProps}
        />
      )
    }
  },
})

export default FieldFromNow
