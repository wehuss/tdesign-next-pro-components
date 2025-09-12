import { ChevronLeftIcon, ChevronRightIcon } from 'tdesign-icons-vue-next'
import { Button, Space, Steps } from 'tdesign-vue-next'
import { computed, defineComponent, ref, watch } from 'vue'
import type { ProFormProps } from '../ProForm'
import { ProForm } from '../ProForm'

export interface StepFormProps extends ProFormProps {
  title?: string
  description?: string
}

export interface StepsFormProps {
  current?: number
  direction?: 'horizontal' | 'vertical'
  size?: 'small' | 'medium' | 'large'
  steps?: Array<{
    title: string
    description?: string
    icon?: any
  }>
  submitter?: any
  onCurrentChange?: (current: number) => void
  onFinish?: (values: any) => Promise<boolean | void> | boolean | void
}

const StepFormComponent = defineComponent({
  name: 'StepForm',
  props: {
    ...ProForm.props,
    title: String,
    description: String,
  },
  setup(props, { slots }) {
    return () => (
      <div class="step-form">
        <ProForm {...props}>
          {slots.default?.()}
        </ProForm>
      </div>
    )
  },
})

export const StepsForm = defineComponent({
  name: 'StepsForm',
  props: {
    current: {
      type: Number,
      default: 0,
    },
    direction: {
      type: String as () => 'horizontal' | 'vertical',
      default: 'horizontal',
    },
    size: {
      type: String as () => 'small' | 'medium' | 'large',
      default: 'medium',
    },
    steps: {
      type: Array as () => Array<{
        title: string
        description?: string
        icon?: any
      }>,
      default: () => [],
    },
    submitter: {
      type: [Object, Boolean],
      default: () => ({}),
    },
    onCurrentChange: Function,
    onFinish: Function,
  },
  emits: ['update:current', 'currentChange', 'finish'],
  setup(props, { slots, emit }) {
    const currentStep = ref(props.current)
    const formRefs = ref<any[]>([])
    const formValues = ref<any[]>([])

    // 监听外部 current 变化
    watch(() => props.current, (newVal) => {
      currentStep.value = newVal
    })

    // 监听内部 current 变化
    watch(currentStep, (newVal) => {
      emit('update:current', newVal)
      if (props.onCurrentChange) {
        props.onCurrentChange(newVal)
      }
      emit('currentChange', newVal)
    })

    // 上一步
    const prev = () => {
      if (currentStep.value > 0) {
        currentStep.value--
      }
    }

    // 下一步
    const next = async () => {
      try {
        // 验证当前步骤的表单
        const currentForm = formRefs.value[currentStep.value]
        if (currentForm) {
          const values = await currentForm.validate()
          formValues.value[currentStep.value] = values
        }

        if (currentStep.value < props.steps.length - 1) {
          currentStep.value++
        }
      } catch (error) {
        console.error('Step validation failed:', error)
      }
    }

    // 提交所有表单
    const submit = async () => {
      try {
        // 验证当前步骤
        const currentForm = formRefs.value[currentStep.value]
        if (currentForm) {
          const values = await currentForm.validate()
          formValues.value[currentStep.value] = values
        }

        // 合并所有步骤的数据
        const allValues = formValues.value.reduce((acc, stepValues) => {
          return { ...acc, ...stepValues }
        }, {})

        if (props.onFinish) {
          const result = await props.onFinish(allValues)
          if (result !== false) {
            emit('finish', allValues)
          }
        } else {
          emit('finish', allValues)
        }
      } catch (error) {
        console.error('Steps form submit error:', error)
      }
    }

    // 设置表单引用
    const setFormRef = (index: number) => (ref: any) => {
      formRefs.value[index] = ref
    }

    const isFirstStep = computed(() => currentStep.value === 0)
    const isLastStep = computed(() => currentStep.value === props.steps.length - 1)

    return () => (
      <div class="steps-form">
        {/* 步骤条 */}
        <Steps
          current={currentStep.value}
          layout={props.direction}
          options={props.steps}
          style={{ marginBottom: '24px' }}
        />

        {/* 表单内容 */}
        <div class="steps-form-content">
          {slots.default?.({ current: currentStep.value, setFormRef })}
        </div>

        {/* 操作按钮 */}
        {props.submitter !== false && (
          <div class="steps-form-actions" style={{ marginTop: '24px', textAlign: 'right' }}>
            <Space>
              {!isFirstStep.value && (
                <Button variant="outline" onClick={prev}>
                  <ChevronLeftIcon />
                  上一步
                </Button>
              )}
              
              {!isLastStep.value && (
                <Button theme="primary" onClick={next}>
                  下一步
                  <ChevronRightIcon />
                </Button>
              )}
              
              {isLastStep.value && (
                <Button theme="primary" onClick={submit}>
                  提交
                </Button>
              )}
            </Space>
          </div>
        )}
      </div>
    )
  },
})

export const StepForm = StepFormComponent
export default StepsForm