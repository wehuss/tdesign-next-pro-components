import type { Ref, VNode } from 'vue'

/** Field 组件的模式 */
export type ProFieldMode = 'read' | 'edit' | 'update'

/** Field 的基础文本类型 */
// export type ProFieldTextType =
//   | string
//   | number
//   | boolean
//   | null
//   | undefined
//   | Date
//   | Array<unknown>
export type ProFieldTextType = any

/** Field 的值类型枚举 */
export type ProFieldValueType =
  | 'text'
  | 'textarea'
  | 'password'
  | 'money'
  | 'digit'
  | 'digitRange'
  | 'percent'
  | 'date'
  | 'dateRange'
  | 'dateTime'
  | 'dateTimeRange'
  | 'time'
  | 'timeRange'
  | 'select'
  | 'checkbox'
  | 'radio'
  | 'radioButton'
  | 'switch'
  | 'rate'
  | 'slider'
  | 'color'
  | 'avatar'
  | 'image'
  | 'code'
  | 'jsonCode'
  | 'progress'
  | 'tag'
  | 'status'
  | 'option'
  | 'index'
  | 'indexBorder'
  | 'cascader'
  | 'treeSelect'
  | 'fromNow'
  | 'second'
  | 'segmented'

/** Field 的值类型函数版本 */
export type ProFieldValueTypeFunction = (
  record?: unknown,
  type?: string
) => ProFieldValueType

/** 空文本配置 */
export type ProFieldEmptyText = string | false

/** ValueEnum 的配置 */
export type ProFieldValueEnumObj = {
  [key: string]: {
    text: string
    theme?: 'success' | 'danger' | 'primary' | 'warning' | 'default'
    variant?: 'dark' | 'light' | 'outline' | 'light-outline'
    color?: string
    disabled?: boolean
  }
}

export type ProFieldValueEnumMap = Map<
  string | number,
  | string
  | {
      text: string
      theme?: 'success' | 'danger' | 'primary' | 'warning' | 'default'
      variant?: 'dark' | 'light' | 'outline' | 'light-outline'
      color?: string
      disabled?: boolean
    }
>

export type ProFieldValueEnumType = ProFieldValueEnumObj | ProFieldValueEnumMap

/** 渲染函数的props类型 */
export interface ProFieldRenderProps {
  mode?: ProFieldMode
  modelValue?: ProFieldTextType
  fieldProps?: Record<string, unknown>
  placeholder?: string | string[]
  valueEnum?: ProFieldValueEnumObj | ProFieldValueEnumMap
  readonly?: boolean
  disabled?: boolean
  [key: string]: unknown
}

/** 自定义渲染函数类型 */
export type ProFieldRenderFunction = (
  modelValue: ProFieldTextType,
  props: ProFieldRenderProps,
  dom: VNode
) => VNode | null

/** Field 组件的 Props */
export interface ProFieldProps {
  /** v-model 绑定的值 - 使用标准的 modelValue */
  modelValue?: ProFieldTextType
  /** 值的类型 */
  valueType?: ProFieldValueType
  /** 渲染模式 */
  mode?: ProFieldMode
  /** 是否为只读模式 */
  readonly?: boolean
  /** 是否禁用 */
  disabled?: boolean
  /** 占位符 */
  placeholder?: string | string[]
  /** 空值时的显示文本 */
  emptyText?: ProFieldEmptyText
  /** 值枚举 */
  valueEnum?: ProFieldValueEnumObj | ProFieldValueEnumMap
  /** 字段属性，会透传给具体的组件 */
  fieldProps?: Record<string, unknown>
  /** 自定义渲染 */
  render?: ProFieldRenderFunction
  /** 表单项渲染 */
  formItemRender?: ProFieldRenderFunction
  /** 值改变回调 */
  onChange?: (value: unknown) => void
}

/** Field HOC 的 props */
export interface FieldHOCProps {
  isLight?: boolean
  children?: VNode
}

/** 特定值类型的对象配置 */
export interface ProFieldValueObject {
  type: ProFieldValueType
  status?: 'normal' | 'active' | 'success' | 'exception'
  locale?: string
  /** 百分比组件 */
  showSymbol?: boolean | ((value: unknown) => boolean)
  showColor?: boolean
  precision?: number
  /** 金额组件 */
  moneySymbol?: boolean
  /** 图片组件 */
  width?: number
}

/** Field 组件的基础 FC 类型 */
export interface BaseProFieldFC {
  modelValue?: ProFieldTextType
  mode?: ProFieldMode
  render?: ProFieldRenderFunction
  formItemRender?: ProFieldRenderFunction
  placeholder?: string | string[]
  fieldProps?: Record<string, unknown>
  readonly?: boolean
  disabled?: boolean
}

/** 单个 Field 组件的函数组件类型 */
export type ProFieldFC<T = Record<string, never>> = (
  props: BaseProFieldFC & T,
  ref?: Ref<unknown>
) => VNode | null

/** ValueType 映射到具体的渲染配置 */
export interface ProRenderFieldPropsType {
  render?: (
    modelValue: ProFieldTextType,
    props: ProFieldRenderProps,
    dom?: VNode
  ) => VNode | null
  formItemRender?: (
    modelValue: ProFieldTextType,
    props: ProFieldRenderProps,
    dom?: VNode
  ) => VNode | null
}

/** ValueType 映射表 */
export type ValueTypeMap = Record<string, ProRenderFieldPropsType>
