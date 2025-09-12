import { defineComponent, useModel } from 'vue'
import { ProFormItem } from '../components/FormItem'

// 创建表单字段组件的工厂函数
export function createField<T = any>(config: {
  name: string
  renderFormItem: (props: any, context: any) => any
}) {
  return defineComponent({
    name: config.name,
    props: {
      // 基础属性
      name: String,
      label: String,
      rules: Array,
      required: Boolean,
      help: String,
      extra: String,
      width: [String, Number],
      ignoreFormItem: Boolean,
      valueType: String,
      transform: Function,
      convertValue: Function,
      lightProps: Object,
      addonBefore: [String, Object],
      addonAfter: [String, Object],
      addonWarpStyle: Object,
      disabled: Boolean,
      readonly: Boolean,
      placeholder: String,
      emptyText: String,
      secondary: Boolean,
      colProps: Object,
      fieldProps: Object,
      options: Array,
      // v-model
      modelValue: null,
      'onUpdate:modelValue': Function,
      onChange: Function,
      onBlur: Function,
      onFocus: Function,
    },
    emits: ['update:modelValue', 'change', 'blur', 'focus'],
    setup(props: any, { slots, emit, attrs }) {
      // 使用 useModel 实现双向绑定
      const modelValue = useModel(props, 'modelValue')

      return () => {
        // 如果设置了 ignoreFormItem，直接渲染表单控件
        if (props.ignoreFormItem) {
          return config.renderFormItem({ ...props, modelValue: modelValue.value }, { slots })
        }

        // 否则包装在 ProFormItem 中
        return (
          <ProFormItem
            name={props.name}
            label={props.label}
            rules={props.rules}
            required={props.required}
            help={props.help}
            extra={props.extra}
            width={props.width}
            lightProps={props.lightProps}
            addonBefore={props.addonBefore}
            addonAfter={props.addonAfter}
            addonWarpStyle={props.addonWarpStyle}
            secondary={props.secondary}
            colProps={props.colProps}
            {...attrs}
          >
            {config.renderFormItem({ ...props, modelValue: modelValue.value }, { slots })}
          </ProFormItem>
        )
      }
    },
  })
}