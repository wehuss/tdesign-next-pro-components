import { ProField } from '@/components/field/component'
import type { ProFieldValueEnumType, ProFieldValueType } from '@/components/field/types'
import { computed, defineComponent, inject, useModel, type PropType, type VNode } from 'vue'
import { EditOrReadOnlyContextKey } from '../../base-form/edit-or-read-only-context'
import { useFieldContext } from '../../field-context'
import { ProFormItem } from '../form-item'
import type { SearchTransformKeyFn } from '../types'

/**
 * ProFormField - 通用字段包装器组件
 * 可以渲染任意 valueType 的字段，是所有 ProForm 字段组件的基础
 */
export const ProFormField = defineComponent({
  name: 'ProFormField',
  props: {
    // 基础属性
    name: [String, Array] as PropType<string | string[]>,
    label: String,
    rules: Array,
    required: Boolean,
    help: String,
    extra: String,
    width: [String, Number],
    ignoreFormItem: Boolean,
    disabled: Boolean,
    readonly: Boolean,
    placeholder: [String, Array] as PropType<string | string[]>,
    emptyText: {
      type: String,
      default: '-',
    },
    // valueType 和 valueEnum
    valueType: {
      type: String as PropType<ProFieldValueType>,
      default: 'text',
    },
    valueEnum: {
      type: [Object, Map] as unknown as () => ProFieldValueEnumType,
      default: undefined,
    },
    // 渲染模式
    mode: {
      type: String as PropType<'edit' | 'read' | 'update'>,
      default: undefined,
    },
    // 字段属性
    fieldProps: {
      type: Object,
      default: () => ({}),
    },
    formItemProps: {
      type: Object,
      default: () => ({}),
    },
    // ProField 属性
    proFieldProps: {
      type: Object,
      default: () => ({}),
    },
    // 自定义渲染
    render: Function as PropType<(text: any, props: any, dom: VNode) => VNode | null>,
    formItemRender: Function as PropType<(text: any, props: any, dom: VNode) => VNode | null>,
    // 值转换
    transform: Function as PropType<SearchTransformKeyFn>,
    convertValue: Function,
    dataFormat: String,
    // 请求相关
    request: Function,
    params: Object,
    debounceTime: {
      type: Number,
      default: 300,
    },
    // 依赖值
    dependenciesValues: Object,
    originDependencies: Object,
    // 其他
    isDefaultDom: Boolean,
    plain: Boolean,
    text: null,
    cacheForSwr: {
      type: Boolean,
      default: false,
    },
    valuePropName: {
      type: String,
      default: 'value',
    },
    // 布局
    secondary: Boolean,
    colProps: Object,
    lightProps: Object,
    /** 在 QueryFilter 中占用的列数，默认为 1 */
    colSize: {
      type: Number,
      default: 1,
    },

    // v-model
    modelValue: null,
    'onUpdate:modelValue': Function,
    onChange: Function,
  },
  emits: ['update:modelValue', 'change'],
  setup(props, { emit, slots }) {
    // 使用 useModel 实现双向绑定
    const modelValue = useModel(props, 'modelValue')

    // 获取表单上下文
    const fieldContext = useFieldContext()

    // 获取编辑/只读模式上下文
    const editOrReadOnlyContext = inject(EditOrReadOnlyContextKey, {
      mode: 'edit',
    })

    // 计算当前模式
    const currentMode = computed(() => {
      // 优先使用 props.mode
      if (props.mode) return props.mode
      // 其次使用 readonly
      if (props.readonly) return 'read'
      // 最后使用上下文
      const contextMode =
        typeof editOrReadOnlyContext.mode === 'object' && 'value' in editOrReadOnlyContext.mode
          ? editOrReadOnlyContext.mode.value
          : editOrReadOnlyContext.mode
      return contextMode || 'edit'
    })

    // 合并 fieldProps
    const mergedFieldProps = computed(() => ({
      ...fieldContext.fieldProps,
      ...props.fieldProps,
    }))

    // 合并 formItemProps
    const mergedFormItemProps = computed(() => ({
      ...fieldContext.formItemProps,
      ...props.formItemProps,
    }))

    // 注册字段类型到上下文
    if (fieldContext.setFieldValueType && props.name) {
      const namePath = Array.isArray(props.name) ? props.name : [props.name]
      fieldContext.setFieldValueType(namePath, {
        valueType: props.valueType,
        dateFormat: props.dataFormat,
        transform: props.transform,
      })
    }

    // 处理值变更
    const handleChange = (value: unknown) => {
      emit('update:modelValue', value)
      emit('change', value)
    }

    return () => {
      // 如果有 children slot，优先渲染 children
      if (slots.default) {
        const children = slots.default()

        // 如果忽略 FormItem，直接返回 children
        if (props.ignoreFormItem) {
          return children
        }

        // 包装在 ProFormItem 中
        return (
          <ProFormItem
            name={props.name}
            label={props.label as string}
            rules={props.rules as any}
            required={props.required}
            help={props.help as string}
            extra={props.extra as string}
            width={props.width}
            valueType={props.valueType}
            transform={props.transform as any}
            dataFormat={props.dataFormat}
            lightProps={props.lightProps}
            secondary={props.secondary}
            colProps={props.colProps}
            colSize={props.colSize}
            {...mergedFormItemProps.value}
          >
            {children}
          </ProFormItem>
        )
      }

      // 渲染 ProField
      const fieldNode = (
        <ProField
          v-model={modelValue.value}
          valueType={props.valueType}
          mode={currentMode.value}
          valueEnum={props.valueEnum}
          disabled={props.disabled}
          readonly={props.readonly}
          placeholder={props.placeholder}
          emptyText={props.emptyText}
          fieldProps={mergedFieldProps.value}
          render={props.render}
          formItemRender={props.formItemRender}
          {...props.proFieldProps}
          onUpdate:modelValue={handleChange}
        />
      )

      // 如果忽略 FormItem，直接返回 ProField
      if (props.ignoreFormItem) {
        return fieldNode
      }

      // 包装在 ProFormItem 中
      return (
        <ProFormItem
          name={props.name}
          label={props.label as string}
          rules={props.rules as any}
          required={props.required}
          help={props.help as string}
          extra={props.extra as string}
          width={props.width}
          valueType={props.valueType}
          transform={props.transform as any}
          dataFormat={props.dataFormat}
          lightProps={props.lightProps}
          secondary={props.secondary}
          colProps={props.colProps}
          colSize={props.colSize}
          {...mergedFormItemProps.value}
        >
          {fieldNode}
        </ProFormItem>
      )
    }
  },
})

export default ProFormField
