import { Textarea } from 'tdesign-vue-next'
import { defineComponent, ref, useModel } from 'vue'
import type { ProFieldMode } from '../../types'

/**
 * TextArea 组件 - 多行文本字段
 * 只读模式显示文本，编辑模式显示多行文本输入框
 */
export const FieldTextArea = defineComponent({
  name: 'ProFieldTextArea',
  props: {
    modelValue: {
      type: [String, Number, Boolean, Date, Object, null, undefined] as any,
      default: null,
    },
    mode: {
      type: String as () => ProFieldMode,
      default: 'read' as ProFieldMode,
    },
    rows: {
      type: Number,
      default: 3,
    },
    maxLength: {
      type: Number,
      default: undefined,
    },
    showWordLimit: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: [String, Array] as any,
      default: '请输入内容',
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
    const dataEntryRef = ref<InstanceType<typeof Textarea>>()
    const getDataEntryRef = () => dataEntryRef.value

    expose({
      getDataEntryRef,
      dataEntryRef,
    })

    return () => {
      const textValue = String(modelValue.value ?? '')

      // 只读模式显示文本，保留换行
      if (props.mode === 'read' || props.readonly) {
        return (
          <div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{textValue || '-'}</div>
        )
      }

      // 编辑模式显示多行文本输入框
      return (
        <Textarea
          ref={dataEntryRef}
          v-model={modelValue.value}
          placeholder={Array.isArray(props.placeholder) ? props.placeholder[0] : props.placeholder}
          disabled={props.disabled}
          rows={props.rows}
          maxlength={props.maxLength}
          showWordLimit={props.showWordLimit}
          {...props.fieldProps}
        />
      )
    }
  },
})

export default FieldTextArea
