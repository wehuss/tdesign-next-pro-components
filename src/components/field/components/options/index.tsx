import { Space } from 'tdesign-vue-next'
import type { VNode } from 'vue'
import { defineComponent, Fragment, h, isVNode } from 'vue'
import type { ProFieldMode } from '../../types'

/**
 * 为数组元素添加 key
 * @param nodes VNode 数组
 * @returns 带 key 的 VNode 数组
 */
const addArrayKeys = (nodes: VNode[]): VNode[] => {
  return nodes.map((node, index) => {
    if (!isVNode(node)) {
      return h(Fragment, { key: index }, [node])
    }
    return h(
      node.type as any,
      { key: index, ...node.props },
      node.children as any
    )
  })
}

/**
 * Options 组件 - 操作项字段
 * 用于放置多个操作按钮
 */
export const FieldOptions = defineComponent({
  name: 'ProFieldOptions',
  props: {
    modelValue: {
      type: [Array, Object] as any,
      default: undefined,
    },
    mode: {
      type: String as () => ProFieldMode,
      default: 'read' as ProFieldMode,
    },
    fieldProps: {
      type: Object as any,
      default: () => ({}),
    },
    render: {
      type: Function as any,
      default: undefined,
    },
  },
  setup(props, { slots }) {
    return () => {
      // 如果有自定义渲染函数
      if (props.render) {
        const rendered = props.render(props.modelValue, {
          mode: props.mode,
          ...props.fieldProps,
        })

        // 如果返回的是数组
        if (Array.isArray(rendered)) {
          if (rendered.length === 0) {
            return null
          }
          return (
            <Space size="small" {...props.fieldProps}>
              {addArrayKeys(rendered as VNode[])}
            </Space>
          )
        }

        return rendered
      }

      // 如果有默认插槽
      if (slots.default) {
        const children = slots.default()
        if (Array.isArray(children) && children.length > 0) {
          return (
            <Space size="small" {...props.fieldProps}>
              {addArrayKeys(children)}
            </Space>
          )
        }
        return children
      }

      // 如果 modelValue 是数组
      if (Array.isArray(props.modelValue)) {
        if (props.modelValue.length === 0) {
          return null
        }
        return (
          <Space size="small" {...props.fieldProps}>
            {addArrayKeys(props.modelValue as VNode[])}
          </Space>
        )
      }

      // 如果 modelValue 是单个 VNode
      if (isVNode(props.modelValue)) {
        return props.modelValue
      }

      return null
    }
  },
})

export default FieldOptions
