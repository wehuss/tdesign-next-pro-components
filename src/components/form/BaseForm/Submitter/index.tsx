import type { ButtonProps } from 'tdesign-vue-next'
import { Button, Space } from 'tdesign-vue-next'
import { computed, defineComponent } from 'vue'

export interface SubmitterProps {
  /**
   * 提交按钮的props
   */
  submitButtonProps?: ButtonProps & {
    loading?: boolean
  }
  /**
   * 重置按钮的props  
   */
  resetButtonProps?: ButtonProps
  /**
   * 提交按钮文字
   */
  submitText?: string
  /**
   * 重置按钮文字
   */
  resetText?: string
  /**
   * 是否显示重置按钮
   */
  showReset?: boolean
  /**
   * 重置事件
   */
  onReset?: () => void
  /**
   * 提交事件
   */
  onSubmit?: () => void
  /**
   * 自定义渲染
   */
  render?: (props: SubmitterProps, dom: any[]) => any
  /**
   * 搜索的配置，一般用于 QueryFilter
   */
  searchConfig?: {
    submitText?: string
    resetText?: string
  }
}

export const Submitter = defineComponent({
  name: 'Submitter',
  props: {
    submitButtonProps: {
      type: Object as () => ButtonProps & { loading?: boolean },
      default: () => ({}),
    },
    resetButtonProps: {
      type: Object as () => ButtonProps,
      default: () => ({}),
    },
    submitText: {
      type: String,
      default: '提交',
    },
    resetText: {
      type: String,
      default: '重置',
    },
    showReset: {
      type: Boolean,
      default: true,
    },
    onReset: {
      type: Function as () => () => void,
    },
    onSubmit: {
      type: Function as () => () => void,
    },
    render: {
      type: Function,
    },
    searchConfig: {
      type: Object as () => {
        submitText?: string
        resetText?: string
      },
      default: () => ({}),
    },
  },
  setup(props) {
    const finalSubmitText = computed(() => {
      return props.searchConfig?.submitText || props.submitText
    })

    const finalResetText = computed(() => {
      return props.searchConfig?.resetText || props.resetText
    })

    const handleSubmit = () => {
      props.onSubmit?.()
    }

    const handleReset = () => {
      props.onReset?.()
    }

    return () => {
      const submitButton = (
        <Button
          theme="primary"
          type="submit"
          {...props.submitButtonProps}
          onClick={handleSubmit}
        >
          {finalSubmitText.value}
        </Button>
      )

      const resetButton = props.showReset ? (
        <Button
          variant="base"
          {...props.resetButtonProps}
          onClick={handleReset}
        >
          {finalResetText.value}
        </Button>
      ) : null

      const dom = [submitButton, resetButton].filter(Boolean)

      if (props.render) {
        return props.render(props, dom)
      }

      return (
        <Space>
          {dom}
        </Space>
      )
    }
  },
})

export default Submitter