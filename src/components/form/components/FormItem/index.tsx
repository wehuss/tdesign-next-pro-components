import { FormItem } from 'tdesign-vue-next'
import { computed, defineComponent, inject, provide, useSlots } from 'vue'
import { LightWrapper } from '../../BaseForm/LightWrapper'
import { useFieldContext } from '../../FieldContext'

// FormItem上下文
export const FormItemContext = {
  provide: (value: { name?: any; label?: any }) => {
    provide('FormItemContext', value)
  },
  inject: () => {
    return inject('FormItemContext', { name: undefined, label: undefined })
  },
}

export const ProFormItem = defineComponent({
  name: 'ProFormItem',
  props: {
    // 基础FormItem属性
    name: {
      type: [String, Array],
    },
    label: {
      type: String,
    },
    rules: {
      type: Array,
    },
    required: {
      type: Boolean,
      default: false,
    },
    help: {
      type: String,
    },
    extra: {
      type: String,
    },
    // ProForm扩展属性
    ignoreFormItem: {
      type: Boolean,
      default: false,
    },
    valueType: {
      type: String,
      default: 'text',
    },
    transform: {
      type: Function,
    },
    dataFormat: {
      type: String,
    },
    lightProps: {
      type: Object,
      default: () => ({}),
    },
    proFormFieldKey: {
      type: [String, Number],
    },
    // 前置和后置元素
    addonBefore: {
      type: [String, Object],
    },
    addonAfter: {
      type: [String, Object],
    },
    addonWarpStyle: {
      type: Object,
      default: () => ({}),
    },
    // 值转换
    convertValue: {
      type: Function,
    },
    // 宽度设置
    width: {
      type: [Number, String],
    },
    // 其他属性
    disabled: {
      type: Boolean,
      default: false,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: [String, Array],
    },
    emptyText: {
      type: String,
      default: '-',
    },
    secondary: {
      type: Boolean,
      default: false,
    },
    colProps: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props, { slots, attrs }) {
    const fieldContext = useFieldContext()
    const slotsInstance = useSlots()

    // 计算最终的name
    const finalName = computed(() => {
      if (props.name === undefined) return props.name
      // TODO: 处理FormList的name合并逻辑
      return Array.isArray(props.name) ? props.name : [props.name]
    })

    // 计算样式
    const fieldStyle = computed(() => {
      const style: any = {}
      
      if (props.width) {
        if (typeof props.width === 'number') {
          style.width = `${props.width}px`
        } else if (typeof props.width === 'string') {
          // 处理预设宽度
          const widthMap = {
            xs: '104px',
            sm: '216px', 
            md: '328px',
            lg: '440px',
            xl: '552px',
          }
          style.width = widthMap[props.width as keyof typeof widthMap] || props.width
        }
      }
      
      return style
    })

    // 提供FormItem上下文
    FormItemContext.provide({
      name: props.name,
      label: props.label,
    })

    // 注册字段类型到上下文
    if (fieldContext.setFieldValueType && props.name) {
      fieldContext.setFieldValueType(finalName.value, {
        valueType: props.valueType,
        dateFormat: props.dataFormat,
        transform: props.transform,
      })
    }

    return () => {
      const children = slotsInstance.default?.()

      // 如果忽略FormItem，直接返回children
      if (props.ignoreFormItem) {
        return children
      }

      // 包装children的逻辑
      const wrappedChildren = children

      // 是否需要LightWrapper
      const needLightWrapper = props.lightProps?.light && !props.lightProps?.customLightMode

      const finalChildren = needLightWrapper ? (
        <LightWrapper {...props.lightProps}>
          {wrappedChildren}
        </LightWrapper>
      ) : wrappedChildren

      // 处理前置后置元素
      const renderContent = () => {
        if (!props.addonBefore && !props.addonAfter) {
          return finalChildren
        }

        return (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              ...props.addonWarpStyle,
            }}
          >
            {props.addonBefore && (
              <div style={{ marginRight: '8px' }}>{props.addonBefore}</div>
            )}
            {finalChildren}
            {props.addonAfter && (
              <div style={{ marginLeft: '8px' }}>{props.addonAfter}</div>
            )}
          </div>
        )
      }

      return (
        <FormItem
          name={Array.isArray(props.name) ? props.name.join('.') : props.name}
          label={props.label}
          rules={props.rules as any}
          help={props.help}
          style={fieldStyle.value}
          {...attrs}
          {...(fieldContext.formItemProps || {})}
        >
          {renderContent()}
        </FormItem>
      )
    }
  },
})

export default ProFormItem