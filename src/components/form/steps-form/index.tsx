import { Button, Col, Row, Space, Steps } from 'tdesign-vue-next'
import type { VNode } from 'vue'
import {
  computed,
  defineComponent,
  inject,
  provide,
  ref,
  watch,
  type InjectionKey,
  type Ref,
} from 'vue'
import { BaseForm } from '../base-form/base-form'
import type { SubmitterProps } from '../base-form/submitter'

// StepsForm 上下文类型
export interface StepsFormContextValue {
  regForm: (name: string, props: StepFormProps) => void
  unRegForm: (name: string) => void
  onFormFinish: (name: string, formData: any) => void
  keyArray: Ref<string[]>
  formArrayRef: Ref<any[]>
  loading: Ref<boolean>
  setLoading: (loading: boolean) => void
  lastStep: Ref<boolean>
  formMapRef: Ref<Map<string, StepFormProps>>
  next: () => void
}

// 注入 key
const StepsFormContextKey: InjectionKey<StepsFormContextValue> = Symbol('StepsFormContext')
const StepFormContextKey: InjectionKey<StepFormProps> = Symbol('StepFormContext')

// 提供和注入函数
export const provideStepsFormContext = (value: StepsFormContextValue) => {
  provide(StepsFormContextKey, value)
}

export const useStepsFormContext = () => {
  return inject(StepsFormContextKey)
}

export const provideStepFormContext = (value: StepFormProps) => {
  provide(StepFormContextKey, value)
}

export const useStepFormContext = () => {
  return inject(StepFormContextKey)
}

export interface StepFormProps {
  title?: string
  description?: string
  name?: string
  step?: number
  stepProps?: Record<string, any>
  onFinish?: Function
}

export interface StepsFormProps {
  current?: number
  direction?: 'horizontal' | 'vertical'
  stepsProps?: Record<string, any>
  formProps?: Record<string, any>
  submitter?: SubmitterProps | false
  submitTimeout?: number
  containerStyle?: Record<string, any>
  stepsRender?: Function
  stepFormRender?: Function
  stepsFormRender?: Function
  layoutRender?: Function
  onCurrentChange?: (current: number) => void
  onFinish?: (values: any) => Promise<boolean | void> | boolean | void
}

// StepForm 组件
export const StepForm = defineComponent({
  name: 'StepForm',
  props: {
    title: String,
    description: String,
    name: String,
    step: Number,
    stepProps: { type: Object, default: () => ({}) },
    onFinish: Function,
  },
  setup(props, { slots, expose }) {
    const formRef = ref()
    const stepsFormContext = useStepsFormContext()
    const stepFormContext = useStepFormContext()

    const mergedProps = computed(() => ({
      ...stepFormContext,
      ...props,
    }))

    const formName = computed(() => props.name || `step-${props.step || 0}`)

    watch(
      formName,
      (name, oldName) => {
        if (oldName) stepsFormContext?.unRegForm(oldName)
        stepsFormContext?.regForm(name, mergedProps.value)
      },
      { immediate: true },
    )

    const handleFinish = async (values: any) => {
      stepsFormContext?.onFormFinish(formName.value, values)
      if (!stepsFormContext?.lastStep.value) {
        stepsFormContext?.next()
      }
    }

    expose({
      submit: () => formRef.value?.submit?.(),
      reset: () => formRef.value?.reset?.(),
      validate: () => formRef.value?.validate?.(),
      getFieldsValue: () => formRef.value?.getFieldsValue?.(),
      setFieldsValue: (values: any) => formRef.value?.setFieldsValue?.(values),
    })

    return () => (
      <BaseForm
        ref={formRef}
        layout="vertical"
        {...mergedProps.value}
        submitter={false}
        onFinish={handleFinish}
      >
        {slots.default?.()}
      </BaseForm>
    )
  },
})

// StepsForm 组件
export const StepsForm = defineComponent({
  name: 'StepsForm',
  props: {
    current: { type: Number, default: 0 },
    direction: { type: String, default: 'horizontal' },
    stepsProps: { type: Object, default: () => ({}) },
    formProps: { type: Object, default: () => ({}) },
    submitter: { type: [Object, Boolean], default: undefined },
    submitTimeout: { type: Number },
    containerStyle: { type: Object, default: () => ({}) },
    stepsRender: { type: Function },
    stepFormRender: { type: Function },
    stepsFormRender: { type: Function },
    layoutRender: { type: Function },
    onCurrentChange: { type: Function },
    onFinish: { type: Function },
  },
  emits: ['update:current', 'currentChange', 'finish'],
  setup(props, { slots, emit, expose }) {
    const currentStep = ref(props.current)
    const formArray = ref<string[]>([])
    const formMapRef = ref<Map<string, StepFormProps>>(new Map())
    const formDataRef = ref<Map<string, any>>(new Map())
    const formArrayRef = ref<any[]>([])
    const loading = ref(false)

    watch(
      () => props.current,
      (newVal) => {
        currentStep.value = newVal
      },
    )

    watch(currentStep, (newVal) => {
      emit('update:current', newVal)
      ;(props.onCurrentChange as any)?.(newVal)
      emit('currentChange', newVal)
    })

    const lastStep = computed(() => currentStep.value === formArray.value.length - 1)

    const regForm = (name: string, formProps: StepFormProps) => {
      if (!formMapRef.value.has(name)) {
        formArray.value = [...formArray.value, name]
      }
      formMapRef.value.set(name, formProps)
    }

    const unRegForm = (name: string) => {
      formArray.value = formArray.value.filter((n) => n !== name)
      formMapRef.value.delete(name)
      formDataRef.value.delete(name)
    }

    const onFormFinish = async (name: string, formData: any) => {
      formDataRef.value.set(name, formData)
      if (!lastStep.value || !props.onFinish) return

      loading.value = true
      try {
        const values: any = {}
        formDataRef.value.forEach((data) => Object.assign(values, data))
        const success = await (props.onFinish as any)(values)
        if (success) {
          currentStep.value = 0
          formArrayRef.value.forEach((form) => form?.reset?.())
          emit('finish', values)
        }
      } catch (error) {
        console.error('StepsForm submit error:', error)
      } finally {
        loading.value = false
      }
    }

    const prePage = () => {
      if (currentStep.value >= 1) currentStep.value--
    }
    const nextPage = () => {
      if (formArray.value.length === 0) return
      if (currentStep.value <= formArray.value.length - 2) currentStep.value++
    }
    const onSubmit = () => formArrayRef.value[currentStep.value]?.submit?.()
    const setLoading = (value: boolean) => {
      loading.value = value
    }

    provideStepsFormContext({
      regForm,
      unRegForm,
      onFormFinish,
      keyArray: formArray,
      formArrayRef,
      loading,
      setLoading,
      lastStep,
      formMapRef,
      next: nextPage,
    })

    expose({
      getCurrentStep: () => currentStep.value,
      setCurrentStep: (step: number) => {
        currentStep.value = step
      },
      prev: prePage,
      next: nextPage,
      submit: onSubmit,
    })

    return () => {
      const stepsItems = formArray.value.map((item) => {
        const itemProps = formMapRef.value.get(item)
        return { key: item, title: itemProps?.title, ...itemProps?.stepProps }
      })

      const stepsDom = (
        <div
          class="pro-steps-form-steps-container"
          style={{
            maxWidth: `${Math.min(formArray.value.length * 320, 1160)}px`,
          }}
        >
          <Steps
            {...props.stepsProps}
            current={currentStep.value}
            layout={props.direction as any}
            options={stepsItems}
          />
        </div>
      )

      const finalStepsDom = props.stepsRender
        ? (props.stepsRender as any)(
            formArray.value.map((item) => ({
              key: item,
              title: formMapRef.value.get(item)?.title,
            })),
            stepsDom,
          )
        : stepsDom

      const formDom = (
        <div class="pro-steps-form-step-container">
          {slots.default?.().map((item: any, index: number) => {
            const itemProps = item.props as StepFormProps
            const name = itemProps?.name || `${index}`
            const isShow = currentStep.value === index
            provideStepFormContext({
              ...props.formProps,
              ...itemProps,
              name,
              step: index,
            })
            return (
              <div
                class={['pro-steps-form-step', { 'pro-steps-form-step-active': isShow }]}
                key={name}
                style={{ display: isShow ? undefined : 'none' }}
              >
                {item}
              </div>
            )
          })}
        </div>
      )

      const submitterConfig = typeof props.submitter === 'object' ? props.submitter : {}
      const preButton =
        props.submitter !== false ? (
          <Button
            key="pre"
            {...(submitterConfig.resetButtonProps || {})}
            onClick={() => {
              prePage()
              submitterConfig.onReset?.()
            }}
          >
            上一步
          </Button>
        ) : null
      const nextButton =
        props.submitter !== false ? (
          <Button
            key="next"
            theme="primary"
            loading={loading.value}
            {...(submitterConfig.submitButtonProps || {})}
            onClick={() => {
              submitterConfig.onSubmit?.()
              onSubmit()
            }}
          >
            下一步
          </Button>
        ) : null
      const submitButton =
        props.submitter !== false ? (
          <Button
            key="submit"
            theme="primary"
            loading={loading.value}
            {...(submitterConfig.submitButtonProps || {})}
            onClick={() => {
              submitterConfig.onSubmit?.()
              onSubmit()
            }}
          >
            提交
          </Button>
        ) : null

      let buttons: VNode[] = []
      const index = currentStep.value || 0
      if (index < 1) {
        buttons =
          formArray.value.length === 1
            ? ([submitButton].filter(Boolean) as VNode[])
            : ([nextButton].filter(Boolean) as VNode[])
      } else if (index + 1 === formArray.value.length) {
        buttons = [preButton, submitButton].filter(Boolean) as VNode[]
      } else {
        buttons = [preButton, nextButton].filter(Boolean) as VNode[]
      }

      let submitterDom: VNode | VNode[] | null = null
      if (typeof props.submitter === 'object' && (props.submitter as any).render) {
        const result = (props.submitter as any).render(
          {
            step: currentStep.value,
            onPre: prePage,
            form: formArrayRef.value[currentStep.value],
          },
          buttons,
        )
        submitterDom = result === false ? null : result
      } else if (props.submitter !== false) {
        submitterDom = buttons
      }

      const formContainer = (
        <div class="pro-steps-form-container" style={props.containerStyle}>
          {formDom}
          {!props.stepsFormRender && submitterDom && (
            <div class="pro-steps-form-actions">
              <Space>{submitterDom}</Space>
            </div>
          )}
        </div>
      )

      const layoutDom = { stepsDom: finalStepsDom, formDom: formContainer }
      let stepsFormDom: VNode

      if (props.stepsFormRender) {
        const layoutContent = props.layoutRender ? (
          (props.layoutRender as any)(layoutDom)
        ) : (
          <>
            <Row gutter={{ xs: 8, sm: 16, md: 24 }}>
              <Col span={24}>{finalStepsDom}</Col>
            </Row>
            <Row gutter={{ xs: 8, sm: 16, md: 24 }}>
              <Col span={24}>{formContainer}</Col>
            </Row>
          </>
        )
        stepsFormDom = (props.stepsFormRender as any)(layoutContent, <Space>{submitterDom}</Space>)
      } else if (props.layoutRender) {
        stepsFormDom = (props.layoutRender as any)(layoutDom)
      } else {
        stepsFormDom = (
          <>
            <Row gutter={{ xs: 8, sm: 16, md: 24 }}>
              <Col span={24}>{finalStepsDom}</Col>
            </Row>
            <Row gutter={{ xs: 8, sm: 16, md: 24 }}>
              <Col span={24}>{formContainer}</Col>
            </Row>
          </>
        )
      }

      return <div class="pro-steps-form">{stepsFormDom}</div>
    }
  },
})
;(StepsForm as any).StepForm = StepForm
export default StepsForm
