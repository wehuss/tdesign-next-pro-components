import type { App, PropType, VNode } from 'vue'
import { defineComponent } from 'vue'
import type {
  ProFieldMode,
  ProFieldRenderProps,
  ProFieldTextType,
  ProFieldValueType,
} from './types.ts'
import { valueTypeToComponentMap } from './value-type-map.tsx'

/**
 * 默认的渲染文本函数
 * @param modelValue 模型值
 * @param valueType 值类型
 * @param props 渲染属性
 * @returns 渲染结果
 */
export const defaultRenderText = (
  modelValue: ProFieldTextType,
  valueType: ProFieldValueType = 'text',
  props: ProFieldRenderProps = {},
): VNode | null => {
  const { mode = 'read', emptyText = '-' } = props

  // 处理空值情况
  if (emptyText !== false && mode === 'read' && valueType !== 'option' && valueType !== 'switch') {
    if (typeof modelValue !== 'boolean' && typeof modelValue !== 'number' && !modelValue) {
      return <>{emptyText}</>
    }
  }

  // 判断是否需要使用 select 组件
  // 当 valueType 为 'text' 且存在 valueEnum 时，应该使用 select 组件渲染
  const hasValueEnum =
    props.valueEnum &&
    ((props.valueEnum instanceof Map && props.valueEnum.size > 0) ||
      (typeof props.valueEnum === 'object' && Object.keys(props.valueEnum).length > 0))
  const actualValueType = valueType === 'text' && hasValueEnum ? 'select' : valueType

  // 获取对应的组件配置
  const componentConfig = valueTypeToComponentMap[actualValueType]

  if (!componentConfig) {
    console.warn(`未找到 valueType "${actualValueType}" 对应的组件配置`)
    return <>{String(modelValue)}</>
  }

  // 根据模式选择对应的渲染函数
  const renderFunc = mode === 'read' ? componentConfig.render : componentConfig.formItemRender

  if (!renderFunc) {
    return <>{String(modelValue)}</>
  }

  return renderFunc(modelValue, props)
}

/**
 * ProField 组件
 * 通用的字段渲染组件，支持多种值类型和渲染模式
 * 只使用 modelValue 实现标准的 v-model 双向绑定
 */
export const ProField = defineComponent({
  name: 'ProField',
  props: {
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
      ] as PropType<ProFieldTextType>,
      default: undefined,
    },
    valueType: {
      type: String as PropType<ProFieldValueType>,
      default: 'text' as ProFieldValueType,
    },
    mode: {
      type: String as PropType<ProFieldMode>,
      default: 'read' as ProFieldMode,
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
      type: [String, Array] as PropType<string | string[]>,
      default: '',
    },
    emptyText: {
      type: [String, Boolean] as PropType<string | false>,
      default: '-',
    },
    valueEnum: {
      type: [Object, Map],
      default: () => ({}),
    },
    fieldProps: {
      type: Object as PropType<Record<string, unknown>>,
      default: () => ({}),
    },
    render: {
      type: Function as PropType<
        (modelValue: ProFieldTextType, props: ProFieldRenderProps, dom: VNode) => VNode | null
      >,
      default: undefined,
    },
    formItemRender: {
      type: Function as PropType<
        (modelValue: ProFieldTextType, props: ProFieldRenderProps, dom: VNode) => VNode | null
      >,
      default: undefined,
    },
  },
  emits: ['update:modelValue', 'change'],
  setup(props, { emit }) {
    // 处理值变更 - 标准 v-model 实现
    const handleChange = (value: unknown) => {
      emit('update:modelValue', value)
      emit('change', value)
    }

    return () => {
      // 渲染配置
      const renderProps: ProFieldRenderProps = {
        mode: props.readonly ? 'read' : props.mode,
        modelValue: props.modelValue,
        fieldProps: {
          ...props.fieldProps,
          // 传递 v-model 相关属性给子组件
          modelValue: props.modelValue,
          'onUpdate:modelValue': handleChange,
          placeholder: props.placeholder,
          disabled: props.disabled,
        },
        placeholder: props.placeholder,
        valueEnum: props.valueEnum as any,
        readonly: props.readonly,
        disabled: props.disabled,
        emptyText: props.emptyText,
        render: props.render,
        formItemRender: props.formItemRender,
      }

      // 如果有自定义渲染函数，使用自定义渲染
      const customRender = props.mode === 'read' ? props.render : props.formItemRender
      if (customRender) {
        const defaultDom = defaultRenderText(props.modelValue, props.valueType, renderProps)
        return customRender(props.modelValue, renderProps, defaultDom!)
      }

      // 使用默认渲染
      return defaultRenderText(props.modelValue, props.valueType, renderProps)
    }
  },
})

// 为组件添加 install 方法，支持全局注册
ProField.install = (app: App) => {
  app.component(ProField.name!, ProField)
}

export default ProField
