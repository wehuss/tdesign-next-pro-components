import { Textarea } from 'tdesign-vue-next'
import type { CSSProperties } from 'vue'
import { computed, defineComponent, ref, useModel } from 'vue'
import type { ProFieldMode } from '../../types'

/**
 * 格式化代码文本
 * @param text 原始文本
 * @param language 语言类型
 * @returns 格式化后的文本
 */
const languageFormat = (text: string, language: string): string => {
  if (typeof text !== 'string') {
    return String(text ?? '')
  }
  try {
    if (language === 'json') {
      return JSON.stringify(JSON.parse(text), null, 2)
    }
  } catch {
    // 解析失败返回原始文本
  }
  return text
}

/**
 * Code 组件 - 代码展示字段
 * 支持 JSON 代码高亮显示
 */
export const FieldCode = defineComponent({
  name: 'ProFieldCode',
  props: {
    modelValue: {
      type: [String, Number, Object] as any,
      default: '',
    },
    mode: {
      type: String as () => ProFieldMode,
      default: 'read' as ProFieldMode,
    },
    language: {
      type: String as () => 'json' | 'text',
      default: 'text',
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
      default: '请输入代码',
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

    // 格式化后的代码
    const formattedCode = computed(() => {
      const text =
        typeof props.modelValue === 'object'
          ? JSON.stringify(props.modelValue)
          : String(props.modelValue ?? '')
      return languageFormat(text, props.language)
    })

    // 只读模式的样式
    const preStyle: CSSProperties = {
      padding: '16px',
      overflow: 'auto',
      fontSize: '85%',
      lineHeight: 1.45,
      color: 'var(--td-text-color-secondary)',
      fontFamily:
        'ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas, Liberation Mono, monospace',
      backgroundColor: 'rgba(150, 150, 150, 0.1)',
      borderRadius: '3px',
      width: 'min-content',
      minWidth: '200px',
      maxWidth: '100%',
      margin: 0,
      ...(props.fieldProps?.style || {}),
    }

    return () => {
      // 只读模式显示格式化的代码
      if (props.mode === 'read' || props.readonly) {
        return (
          <pre style={preStyle}>
            <code>{formattedCode.value}</code>
          </pre>
        )
      }

      // 编辑模式显示文本域
      return (
        <Textarea
          ref={dataEntryRef}
          v-model={modelValue.value}
          placeholder={Array.isArray(props.placeholder) ? props.placeholder[0] : props.placeholder}
          disabled={props.disabled}
          autosize={{ minRows: 5, maxRows: 20 }}
          {...props.fieldProps}
        />
      )
    }
  },
})

export default FieldCode
