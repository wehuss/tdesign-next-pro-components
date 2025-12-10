import { FormItem, type FormItemProps } from 'tdesign-vue-next'
import {
  cloneVNode,
  computed,
  defineComponent,
  inject,
  isVNode,
  onMounted,
  provide,
  useSlots,
  type InjectionKey,
  type PropType,
  type VNode,
} from 'vue'
import type { ProFieldValueType } from '../../../field/types'
import { LightWrapper } from '../../BaseForm/LightWrapper'
import { useFieldContext, type SearchTransformKeyFn } from '../../FieldContext'
import { useFormListContext } from '../List'

/**
 * 需要从 attrs 中过滤掉的属性列表
 * 这些属性通常来自 ProTable columns 配置，不应该传递给 TDesign FormItem
 */
const FILTERED_ATTRS = [
  'title',
  'description',
  'dataIndex',
  'key',
  'hideInTable',
  'hideInSearch',
  'hideInForm',
  'sorter',
  'filters',
  'ellipsis',
  'copyable',
  'order',
  'search',
  'editable',
  'fixed',
  'align',
  'className',
  'render',
  'renderText',
  'renderFormItem',
  'children',
  'onFilter',
  'onCell',
  'onHeaderCell',
  'valueType',
  'valueEnum',
  'fieldProps',
  'formItemProps',
  'proFieldProps',
  'request',
  'params',
  'debounceTime',
  'options',
  'transform',
  'convertValue',
  'dataFormat',
  'lightProps',
  'addonBefore',
  'addonAfter',
  'addonWarpStyle',
  'secondary',
  'colProps',
  'rowProps',
  'proFormFieldKey',
  'ignoreFormItem',
  'isListField',
  'emptyText',
  'getValueProps',
  'valuePropName',
]

/**
 * 过滤掉不需要传递给 TDesign FormItem 的属性
 * @param attrs 原始属性对象
 * @returns 过滤后的属性对象
 */
function filterAttrs(attrs: Record<string, any>): Record<string, any> {
  const result: Record<string, any> = {}
  for (const key of Object.keys(attrs)) {
    if (!FILTERED_ATTRS.includes(key)) {
      result[key] = attrs[key]
    }
  }
  return result
}

// FormItem 上下文
export interface FormItemContextValue {
  name?: string | string[]
  label?: string | VNode
}

export const FormItemContextKey: InjectionKey<FormItemContextValue> =
  Symbol('FormItemContext')

export const FormItemContext = {
  provide: (value: FormItemContextValue) => {
    provide(FormItemContextKey, value)
  },
  inject: () => {
    return inject(FormItemContextKey, { name: undefined, label: undefined })
  },
}

// 宽度预设映射
const WIDTH_MAP: Record<string, string> = {
  xs: '104px',
  sm: '216px',
  md: '328px',
  lg: '440px',
  xl: '552px',
}

export interface ProFormItemProps {
  /** 字段名 */
  name?: string | string[]
  /** 标签 */
  label?: FormItemProps['label']
  /** 校验规则 */
  rules?: any[]
  /** 是否必填 */
  required?: boolean
  /** 帮助信息 */
  help?:
    | string
    | VNode
    | ((params: { errors: VNode[]; warnings: VNode[] }) => VNode)
  /** 额外信息 */
  extra?: string | VNode
  /** 是否忽略 FormItem 包装 */
  ignoreFormItem?: boolean
  /** 值类型 */
  valueType?: string
  /** 提交时转换函数 */
  transform?: SearchTransformKeyFn
  /** 日期格式 */
  dataFormat?: string
  /** 轻量模式属性 */
  lightProps?: {
    light?: boolean
    customLightMode?: boolean
    label?: string | VNode
    labelTrigger?: string
    bordered?: boolean
    size?: 'small' | 'medium' | 'large'
    [key: string]: any
  }
  /** 字段唯一标识 */
  proFormFieldKey?: string | number
  /** 前置元素 */
  addonBefore?: string | VNode
  /** 后置元素 */
  addonAfter?: string | VNode
  /** 前后置元素包装样式 */
  addonWarpStyle?: Record<string, any>
  /** 获取时转换值 */
  convertValue?: (value: any, namePath: string | string[]) => any
  /** 宽度 */
  width?: number | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | string
  /** 是否禁用 */
  disabled?: boolean
  /** 是否只读 */
  readonly?: boolean
  /** 占位符 */
  placeholder?: string | string[]
  /** 空值文本 */
  emptyText?: string
  /** 是否次要 */
  secondary?: boolean
  /** 列属性 */
  colProps?: Record<string, any>
  /** 值属性名 */
  valuePropName?: string
  /** 获取值属性 */
  getValueProps?: (value: any) => Record<string, any>
  /** 是否为列表字段 */
  isListField?: boolean
}

export const ProFormItem = defineComponent({
  name: 'ProFormItem',
  inheritAttrs: false,
  props: {
    name: [String, Array] as PropType<string | string[]>,
    label: [String, Function] as PropType<FormItemProps['label']>,
    rules: Array as PropType<any[]>,
    required: {
      type: Boolean,
      default: false,
    },
    help: [String, Object, Function] as PropType<ProFormItemProps['help']>,
    extra: [String, Object] as PropType<string | VNode>,
    ignoreFormItem: {
      type: Boolean,
      default: false,
    },
    valueType: {
      type: String as PropType<ProFieldValueType>,
      default: 'text' as ProFieldValueType,
    },
    transform: Function as PropType<SearchTransformKeyFn>,
    dataFormat: String,
    lightProps: {
      type: Object as PropType<ProFormItemProps['lightProps']>,
      default: () => ({}),
    },
    proFormFieldKey: [String, Number],
    addonBefore: [String, Object] as PropType<string | VNode>,
    addonAfter: [String, Object] as PropType<string | VNode>,
    addonWarpStyle: {
      type: Object,
      default: () => ({}),
    },
    convertValue: Function as PropType<ProFormItemProps['convertValue']>,
    width: [Number, String] as PropType<ProFormItemProps['width']>,
    disabled: {
      type: Boolean,
      default: false,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    placeholder: [String, Array] as PropType<string | string[]>,
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
    valuePropName: {
      type: String,
      default: 'value',
    },
    getValueProps: Function as PropType<(value: any) => Record<string, any>>,
    isListField: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { attrs }) {
    const fieldContext = useFieldContext()
    const formListField = useFormListContext()
    const slotsInstance = useSlots()

    // 计算最终的 name（处理 FormList 嵌套）
    const finalName = computed(() => {
      if (props.name === undefined) return props.name

      // 如果在 FormList 中，需要合并路径
      if (formListField.name !== undefined) {
        const baseName = Array.isArray(props.name) ? props.name : [props.name]
        return [formListField.name, ...baseName].flat()
      }

      return Array.isArray(props.name) ? props.name : [props.name]
    })

    // 计算字段样式
    const fieldStyle = computed(() => {
      const style: Record<string, any> = {}

      if (props.width) {
        if (typeof props.width === 'number') {
          style.width = `${props.width}px`
        } else if (WIDTH_MAP[props.width]) {
          style.width = WIDTH_MAP[props.width]
        } else {
          style.width = props.width
        }
      }

      return style
    })

    // 提供 FormItem 上下文
    FormItemContext.provide({
      name: props.name,
      label: props.label,
    })

    // 注册字段类型到上下文
    onMounted(() => {
      if (fieldContext.setFieldValueType && props.name) {
        fieldContext.setFieldValueType(finalName.value as string[], {
          valueType: props.valueType,
          dateFormat: props.dataFormat,
          transform: props.transform,
        })
      }
    })

    // 是否需要 LightWrapper
    const needLightWrapper = computed(() => {
      return props.lightProps?.light && !props.lightProps?.customLightMode
    })

    // 处理值转换 - 保留用于未来扩展
    const _getValuePropsFunc = computed(() => {
      if (!props.convertValue && !props.getValueProps) {
        return undefined
      }

      return (value: any) => {
        const newValue = props.convertValue?.(value, props.name!) ?? value
        if (props.getValueProps) {
          return props.getValueProps(newValue)
        }
        return {
          [props.valuePropName]: newValue,
        }
      }
    })
    // 避免 lint 警告
    void _getValuePropsFunc.value

    // 渲染内容
    const renderContent = () => {
      const children = slotsInstance.default?.()

      if (!children || children.length === 0) {
        return null
      }

      // 处理子元素，注入 onChange 等属性
      const processedChildren = children.map((child, index) => {
        if (!isVNode(child)) return child

        // 检查是否是 ProForm 组件
        const isProFormComponent =
          (child.type as any)?.displayName === 'ProFormComponent'

        if (isProFormComponent) {
          // ProForm 组件，通过 fieldProps 传递属性
          return cloneVNode(child, {
            key: child.key ?? index,
            fieldProps: {
              ...(child.props as any)?.fieldProps,
              disabled: props.disabled,
              readonly: props.readonly,
              placeholder: props.placeholder,
            },
          })
        }

        return child
      })

      // 包装 LightWrapper
      let wrappedChildren: VNode | VNode[] = processedChildren
      if (needLightWrapper.value) {
        wrappedChildren = (
          <LightWrapper
            {...props.lightProps}
            label={props.lightProps?.label || props.label}
          >
            {processedChildren}
          </LightWrapper>
        )
      }

      // 处理前置后置元素
      if (!props.addonBefore && !props.addonAfter) {
        return wrappedChildren
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
          {wrappedChildren}
          {props.addonAfter && (
            <div style={{ marginLeft: '8px' }}>{props.addonAfter}</div>
          )}
        </div>
      )
    }

    // 过滤后的 attrs，移除不应传递给 TDesign FormItem 的属性
    const filteredAttrs = computed(() =>
      filterAttrs(attrs as Record<string, any>)
    )

    // 计算最终的 rules（处理 required 属性）
    const finalRules = computed(() => {
      const rules = props.rules ? [...props.rules] : []

      // 如果设置了 required 但没有 required 规则，自动添加
      if (props.required) {
        const hasRequiredRule = rules.some(
          (rule: any) => rule && rule.required === true
        )
        if (!hasRequiredRule) {
          rules.unshift({
            required: true,
            message: `${props.label || props.name || '此字段'}不能为空`,
          })
        }
      }

      return rules.length > 0 ? rules : undefined
    })

    return () => {
      const children = slotsInstance.default?.()

      // 如果 children 是函数，直接渲染（支持 Form.Item 的 render props 模式）
      if (typeof children?.[0] === 'function') {
        return (
          <FormItem
            name={Array.isArray(props.name) ? props.name.join('.') : props.name}
            label={props.label as string}
            rules={finalRules.value}
            help={
              typeof props.help === 'function'
                ? undefined
                : (props.help as string)
            }
            style={fieldStyle.value}
            {...filteredAttrs.value}
            {...(fieldContext.formItemProps || {})}
          >
            {children}
          </FormItem>
        )
      }

      // 如果忽略 FormItem，直接返回内容
      if (props.ignoreFormItem) {
        return renderContent()
      }

      // 计算 FormItem 的 name
      const formItemName = computed(() => {
        if (!finalName.value) return undefined
        return Array.isArray(finalName.value)
          ? finalName.value.join('.')
          : finalName.value
      })

      return (
        <FormItem
          name={formItemName.value}
          label={props.label}
          rules={finalRules.value}
          help={
            typeof props.help === 'function'
              ? undefined
              : (props.help as string)
          }
          style={fieldStyle.value}
          {...filteredAttrs.value}
          {...(fieldContext.formItemProps || {})}
        >
          {renderContent()}
        </FormItem>
      )
    }
  },
})

// 设置 displayName
ProFormItem.displayName = 'ProFormItem'

export default ProFormItem
