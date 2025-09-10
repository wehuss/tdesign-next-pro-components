import { Input } from 'tdesign-vue-next'
import { defineComponent, useModel } from 'vue'
import type { ProFieldMode } from '../../types'

/**
 * Text 组件 - 文本字段
 * 只读模式显示文本，编辑模式显示输入框
 */
export const FieldText = defineComponent({
  name: 'ProFieldText',
  props: {
    modelValue: {
      type: [String, Number, null, undefined] as any,
      default: '',
    },
    mode: {
      type: String as () => ProFieldMode,
      default: 'read' as ProFieldMode,
    },
    placeholder: {
      type: [String, Array] as any,
      default: '',
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
  setup(props) {
    const modelValue = useModel(props, 'modelValue')

    return () => {
      const displayValue = String(props.modelValue ?? '')

      // 只读模式直接显示文本
      if (props.mode === 'read' || props.readonly) {
        return <span>{displayValue}</span>
      }

      // 编辑模式显示输入框
      return (
        <Input
          v-model={modelValue.value}
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

export default FieldText
