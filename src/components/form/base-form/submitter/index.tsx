import type { ButtonProps } from 'tdesign-vue-next'
import { Button, Space } from 'tdesign-vue-next'
import type { VNode } from 'vue'
import { computed, defineComponent, inject, type PropType } from 'vue'

/** @name 用于配置操作栏 */
export interface SearchConfig {
  /** @name 重置按钮的文本 */
  resetText?: string | VNode
  /** @name 提交按钮的文本 */
  submitText?: string | VNode
}

export interface SubmitterProps<T = Record<string, any>> {
  /** @name 提交方法 */
  onSubmit?: (value?: T) => void
  /** @name 重置方法 */
  onReset?: (value?: T) => void
  /** @name 搜索的配置，一般用来配置文本 */
  searchConfig?: SearchConfig
  /** @name 提交按钮的 props，设置为 false 时不显示 */
  submitButtonProps?:
    | false
    | (ButtonProps & {
        preventDefault?: boolean
        loading?: boolean
      })
  /** @name 重置按钮的 props，设置为 false 时不显示 */
  resetButtonProps?:
    | false
    | (ButtonProps & {
        preventDefault?: boolean
      })
  /**
   * @name 自定义操作的渲染
   * @description 设置为 false 时不渲染任何内容
   */
  render?:
    | ((
        props: SubmitterProps<T> & {
          submit: () => void
          reset: () => void
        },
        dom: VNode[],
      ) => VNode[] | VNode | false)
    | false
}

// 表单实例注入 key
const FORM_INSTANCE_KEY = Symbol('formInstance')

/**
 * 从对象中移除指定的键
 */
function omit<T extends Record<string, any>, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
  const result = { ...obj }
  keys.forEach((key) => {
    delete result[key]
  })
  return result
}

export const Submitter = defineComponent({
  name: 'Submitter',
  props: {
    submitButtonProps: {
      type: [Object, Boolean] as PropType<SubmitterProps['submitButtonProps']>,
      default: undefined,
    },
    resetButtonProps: {
      type: [Object, Boolean] as PropType<SubmitterProps['resetButtonProps']>,
      default: undefined,
    },
    searchConfig: {
      type: Object as PropType<SearchConfig>,
      default: () => ({}),
    },
    onReset: {
      type: Function as PropType<(value?: any) => void>,
    },
    onSubmit: {
      type: Function as PropType<(value?: any) => void>,
    },
    render: {
      type: [Function, Boolean] as PropType<SubmitterProps['render']>,
      default: undefined,
    },
  },
  setup(props) {
    // 尝试获取表单实例
    const formInstance = inject<any>(FORM_INSTANCE_KEY, null)

    // 计算最终的提交按钮文本
    const submitText = computed(() => {
      return props.searchConfig?.submitText ?? '提交'
    })

    // 计算最终的重置按钮文本
    const resetText = computed(() => {
      return props.searchConfig?.resetText ?? '重置'
    })

    // 提交方法
    const submit = () => {
      console.log('submit', props.onSubmit)
      formInstance?.submit?.()
      props.onSubmit?.()
    }

    // 重置方法
    const reset = () => {
      formInstance?.reset?.()
      props.onReset?.()
    }

    return () => {
      // 如果 render 为 false，不渲染任何内容
      if (props.render === false) {
        return null
      }

      const dom: VNode[] = []

      // 重置按钮
      if (props.resetButtonProps !== false) {
        const resetBtnProps =
          typeof props.resetButtonProps === 'object' ? props.resetButtonProps : {}

        dom.push(
          <Button
            key="reset"
            variant="outline"
            {...omit(resetBtnProps, ['preventDefault', 'onClick'])}
            onClick={(e: MouseEvent) => {
              if (!resetBtnProps.preventDefault) {
                reset()
              }
              // 调用用户自定义的 onClick
              if (typeof resetBtnProps.onClick === 'function') {
                resetBtnProps.onClick(e)
              }
            }}
          >
            {resetText.value}
          </Button>,
        )
      }

      // 提交按钮
      if (props.submitButtonProps !== false) {
        const submitBtnProps =
          typeof props.submitButtonProps === 'object' ? props.submitButtonProps : {}

        dom.push(
          <Button
            key="submit"
            theme="primary"
            type="submit"
            {...omit(submitBtnProps, ['preventDefault', 'onClick'])}
            onClick={(e: MouseEvent) => {
              if (!submitBtnProps.preventDefault) {
                submit()
              }
              // 调用用户自定义的 onClick
              if (typeof submitBtnProps.onClick === 'function') {
                submitBtnProps.onClick(e)
              }
            }}
          >
            {submitText.value}
          </Button>,
        )
      }

      // 自定义渲染
      if (typeof props.render === 'function') {
        const renderDom = props.render(
          {
            ...props,
            submit,
            reset,
          },
          dom,
        )

        // 如果返回 false，不渲染
        if (renderDom === false) {
          return null
        }

        // 如果返回数组
        if (Array.isArray(renderDom)) {
          if (renderDom.length === 0) {
            return null
          }
          if (renderDom.length === 1) {
            return renderDom[0]
          }
          return <Space>{renderDom}</Space>
        }

        return renderDom
      }

      // 默认渲染
      if (dom.length === 0) {
        return null
      }

      if (dom.length === 1) {
        return dom[0]
      }

      return <Space>{dom}</Space>
    }
  },
})

export default Submitter
