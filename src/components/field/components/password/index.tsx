import { Input } from 'tdesign-vue-next'
import { defineComponent, ref, useModel } from 'vue'
import type { ProFieldMode } from '../../types'

/**
 * Password 组件 - 密码字段
 * 只读模式显示掩码，编辑模式显示密码输入框
 */
export const FieldPassword = defineComponent({
  name: 'ProFieldPassword',
  props: {
    modelValue: {
      type: [String, Number, Boolean, Date, Object, null, undefined] as any,
      default: null,
    },
    mode: {
      type: String as () => ProFieldMode,
      default: 'read' as ProFieldMode,
    },
    visibilityToggle: {
      type: Boolean,
      default: true,
    },
    placeholder: {
      type: [String, Array] as any,
      default: '请输入密码',
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
    const dataEntryRef = ref<InstanceType<typeof Input>>()
    const getDataEntryRef = () => dataEntryRef.value

    expose({
      getDataEntryRef,
      dataEntryRef,
    })

    return () => {
      const textValue = String(modelValue.value ?? '')

      // 只读模式显示掩码
      if (props.mode === 'read' || props.readonly) {
        if (!textValue) return <span>-</span>
        return <span>{'•'.repeat(Math.min(textValue.length, 8))}</span>
      }

      // 编辑模式显示密码输入框
      return (
        <Input
          ref={dataEntryRef}
          type="password"
          v-model={modelValue.value}
          placeholder={Array.isArray(props.placeholder) ? props.placeholder[0] : props.placeholder}
          disabled={props.disabled}
          showPassword={props.visibilityToggle}
          {...props.fieldProps}
        />
      )
    }
  },
})

export default FieldPassword
