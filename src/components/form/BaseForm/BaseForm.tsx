import type { FormInstanceFunctions } from 'tdesign-vue-next'
import { Form, Loading } from 'tdesign-vue-next'
import type { Ref } from 'vue'
import { defineComponent, onMounted, ref, watch } from 'vue'
import { provideFieldContext } from '../FieldContext'
import { provideGridContext } from '../helpers/index.tsx'
import type { ProFormGroupProps } from '../typing'
import { provideEditOrReadOnlyContext } from './EditOrReadOnlyContext'
import { Submitter } from './Submitter'

export interface ProFormInstance extends FormInstanceFunctions {
  getFieldsFormatValue?: (allData?: boolean, omitNil?: boolean) => any
  getFieldFormatValue?: (nameList?: any, omitNil?: boolean) => any
  getFieldFormatValueObject?: (nameList?: any, omitNil?: boolean) => any
  validateFieldsReturnFormatValue?: (nameList?: any[], omitNil?: boolean) => Promise<any>
  nativeElement?: HTMLElement
}

// export interface CommonFormProps<T = Record<string, any>, U = Record<string, any>> {
//   /**
//    * @name 自定义提交的配置
//    */
//   submitter?: SubmitterProps | false
//   /**
//    * @name 表单结束后调用
//    */
//   onFinish?: (formData: T) => Promise<boolean | void> | void
//   /**
//    * @name 表单提交失败后调用
//    */
//   onFinishFailed?: (errorInfo: any) => void
//   /**
//    * @name 表单重置后调用
//    */
//   onReset?: () => void
//   /**
//    * @name 表单值变化时调用
//    */
//   onValuesChange?: (changedValues: any, allValues: any) => void
//   /**
//    * @name 表单按钮的 loading 状态
//    */
//   loading?: boolean
//   /**
//    * @name loading状态改变时的回调
//    */
//   onLoadingChange?: (loading: boolean) => void
//   /**
//    * @name 获取 ProFormInstance
//    */
//   formRef?: Ref<ProFormInstance | undefined>
//   /**
//    * @name 同步结果到 url 中
//    */
//   syncToUrl?: boolean | ((values: T, type: 'get' | 'set') => T)
//   /**
//    * @name 当 syncToUrl 为 true，在页面回显示时，以url上的参数为主，默认为false
//    */
//   syncToUrlAsImportant?: boolean
//   /**
//    * @name 额外的 url 参数
//    */
//   extraUrlParams?: Record<string, any>
//   /**
//    * @name 同步结果到 initialValues,默认为true如果为false，reset的时将会忽略从url上获取的数据
//    */
//   syncToInitialValues?: boolean
//   /**
//    * 如果为 false,会原样保存。
//    * @default true
//    * @param 要不要值中的 Null 和 undefined
//    */
//   omitNil?: boolean
//   /**
//    * 格式化 Date 的方式，默认转化为 string
//    */
//   dateFormatter?: string | ((value: any, valueType: string) => string | number) | false
//   /**
//    * @name 表单初始化成功，比如布局，label等计算完成
//    */
//   onInit?: (values: T, form: ProFormInstance) => void
//   /**
//    * @name 发起网络请求的参数
//    */
//   params?: U
//   /**
//    * @name 发起网络请求的参数,返回值会覆盖给 initialValues
//    */
//   request?: (params: U) => Promise<T>
//   /** 是否回车提交 */
//   isKeyPressSubmit?: boolean
//   /** 用于控制form 是否相同的key，高阶用法 */
//   formKey?: string
//   /**
//    * @name自动选中第一项
//    * @description 只对有input的类型有效
//    */
//   autoFocusFirstInput?: boolean
//   /**
//    * @name 是否只读模式，对所有表单项生效
//    * @description 优先低于表单项的 readonly
//    */
//   readonly?: boolean
// } & ProFormGridConfig

// export interface BaseFormProps<T = Record<string, any>, U = Record<string, any>> extends Omit<FormProps, 'onFinish'>, CommonFormProps<T, U> {
//   contentRender?: (
//     items: any[],
//     submitter: any,
//     form: ProFormInstance,
//   ) => any
//   fieldProps?: any
//   proFieldProps?: any
//   /** 表单初始化完成，form已经存在，可以进行赋值的操作了 */
//   onInit?: (values: T, form: ProFormInstance) => void
//   formItemProps?: any
//   groupProps?: ProFormGroupProps
//   /** 是否回车提交 */
//   isKeyPressSubmit?: boolean
//   /** Form 组件的类型，内部使用 */
//   formComponentType?: 'DrawerForm' | 'ModalForm' | 'QueryFilter'
// }
export type BaseFormProps=any
export const BaseForm = defineComponent({
  name: 'BaseForm',
  props: {
    // 基础表单属性
    layout: {
      type: String as () => 'vertical' | 'inline',
      default: 'vertical',
    },
    loading: {
      type: Boolean,
      default: false,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    submitter: {
      type: [Object, Boolean],
      default: () => ({}),
    },
    onFinish: {
      type: Function as () => (formData: any) => Promise<boolean | void> | void,
    },
    onFinishFailed: {
      type: Function as () => (errorInfo: any) => void,
    },
    onReset: {
      type: Function as () => () => void,
    },
    onValuesChange: {
      type: Function as () => (changedValues: any, allValues: any) => void,
    },
    onLoadingChange: {
      type: Function as () => (loading: boolean) => void,
    },
    formRef: {
      type: Object as () => Ref<ProFormInstance | undefined>,
    },
    // 网格布局
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
    // 其他属性
    contentRender: {
      type: Function,
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
      type: Object as () => ProFormGroupProps,
      default: () => ({}),
    },
    formComponentType: {
      type: String as () => 'DrawerForm' | 'ModalForm' | 'QueryFilter',
    },
    isKeyPressSubmit: {
      type: Boolean,
      default: false,
    },
    autoFocusFirstInput: {
      type: Boolean,
      default: true,
    },
    omitNil: {
      type: Boolean,
      default: true,
    },
    dateFormatter: {
      type: [String, Function, Boolean] as () => string | ((value: any, valueType: string) => string | number) | false,
      default: 'string',
    },
    onInit: {
      type: Function as () => (values: any, form: ProFormInstance) => void,
    },
    params: {
      type: Object,
      default: () => ({}),
    },
    request: {
      type: Function as () => (params: any) => Promise<any>,
    },
    formKey: {
      type: String,
      default: '',
    },
    syncToUrl: {
      type: [Boolean, Function] as () => boolean | ((values: any, type: 'get' | 'set') => any),
      default: false,
    },
    syncToUrlAsImportant: {
      type: Boolean,
      default: false,
    },
    extraUrlParams: {
      type: Object,
      default: () => ({}),
    },
    syncToInitialValues: {
      type: Boolean,
      default: true,
    },
  },
  emits: ['finish', 'loadingChange', 'init'],
  setup(props, { slots, emit, expose }) {
    const formRef = ref<ProFormInstance>()
    const loading = ref(props.loading)
    const initialData = ref<any>({})
    const initialDataLoading = ref(false)

    // 监听loading变化
    watch(() => props.loading, (newLoading) => {
      loading.value = newLoading || false
    })

    watch(loading, (newLoading) => {
      props.onLoadingChange?.(newLoading)
      emit('loadingChange', newLoading)
    })

    // 处理表单提交
    const handleFinish = async (values: any) => {
      if (!props.onFinish) return
      
      if (loading.value) return
      
      try {
        loading.value = true
        const result = await props.onFinish(values)
        emit('finish', values)
        return result
      } catch (error) {
        console.error('Form submit error:', error)
        throw error
      } finally {
        loading.value = false
      }
    }

    // 处理重置
    const handleReset = () => {
      formRef.value?.reset()
    }

    // 提供上下文
    provideEditOrReadOnlyContext({
      mode: props.readonly ? 'read' : 'edit',
    })

    provideFieldContext({
      formRef,
      fieldProps: props.fieldProps,
      proFieldProps: props.proFieldProps,
      formItemProps: props.formItemProps,
      groupProps: props.groupProps,
      formComponentType: props.formComponentType,
      formKey: props.formKey,
      setFieldValueType: (name: any, config: any) => {
        // TODO: 实现字段类型设置逻辑
      },
    })

    provideGridContext({
      grid: props.grid,
      colProps: props.colProps,
    })

    // 初始化
    onMounted(() => {
      if (props.onInit) {
        props.onInit(initialData.value, formRef.value!)
        emit('init', initialData.value, formRef.value)
      }
    })

    // 暴露方法给父组件
    if (props.formRef) {
      props.formRef.value = formRef.value
    }

    expose({
      formRef,
      handleFinish,
      handleReset,
    })

    return () => {
      const items = slots.default?.()

      // 渲染提交按钮
      const submitterNode = props.submitter !== false ? (
        <Submitter
          {...(typeof props.submitter === 'object' ? props.submitter : {})}
          onSubmit={() => formRef.value?.submit()}
          onReset={handleReset}
          submitButtonProps={{
            loading: loading.value,
            ...(typeof props.submitter === 'object' ? props.submitter.submitButtonProps : {}),
          }}
        />
      ) : null

      // 自定义内容渲染
      if (props.contentRender) {
        return props.contentRender(items || [], submitterNode, formRef.value!)
      }

      // 加载状态
      if (props.request && initialDataLoading.value) {
        return (
          <div style={{ paddingTop: '50px', paddingBottom: '50px', textAlign: 'center' }}>
            <Loading />
          </div>
        )
      }

      return (
        <Form
          ref={formRef}
          layout={props.layout}
          onSubmit={handleFinish}
          onReset={handleReset}
        >
          {items}
          {submitterNode}
        </Form>
      )
    }
  },
})

export default BaseForm