import { Button, Form, Input } from 'tdesign-vue-next'
import {
  computed,
  defineComponent,
  onBeforeUnmount,
  ref,
  watch,
  type PropType,
  type VNode,
} from 'vue'
import { ProFormItem } from '../form-item'

/**
 * 验证码输入框组件的 ref 类型
 */
export interface CaptFieldRef {
  /** 开始计时 */
  startTiming: () => void
  /** 结束计时 */
  endTiming: () => void
}

/**
 * ProFormCaptcha - 验证码输入框组件
 * 支持倒计时、手机号验证、自定义按钮文字等功能
 */
export const ProFormCaptcha = defineComponent({
  name: 'ProFormCaptcha',
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
    placeholder: {
      type: String,
      default: '请输入验证码',
    },
    // 字段属性
    fieldProps: {
      type: Object,
      default: () => ({}),
    },
    // 验证码特有属性
    countDown: {
      type: Number,
      default: 60,
    },
    phoneName: [String, Array] as PropType<string | string[]>,
    onGetCaptcha: {
      type: Function as PropType<(mobile: string) => Promise<void>>,
      required: true,
    },
    onTiming: Function as PropType<(count: number) => void>,
    captchaTextRender: {
      type: Function as PropType<(timing: boolean, count: number) => VNode | string>,
      default: (timing: boolean, count: number) => {
        return timing ? `${count} 秒后重新获取` : '获取验证码'
      },
    },
    captchaProps: {
      type: Object,
      default: () => ({}),
    },
    // v-model
    modelValue: String,
    'onUpdate:modelValue': Function,
  },
  emits: ['update:modelValue', 'change'],
  setup(props, { emit, expose }) {
    // 倒计时状态
    const count = ref(props.countDown)
    const timing = ref(false)
    const loading = ref(false)

    // 定时器
    let intervalId: ReturnType<typeof setInterval> | null = null

    // 获取表单实例
    const formInstance = Form.useFormInstance?.()

    // 内部值
    const innerValue = computed({
      get: () => props.modelValue,
      set: (val) => emit('update:modelValue', val),
    })

    // 清理定时器
    const clearTimer = () => {
      if (intervalId) {
        clearInterval(intervalId)
        intervalId = null
      }
    }

    // 开始计时
    const startTiming = () => {
      timing.value = true
      count.value = props.countDown

      intervalId = setInterval(() => {
        count.value--
        props.onTiming?.(count.value)

        if (count.value <= 0) {
          timing.value = false
          count.value = props.countDown
          clearTimer()
        }
      }, 1000)
    }

    // 结束计时
    const endTiming = () => {
      timing.value = false
      count.value = props.countDown
      clearTimer()
    }

    // 获取验证码
    const handleGetCaptcha = async () => {
      try {
        loading.value = true

        // 如果设置了 phoneName，先验证手机号
        if (props.phoneName && formInstance) {
          const phoneNamePath = Array.isArray(props.phoneName) ? props.phoneName : [props.phoneName]

          await formInstance.validate({ fields: phoneNamePath })
          const mobile = formInstance.getFieldValue?.(phoneNamePath) || ''
          await props.onGetCaptcha(mobile)
        } else {
          await props.onGetCaptcha('')
        }

        loading.value = false
        startTiming()
      } catch (error) {
        loading.value = false
        console.error('获取验证码失败:', error)
      }
    }

    // 监听 countDown 变化
    watch(
      () => props.countDown,
      (newVal) => {
        if (!timing.value) {
          count.value = newVal
        }
      },
    )

    // 组件卸载时清理定时器
    onBeforeUnmount(() => {
      clearTimer()
    })

    // 暴露方法
    expose({
      startTiming,
      endTiming,
    })

    return () => {
      const inputNode = (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            ...props.fieldProps?.style,
          }}
        >
          <Input
            v-model={innerValue.value}
            placeholder={props.placeholder}
            disabled={props.disabled}
            readonly={props.readonly}
            style={{
              flex: 1,
              marginRight: '8px',
            }}
            {...props.fieldProps}
          />
          <Button
            disabled={timing.value || props.disabled}
            loading={loading.value}
            onClick={handleGetCaptcha}
            {...props.captchaProps}
          >
            {props.captchaTextRender(timing.value, count.value)}
          </Button>
        </div>
      )

      // 如果忽略 FormItem，直接返回输入框
      if (props.ignoreFormItem) {
        return inputNode
      }

      // 包装在 ProFormItem 中
      return (
        <ProFormItem
          name={props.name}
          label={props.label}
          rules={props.rules as any}
          required={props.required}
          help={props.help}
          extra={props.extra}
          width={props.width}
        >
          {inputNode}
        </ProFormItem>
      )
    }
  },
})

export default ProFormCaptcha
