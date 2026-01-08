import { Space } from 'tdesign-vue-next'
import { cloneVNode, computed, defineComponent, isVNode, type PropType, type VNode } from 'vue'

export interface ProFormFieldSetProps {
  /** 字段值（数组形式） */
  value?: any[]
  /** 值变化回调 */
  onChange?: (value: any[]) => void
  /** 值属性名 */
  valuePropName?: string
  /** 布局类型 */
  type?: 'space' | 'group'
  /** Space 组件属性 */
  space?: {
    size?: 'small' | 'medium' | 'large' | number
    direction?: 'horizontal' | 'vertical'
    align?: 'start' | 'end' | 'center' | 'baseline'
    wrap?: boolean
  }
  /** 字段属性 */
  fieldProps?: Record<string, any>
  /** 值转换函数 */
  convertValue?: (value: any, namePath: string | string[]) => any
  /** 提交时转换函数 */
  transform?: (value: any, namePath: string | string[], allValues: any) => any
  /** 子元素 */
  children?: ((value: any[], props: any) => VNode | VNode[]) | VNode | VNode[]
}

/**
 * 从事件中获取值
 */
function getValueFromEvent(valuePropName: string, ...args: any[]) {
  const event = args[0]
  if (event && event.target && valuePropName in event.target) {
    return (event.target as HTMLInputElement)[valuePropName as keyof HTMLInputElement]
  }
  return event
}

/**
 * 将子元素转换为数组
 */
function childrenToArray(children: any): any[] {
  if (Array.isArray(children)) {
    return children.flat()
  }
  if (typeof children === 'function') {
    return [children]
  }
  if (children) {
    return [children]
  }
  return []
}

export const ProFormFieldSet = defineComponent({
  name: 'ProFormFieldSet',
  props: {
    value: {
      type: Array as PropType<any[]>,
      default: () => [],
    },
    onChange: Function as PropType<(value: any[]) => void>,
    valuePropName: {
      type: String,
      default: 'value',
    },
    type: {
      type: String as PropType<'space' | 'group'>,
      default: 'space',
    },
    space: {
      type: Object as PropType<ProFormFieldSetProps['space']>,
      default: () => ({}),
    },
    fieldProps: {
      type: Object,
      default: () => ({}),
    },
    convertValue: Function as PropType<ProFormFieldSetProps['convertValue']>,
    transform: Function as PropType<ProFormFieldSetProps['transform']>,
    children: [Function, Object, Array] as PropType<ProFormFieldSetProps['children']>,
  },
  setup(props, { slots }) {
    // 处理单个字段值变化
    const handleFieldChange = (fieldValue: any, index: number) => {
      const newValues = [...(props.value || [])]
      newValues[index] = getValueFromEvent(props.valuePropName, fieldValue)
      props.onChange?.(newValues)
      props.fieldProps?.onChange?.(newValues)
    }

    // 计算子元素列表
    const childrenList = computed(() => {
      // 获取子元素
      let children: any
      if (typeof props.children === 'function') {
        children = props.children(props.value || [], props)
      } else if (props.children) {
        children = props.children
      } else if (slots.default) {
        // 避免重复传递 value
        const { value: _value, ...restProps } = props
        children = slots.default({ value: props.value, ...restProps })
      }

      const childArray = childrenToArray(children)
      let itemIndex = -1

      return childArray.map((item: any) => {
        if (!isVNode(item)) return item

        itemIndex += 1
        const index = itemIndex
        const itemValue = props.value?.[index]

        // 检查是否是 ProForm 组件
        const isProFormItem =
          (item.type as any)?.displayName === 'ProFormComponent' || (item.props as any)?.readonly

        if (isProFormItem) {
          // ProForm 组件，通过 fieldProps 传递 onChange
          const itemProps = { ...(item.props || {}) }
          delete itemProps.value // 移除原有的 value 避免重复
          return cloneVNode(item, {
            key: index,
            ignoreFormItem: true,
            ...itemProps,
            fieldProps: {
              ...(item.props as any)?.fieldProps,
              onChange: (...restParams: any[]) => {
                handleFieldChange(restParams[0], index)
              },
            },
            value: itemValue,
          })
        } else {
          // 普通组件，直接传递 value 和 onChange
          return cloneVNode(item, {
            key: index,
            ...(item.props || {}),
            [props.valuePropName]: itemValue,
            onChange: (itemVal: any) => {
              handleFieldChange(itemVal, index)
              ;(item.props as any)?.onChange?.(itemVal)
            },
          })
        }
      })
    })

    // Space 组件属性
    const spaceProps = computed(() => ({
      size: props.space?.size || 'medium',
      direction: props.space?.direction || 'horizontal',
      align: props.space?.align || 'start',
      breakLine: props.space?.wrap !== false,
      ...props.space,
    }))

    return () => {
      return <Space {...spaceProps.value}>{childrenList.value}</Space>
    }
  },
})

export default ProFormFieldSet
