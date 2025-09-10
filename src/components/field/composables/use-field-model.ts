import { computed, type ComputedRef } from 'vue'

/**
 * 用于 Field 组件的 v-model 支持 hook
 * @param props 组件 props
 * @param emit 组件 emit 函数
 * @returns 当前值和变化处理函数
 */
export function useFieldModel<T = unknown>(
  props: {
    text?: T
    modelValue?: T
  },
  emit: (event: 'update:modelValue' | 'change', value: T) => void
) {
  // 计算当前值，优先使用 modelValue（v-model），然后是 text
  const currentValue: ComputedRef<T | undefined> = computed(() => {
    return props.modelValue !== undefined ? props.modelValue : props.text
  })

  // 处理值变化，同时触发 v-model 更新和 change 事件
  const handleChange = (value: T) => {
    emit('update:modelValue', value)
    emit('change', value)
  }

  return {
    currentValue,
    handleChange,
  }
}

/**
 * Field 组件的通用 props 定义
 */
export const fieldCommonProps = {
  text: {
    type: [
      String,
      Number,
      Boolean,
      Date,
      Object,
      Array,
      null,
      undefined,
    ] as unknown,
    default: null,
  },
  modelValue: {
    type: [
      String,
      Number,
      Boolean,
      Date,
      Object,
      Array,
      null,
      undefined,
    ] as unknown,
    default: undefined,
  },
  mode: {
    type: String as () => 'read' | 'edit' | 'update',
    default: 'read' as const,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  fieldProps: {
    type: Object as () => Record<string, unknown>,
    default: () => ({}),
  },
}

/**
 * Field 组件的通用 emits
 */
export const fieldCommonEmits = ['update:modelValue', 'change']
