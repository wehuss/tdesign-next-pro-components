import { InputNumber, Space } from 'tdesign-vue-next'
import { defineComponent, ref, watch } from 'vue'
import type { ProFieldMode } from '../../types'

export type DigitRangeValue =
  | [number | undefined, number | undefined]
  | undefined

/**
 * DigitRange 组件 - 数字范围字段
 * 支持 read/edit 模式
 */
export const FieldDigitRange = defineComponent({
  name: 'ProFieldDigitRange',
  props: {
    modelValue: {
      type: Array as unknown as () => DigitRangeValue,
      default: undefined,
    },
    mode: {
      type: String as () => ProFieldMode,
      default: 'read' as ProFieldMode,
    },
    separator: {
      type: String,
      default: '~',
    },
    separatorWidth: {
      type: Number,
      default: 30,
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
      default: () => ['请输入', '请输入'],
    },
  },
  emits: ['update:modelValue', 'change'],
  setup(props, { emit, expose }) {
    const dataEntryRef = ref<InstanceType<typeof InputNumber>>()
    const getDataEntryRef = () => dataEntryRef.value

    // 内部值状态
    const startValue = ref<number | undefined>(props.modelValue?.[0])
    const endValue = ref<number | undefined>(props.modelValue?.[1])

    // 监听外部值变化
    watch(
      () => props.modelValue,
      newValue => {
        startValue.value = newValue?.[0]
        endValue.value = newValue?.[1]
      },
      { deep: true }
    )

    // 更新值
    const updateValue = () => {
      const start = startValue.value
      const end = endValue.value

      // 当两个值都为 undefined 时，返回 undefined
      if (start === undefined && end === undefined) {
        emit('update:modelValue', undefined)
        emit('change', undefined)
        return
      }

      const newValue: DigitRangeValue = [start, end]
      emit('update:modelValue', newValue)
      emit('change', newValue)
    }

    // 失焦时自动排序
    const handleBlur = () => {
      const start = startValue.value
      const end = endValue.value

      if (typeof start === 'number' && typeof end === 'number' && start > end) {
        startValue.value = end
        endValue.value = start
      }
      updateValue()
    }

    // 处理开始值变化
    const handleStartChange = (value: number | undefined) => {
      startValue.value = value === null ? undefined : value
      updateValue()
    }

    // 处理结束值变化
    const handleEndChange = (value: number | undefined) => {
      endValue.value = value === null ? undefined : value
      updateValue()
    }

    // 获取占位符
    const getPlaceholder = (index: number): string => {
      if (Array.isArray(props.placeholder)) {
        return props.placeholder[index] || '请输入'
      }
      return props.placeholder || '请输入'
    }

    // 格式化数字显示
    const formatNumber = (num: number | undefined): string => {
      if (num === undefined || num === null) return '-'
      const intlProps = props.fieldProps?.intlProps || {}
      return new Intl.NumberFormat(undefined, {
        minimumSignificantDigits: 2,
        ...intlProps,
      }).format(num)
    }

    expose({
      getDataEntryRef,
      dataEntryRef,
    })

    return () => {
      // 只读模式显示范围文本
      if (props.mode === 'read' || props.readonly) {
        const start = props.modelValue?.[0]
        const end = props.modelValue?.[1]
        return (
          <span>
            {formatNumber(start)} {props.separator} {formatNumber(end)}
          </span>
        )
      }

      // 编辑模式显示两个数字输入框
      return (
        <Space>
          <InputNumber
            ref={dataEntryRef}
            modelValue={startValue.value}
            placeholder={getPlaceholder(0)}
            disabled={props.disabled}
            onBlur={handleBlur}
            onChange={handleStartChange}
            // style={{ width: `calc((100% - ${props.separatorWidth}px) / 2)` }}
            {...props.fieldProps}
          />
          <span
            style={{
              width: `${props.separatorWidth}px`,
              textAlign: 'center',
              display: 'inline-block',
            }}
          >
            {props.separator}
          </span>
          <InputNumber
            modelValue={endValue.value}
            placeholder={getPlaceholder(1)}
            disabled={props.disabled}
            onBlur={handleBlur}
            onChange={handleEndChange}
            // style={{ width: `calc((100% - ${props.separatorWidth}px) / 2)` }}
            {...props.fieldProps}
          />
        </Space>
      )
    }
  },
})

export default FieldDigitRange
