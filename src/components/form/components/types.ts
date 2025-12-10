import type {
    CascaderProps,
    CheckboxGroupProps,
    ColorPickerProps,
    DatePickerProps,
    DateRangePickerProps,
    FormItemProps,
    InputNumberProps,
    InputProps,
    RadioGroupProps,
    RateProps,
    SelectProps,
    SliderProps,
    SwitchProps,
    TextareaProps,
    TimePickerProps,
    TimeRangePickerProps,
    TreeSelectProps,
} from 'tdesign-vue-next'
import type { VNode } from 'vue'
import type { ProFormFieldItemProps } from '../typing'

/**
 * 搜索值转换函数类型
 * 用于在表单提交时转换字段值
 */
export type SearchTransformKeyFn = (
  value: any,
  namePath: string | string[],
  allValues: Record<string, any>
) => string | Record<string, any>

// 基础表单项类型
export interface ProFormItemProps extends FormItemProps {
  ignoreFormItem?: boolean
  valueType?: string
  transform?: any
  dataFormat?: string
  lightProps?: any
  proFormFieldKey?: any
}

// 文本输入框
export interface ProFormTextProps extends ProFormFieldItemProps {
  fieldProps?: InputProps
}

// 文本域
export interface ProFormTextAreaProps extends ProFormFieldItemProps {
  fieldProps?: TextareaProps
}

// 选择器
export interface ProFormSelectProps extends ProFormFieldItemProps {
  options?: Array<{ label: string; value: any; disabled?: boolean }>
  mode?: 'multiple' | 'tags'
  showSearch?: boolean
  allowClear?: boolean
  fieldProps?: SelectProps
}

// 单选框组
export interface ProFormRadioGroupProps extends ProFormFieldItemProps {
  options?: Array<{ label: string; value: any; disabled?: boolean }>
  radioType?: 'radio' | 'button'
  fieldProps?: RadioGroupProps
}

// 复选框组
export interface ProFormCheckboxGroupProps extends ProFormFieldItemProps {
  options?: Array<{ label: string; value: any; disabled?: boolean }>
  fieldProps?: CheckboxGroupProps
}

// 开关
export interface ProFormSwitchProps extends ProFormFieldItemProps {
  checkedChildren?: VNode | string
  unCheckedChildren?: VNode | string
  fieldProps?: SwitchProps
}

// 滑块
export interface ProFormSliderProps extends ProFormFieldItemProps {
  min?: number
  max?: number
  step?: number
  range?: boolean
  fieldProps?: SliderProps
}

// 评分
export interface ProFormRateProps extends ProFormFieldItemProps {
  count?: number
  allowHalf?: boolean
  allowClear?: boolean
  fieldProps?: RateProps
}

// 日期选择器
export interface ProFormDatePickerProps extends ProFormFieldItemProps {
  format?: string
  valueFormat?: string
  placeholder?: string
  fieldProps?: DatePickerProps
}

// 日期范围选择器
export interface ProFormDateRangePickerProps extends ProFormFieldItemProps {
  format?: string
  valueFormat?: string
  placeholder?: [string, string]
  fieldProps?: DateRangePickerProps
}

// 时间选择器
export interface ProFormTimePickerProps extends ProFormFieldItemProps {
  format?: string
  placeholder?: string
  fieldProps?: TimePickerProps
}

// 时间范围选择器
export interface ProFormTimeRangePickerProps extends ProFormFieldItemProps {
  format?: string
  placeholder?: string
  fieldProps?: TimeRangePickerProps
}

// 数字输入框
export interface ProFormDigitProps extends ProFormFieldItemProps {
  min?: number
  max?: number
  step?: number
  precision?: number
  fieldProps?: InputNumberProps
}

// 金额输入框
export interface ProFormMoneyProps extends ProFormFieldItemProps {
  min?: number
  max?: number
  precision?: number
  locale?: string
  customSymbol?: string
  fieldProps?: InputNumberProps
}

// 树选择器
export interface ProFormTreeSelectProps extends ProFormFieldItemProps {
  treeData?: any[]
  multiple?: boolean
  treeCheckable?: boolean
  showSearch?: boolean
  fieldProps?: TreeSelectProps
}

// 级联选择器
export interface ProFormCascaderProps extends ProFormFieldItemProps {
  options?: any[]
  multiple?: boolean
  showSearch?: boolean
  fieldProps?: CascaderProps
}

// 颜色选择器
export interface ProFormColorPickerProps extends ProFormFieldItemProps {
  format?: 'hex' | 'rgb' | 'hsl'
  showText?: boolean
  fieldProps?: ColorPickerProps
}

// 密码输入框
export interface ProFormPasswordProps extends ProFormFieldItemProps {
  fieldProps?: InputProps
}

// 分段控制器
export interface ProFormSegmentedProps extends ProFormFieldItemProps {
  options?: Array<{ label: string; value: any; disabled?: boolean }>
  fieldProps?: any
}

// 上传按钮
export interface ProFormUploadButtonProps extends ProFormFieldItemProps {
  accept?: string
  multiple?: boolean
  maxCount?: number
  listType?: 'text' | 'picture' | 'picture-card'
  fieldProps?: any
}

// 上传拖拽
export interface ProFormUploadDraggerProps extends ProFormFieldItemProps {
  accept?: string
  multiple?: boolean
  maxCount?: number
  fieldProps?: any
}

// 图标配置
export interface IconConfig {
  Icon?: any
  tooltipText?: string
}

// 操作守卫
export interface FormListActionGuard {
  beforeAddRow?: (
    defaultValue: any,
    insertIndex: number,
    count: number
  ) => boolean | Promise<boolean>
  beforeRemoveRow?: (index: number, count: number) => boolean | Promise<boolean>
}

// 操作类型
export interface FormListOperation {
  add: (defaultValue?: any, insertIndex?: number) => void
  remove: (index: number | number[]) => void
  move: (from: number, to: number) => void
}

// 表单列表
export interface ProFormListProps extends ProFormFieldItemProps {
  min?: number
  max?: number
  copyIconProps?: IconConfig | false
  deleteIconProps?: IconConfig | false
  upIconProps?: IconConfig | false
  downIconProps?: IconConfig | false
  arrowSort?: boolean
  creatorButtonProps?:
    | false
    | {
        creatorButtonText?: string | VNode
        position?: 'top' | 'bottom'
        type?: 'default' | 'primary' | 'danger' | 'warning'
        block?: boolean
        icon?: VNode
      }
  creatorRecord?: Record<string, any> | (() => Record<string, any>)
  actionRender?: (
    field: { name: number; key: number },
    action: FormListOperation,
    defaultActionDom: VNode[],
    count: number
  ) => VNode[]
  actionGuard?: FormListActionGuard
  itemContainerRender?: (doms: VNode | VNode[], listMeta: any) => VNode
  itemRender?: (
    dom: { listDom: VNode; action: VNode | null },
    listMeta: any
  ) => VNode
  alwaysShowItemLabel?: boolean
  fieldExtraRender?: (
    action: FormListOperation,
    meta: { errors?: VNode[]; warnings?: VNode[] }
  ) => VNode
  onAfterAdd?: (defaultValue: any, insertIndex: number, count: number) => void
  onAfterRemove?: (index: number, count: number) => void
  containerClassName?: string
  containerStyle?: Record<string, any>
  readonly?: boolean
}

// 表单组
export interface ProFormGroupProps extends ProFormFieldItemProps {
  title?: VNode | string
  label?: VNode | string
  tooltip?: VNode | string
  collapsible?: boolean
  defaultCollapsed?: boolean
  collapsed?: boolean
  onCollapse?: (collapsed: boolean) => void
  extra?: VNode | string
  size?: 'small' | 'medium' | 'large' | number
  direction?: 'horizontal' | 'vertical'
  align?: 'start' | 'end' | 'center' | 'baseline'
  wrap?: boolean
  titleStyle?: Record<string, any>
  titleRender?: (title: VNode | string | undefined, props: any) => VNode
  labelLayout?: 'inline' | 'twoLine'
  autoFocus?: boolean
  spaceProps?: Record<string, any>
}

// 表单集合
export interface ProFormFieldSetProps extends ProFormFieldItemProps {
  type?: 'space' | 'group'
  value?: any[]
  onChange?: (value: any[]) => void
  valuePropName?: string
  space?: {
    size?: 'small' | 'medium' | 'large' | number
    direction?: 'horizontal' | 'vertical'
    align?: 'start' | 'end' | 'center' | 'baseline'
    wrap?: boolean
  }
  convertValue?: (value: any, namePath: string | string[]) => any
  transform?: (value: any, namePath: string | string[], allValues: any) => any
}

// 表单依赖
export interface ProFormDependencyProps {
  name: string | string[]
  children: (values: any, form: any) => VNode | VNode[]
  ignoreFormListField?: boolean
}

// 验证码输入框
export interface ProFormCaptchaProps extends ProFormFieldItemProps {
  /** 倒计时的秒数，默认 60 */
  countDown?: number
  /** 手机号的 name，用于验证 */
  phoneName?: string | string[]
  /** 获取验证码的方法 */
  onGetCaptcha: (mobile: string) => Promise<void>
  /** 计时回调 */
  onTiming?: (count: number) => void
  /** 渲染按钮的文字 */
  captchaTextRender?: (timing: boolean, count: number) => VNode | string
  /** 获取按钮验证码的 props */
  captchaProps?: Record<string, any>
  fieldProps?: InputProps
}

// 通用字段包装器
export interface ProFormFieldProps extends ProFormFieldItemProps {
  /** 值类型 */
  valueType?: string
  /** 值枚举 */
  valueEnum?: Record<string, any> | Map<string | number, any>
  /** 渲染模式 */
  mode?: 'edit' | 'read' | 'update'
  /** 是否为默认 DOM */
  isDefaultDom?: boolean
  /** 纯文本模式 */
  plain?: boolean
  /** 文本值 */
  text?: any
  /** 获取字段属性 */
  getFieldProps?: () => Record<string, any>
  /** 获取表单项属性 */
  getFormItemProps?: () => Record<string, any>
  /** 依赖值 */
  dependenciesValues?: Record<string, any>
  /** 原始依赖 */
  originDependencies?: Record<string, unknown>
}
