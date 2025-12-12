import type { PropType, VNode } from 'vue'
import { defineComponent, ref, watch } from 'vue'
import { BaseForm } from '../BaseForm/BaseForm'
import { EditOrReadOnlyContext } from '../BaseForm/EditOrReadOnlyContext'
import { ProFormItem } from '../components/form-item'
import { ProFormGroup } from '../components/group'
import type { ProFormGroupProps } from '../typing'

export interface ProFormProps {
  // ProForm 特有的属性
  title?: string
  description?: string
  loading?: boolean
  submitter?: any
  onFinish?: (values: any) => Promise<boolean | void> | boolean | void
  onFinishFailed?: (errorInfo: any) => void
  onReset?: () => void
  // 内容渲染函数
  contentRender?: (
    items: VNode[],
    submitter: VNode | null,
    form: any
  ) => VNode | VNode[]
}

export const ProForm = defineComponent({
  name: 'ProForm',
  inheritAttrs: false,
  props: {
    // ProForm 特有属性
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    submitter: {
      type: [Object, Boolean] as PropType<any>,
      default: () => ({}),
    },
    onFinish: {
      type: [Function, Array] as PropType<
        | ((values: any) => Promise<boolean | void> | void)
        | Array<(values: any) => Promise<boolean | void> | void>
      >,
    },
    onFinishFailed: {
      type: [Function, Array] as PropType<
        ((errorInfo: any) => void) | Array<(errorInfo: any) => void>
      >,
    },
    onReset: {
      type: [Function, Array] as PropType<(() => void) | Array<() => void>>,
    },
    contentRender: {
      type: Function as PropType<
        (items: VNode[], submitter: VNode | null, form: any) => VNode | VNode[]
      >,
    },
    // BaseForm 属性
    layout: {
      type: String as PropType<'vertical' | 'inline'>,
      default: 'vertical',
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    grid: {
      type: Boolean,
      default: false,
    },
    colProps: {
      type: Object,
      default: () => ({}),
    },
    rowProps: {
      type: Object,
      default: () => ({}),
    },
    fieldProps: {
      type: Object,
      default: () => ({}),
    },
    proFieldProps: {
      type: Object,
      default: () => ({}),
    },
    formItemProps: {
      type: Object,
      default: () => ({}),
    },
    groupProps: {
      type: Object as PropType<ProFormGroupProps>,
      default: () => ({}),
    },
  },
  emits: ['finish', 'finishFailed', 'reset', 'valuesChange', 'init'],
  setup(props, { slots, emit, expose }) {
    const formRef = ref()
    const loading = ref(props.loading)

    // 监听外部 loading 变化
    watch(
      () => props.loading,
      newVal => {
        loading.value = newVal
      }
    )

    // 处理表单提交
    const handleFinish = async (values: any) => {
      if (props.onFinish) {
        loading.value = true
        try {
          // 支持 onFinish 为数组形式（Vue 事件监听器可能是数组）
          const finishHandlers = Array.isArray(props.onFinish)
            ? props.onFinish
            : [props.onFinish]
          let result: any
          for (const handler of finishHandlers) {
            if (typeof handler === 'function') {
              result = await handler(values)
            }
          }
          if (result !== false) {
            emit('finish', values)
          }
          return result
        } catch (error) {
          console.error('Form submit error:', error)
          throw error
        } finally {
          loading.value = false
        }
      } else {
        emit('finish', values)
      }
    }

    // 处理表单提交失败
    const handleFinishFailed = (errorInfo: any) => {
      if (props.onFinishFailed) {
        // 支持数组形式
        const handlers = Array.isArray(props.onFinishFailed)
          ? props.onFinishFailed
          : [props.onFinishFailed]
        for (const handler of handlers) {
          if (typeof handler === 'function') {
            handler(errorInfo)
          }
        }
      }
      emit('finishFailed', errorInfo)
    }

    // 处理表单重置
    const handleReset = () => {
      formRef.value?.reset()
      if (props.onReset) {
        // 支持数组形式
        const handlers = Array.isArray(props.onReset)
          ? props.onReset
          : [props.onReset]
        for (const handler of handlers) {
          if (typeof handler === 'function') {
            handler()
          }
        }
      }
      emit('reset')
    }

    // 处理表单初始化
    const handleInit = (values: any, form: any) => {
      emit('init', values, form)
    }

    // 暴露表单实例方法
    expose({
      submit: () => formRef.value?.submit(),
      reset: handleReset,
      validate: () => formRef.value?.validate(),
      validateFields: (fields: string[]) =>
        formRef.value?.validateFields(fields),
      getFieldValue: (field: string) => formRef.value?.getFieldValue(field),
      getFieldsValue: () => formRef.value?.getFieldsValue(),
      setFieldValue: (field: string, value: any) =>
        formRef.value?.setFieldValue(field, value),
      setFieldsValue: (values: any) => formRef.value?.setFieldsValue(values),
      clearValidate: (fields?: string[]) =>
        formRef.value?.clearValidate(fields),
      scrollToField: (field: string) => formRef.value?.scrollToField(field),
    })

    // 默认内容渲染：items + submitter
    const defaultContentRender = (items: VNode[], submitter: VNode | null) => {
      return (
        <>
          {items}
          {submitter}
        </>
      )
    }

    return () => {
      const contentRender = props.contentRender || defaultContentRender

      return (
        <div class="pro-form">
          {(props.title || props.description) && (
            <div class="pro-form-header">
              {props.title && <h3 class="pro-form-title">{props.title}</h3>}
              {props.description && (
                <div class="pro-form-description">{props.description}</div>
              )}
            </div>
          )}

          <BaseForm
            ref={formRef}
            layout={props.layout}
            readonly={props.readonly}
            grid={props.grid}
            colProps={props.colProps}
            rowProps={props.rowProps}
            fieldProps={props.fieldProps}
            proFieldProps={props.proFieldProps}
            formItemProps={props.formItemProps}
            groupProps={props.groupProps}
            loading={loading.value}
            submitter={props.submitter}
            contentRender={contentRender}
            onFinish={handleFinish}
            onFinishFailed={handleFinishFailed}
            onReset={handleReset}
            onInit={handleInit}
            onValuesChange={(changedValues: any, allValues: any) => {
              emit('valuesChange', changedValues, allValues)
            }}
          >
            {slots.default?.()}
          </BaseForm>
        </div>
      )
    }
  },
})

// 静态属性 - 类似 React 版本的 ProForm.Group 等
ProForm.Group = ProFormGroup
ProForm.Item = ProFormItem
ProForm.EditOrReadOnlyContext = EditOrReadOnlyContext

export default ProForm
