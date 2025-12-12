import type { FormItemProps } from 'tdesign-vue-next'
import type { CSSProperties, Ref, VNode } from 'vue'
import type {
  ProFieldProps,
  ProFieldValueType,
  ProFormBaseGroupProps,
  ProSchema,
  SearchConvertKeyFn,
} from '../field/types'
import type { ProFormInstance } from './BaseForm'
import type { CaptFieldRef } from './components/captcha'

export interface ProFormGridConfig {
  /**
   * 开启栅格布局
   * @default false
   */
  grid?: boolean
  /**
   * 栅格布局时生效，传入 span 属性时，默认值为空
   * @default { xs: 24 }
   */
  colProps?: Record<string, any>
  /**
   * 栅格布局时生效
   * @default { gutter: 8 }
   */
  rowProps?: Record<string, any>
}

export type ProFormItemCreateConfig = {
  /** 自定义类型 */
  valueType?: ProFieldValueType
  /** 自定义 lightMode */
  customLightMode?: boolean
  /** Light mode 自定义的 label 模式 */
  lightFilterLabelFormatter?: (value: any) => string
  /** 默认的props，如果用户设置会被覆盖 */
  defaultProps?: Record<string, any>
  /** @name 不使用默认的宽度 */
  ignoreWidth?: boolean
} & ProFormItemProps

// 给控件扩展的通用的属性
export type ExtendsProps = {
  secondary?: boolean
  allowClear?: boolean
  bordered?: boolean
  colSize?: number
  /**
   * 需要与 request 配合使用
   * @name 网络请求用的输出，会触发reload
   */
  params?:
    | ((form: ProFormInstance) => Record<string, any>)
    | Record<string, any>

  /** @name 需要放在formItem 时使用 */
  ignoreFormItem?: boolean

  /**
   * 实验性质，可能 api 会有改动，谨慎使用
   * @name 只读模式
   */
  readonly?: boolean

  /**
   * @name 获取时转化值，一般用于将数据格式化为组件接收的格式
   */
  convertValue?: SearchConvertKeyFn

  /**
   * 给 protable 开的口子
   * @name 自定义的 formItemProps
   */
  formItemProps?: FormItemProps

  /** 给自定义组件行为开的口子 */
  fieldConfig?: ProFormItemCreateConfig

  // 给proForm添加fieldRef,用来获取暴露的方法
  fieldRef?: Ref<CaptFieldRef | null | undefined>
}

export type ProFormGroupProps = ProFormBaseGroupProps & ProFormGridConfig

export type FieldProps<K> = {
  style?: CSSProperties
  width?: string
  ref?: Ref<K>
}

export type LightFilterFooterRender =
  | ((
      /**
       * @name 确认选择的值
       */
      onConfirm?: (e?: Event) => void,
      /**
       * @name 清除选择
       */
      onClear?: (e?: Event) => void
    ) => VNode | false)
  | false

export type ProFormFieldItemProps<T = Record<string, any>, K = any> = {
  /**
   * @name 设置到控件上的属性
   */
  fieldProps?: Partial<FieldProps<K> & T>
  /**
   * @name 输入的描述，没有值的时候展示
   */
  placeholder?: string | string[]
  /**
   * @name 是否是次要控件，只针对 LightFilter 下有效
   */
  secondary?: boolean
  /**
   * @name 只读模式渲染文本,没有值的时候展示
   */
  emptyText?: VNode
  /**
   * @name 是否使用 swr 来缓存 缓存可能导致数据更新不及时，请谨慎使用，尤其是页面中多个组件 name 相同
   * @default false
   */
  cacheForSwr?: boolean
  /**
   * @name disabled=true 时控件不可用
   */
  disabled?: boolean
  /**
   * @type auto 使用组件默认的宽度
   * @type xs=104px 适用于短数字、短文本或选项。
   * @type sm=216px 适用于较短字段录入、如姓名、电话、ID 等。
   * @type md=328px 标准宽度，适用于大部分字段长度。
   * @type lg=440px 适用于较长字段录入，如长网址、标签组、文件路径等。
   * @type xl=552px 适用于长文本录入，如长链接、描述、备注等，通常搭配自适应多行输入框或定高文本域使用。
   */
  width?: number | 'sm' | 'md' | 'xl' | 'xs' | 'lg'
  /**
   * @name 设置到 ProField 上面的 Props，内部属性
   */
  proFieldProps?: ProFieldProps

  /**
   * @name QueryFilter 上的footer
   */
  footerRender?: LightFilterFooterRender

  children?: any
} & Omit<ProFormItemProps, 'valueType'> &
  Pick<ProFormGridConfig, 'colProps'> &
  ExtendsProps

/**
 * load remote data props
 */
export type ProFormFieldRemoteProps = Pick<
  ProSchema,
  'debounceTime' | 'request' | 'valueEnum' | 'params'
>

export type ProFormItemProps = FormItemProps & {
  ignoreFormItem?: boolean
  valueType?: ProFieldValueType
  /**
   * @name 提交时转化值，一般用于将值转化为提交的数据
   */
  transform?: SearchConvertKeyFn
  dataFormat?: string
  lightProps?: any
  proFormFieldKey?: any
}

/**
 * BaseForm 的 Props 类型
 */
export interface BaseFormProps<
  T = Record<string, any>,
  U = Record<string, any>,
> {
  /** 表单布局 */
  layout?: 'vertical' | 'inline' | 'horizontal'
  /** 加载状态 */
  loading?: boolean
  /** 只读模式 */
  readonly?: boolean
  /** 提交按钮配置 */
  submitter?: any | false
  /** 表单提交回调 */
  onFinish?: (formData: T) => Promise<boolean | void> | void
  /** 表单提交失败回调 */
  onFinishFailed?: (errorInfo: any) => void
  /** 表单重置回调 */
  onReset?: () => void
  /** 表单值变化回调 */
  onValuesChange?: (changedValues: any, allValues: any) => void
  /** 加载状态变化回调 */
  onLoadingChange?: (loading: boolean) => void
  /** 表单实例引用 */
  formRef?: any
  /** 是否开启栅格布局 */
  grid?: boolean
  /** 栅格列配置 */
  colProps?: Record<string, any>
  /** 栅格行配置 */
  rowProps?: Record<string, any>
  /** 内容渲染函数 */
  contentRender?: (items: any[], submitter: any, form: any) => any
  /** 字段属性 */
  fieldProps?: Record<string, any>
  /** ProField 属性 */
  proFieldProps?: Record<string, any>
  /** 表单项属性 */
  formItemProps?: Record<string, any>
  /** 分组属性 */
  groupProps?: ProFormGroupProps
  /** 表单组件类型 */
  formComponentType?: 'DrawerForm' | 'ModalForm' | 'QueryFilter'
  /** 是否回车提交 */
  isKeyPressSubmit?: boolean
  /** 是否自动聚焦第一个输入框 */
  autoFocusFirstInput?: boolean
  /** 是否忽略 nil 值 */
  omitNil?: boolean
  /** 日期格式化 */
  dateFormatter?:
    | string
    | ((value: any, valueType: string) => string | number)
    | false
  /** 表单初始化回调 */
  onInit?: (values: T, form: any) => void
  /** 请求参数 */
  params?: U
  /** 请求函数 */
  request?: (params: U) => Promise<T>
  /** 表单 key */
  formKey?: string
  /** 同步到 URL */
  syncToUrl?: boolean | ((values: T, type: 'get' | 'set') => T)
  /** 同步到 URL 时以 URL 为主 */
  syncToUrlAsImportant?: boolean
  /** 额外的 URL 参数 */
  extraUrlParams?: Record<string, any>
  /** 同步到初始值 */
  syncToInitialValues?: boolean
  /** 初始值 */
  initialValues?: T
  /** 是否保留隐藏字段 */
  preserve?: boolean
}
