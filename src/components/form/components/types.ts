import type { FormItemProps } from 'tdesign-vue-next'
import type { VNode } from 'vue'
import type { ProFormFieldItemProps } from '../typing'

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
  // 继承所有基础属性
}

// 文本域
export interface ProFormTextAreaProps extends ProFormFieldItemProps {
  // 继承所有基础属性
}

// 选择器
export interface ProFormSelectProps extends ProFormFieldItemProps {
  options?: Array<{ label: string; value: any; disabled?: boolean }>
  mode?: 'multiple' | 'tags'
  showSearch?: boolean
  allowClear?: boolean
}

// 单选框组
export interface ProFormRadioGroupProps extends ProFormFieldItemProps {
  options?: Array<{ label: string; value: any; disabled?: boolean }>
  radioType?: 'radio' | 'button'
}

// 复选框组
export interface ProFormCheckboxGroupProps extends ProFormFieldItemProps {
  options?: Array<{ label: string; value: any; disabled?: boolean }>
}

// 开关
export interface ProFormSwitchProps extends ProFormFieldItemProps {
  checkedChildren?: VNode | string
  unCheckedChildren?: VNode | string
}

// 滑块
export interface ProFormSliderProps extends ProFormFieldItemProps {
  min?: number
  max?: number
  step?: number
  range?: boolean
}

// 评分
export interface ProFormRateProps extends ProFormFieldItemProps {
  count?: number
  allowHalf?: boolean
  allowClear?: boolean
}

// 日期选择器
export interface ProFormDatePickerProps extends ProFormFieldItemProps {
  format?: string
  valueFormat?: string
  placeholder?: string
}

// 日期范围选择器
export interface ProFormDateRangePickerProps extends ProFormFieldItemProps {
  format?: string
  valueFormat?: string
  placeholder?: [string, string]
}

// 时间选择器
export interface ProFormTimePickerProps extends ProFormFieldItemProps {
  format?: string
  placeholder?: string
}

// 数字输入框
export interface ProFormDigitProps extends ProFormFieldItemProps {
  min?: number
  max?: number
  step?: number
  precision?: number
}

// 金额输入框
export interface ProFormMoneyProps extends ProFormFieldItemProps {
  min?: number
  max?: number
  precision?: number
  locale?: string
  customSymbol?: string
}

// 树选择器
export interface ProFormTreeSelectProps extends ProFormFieldItemProps {
  treeData?: any[]
  multiple?: boolean
  treeCheckable?: boolean
  showSearch?: boolean
}

// 级联选择器
export interface ProFormCascaderProps extends ProFormFieldItemProps {
  options?: any[]
  multiple?: boolean
  showSearch?: boolean
}

// 颜色选择器
export interface ProFormColorPickerProps extends ProFormFieldItemProps {
  format?: 'hex' | 'rgb' | 'hsl'
  showText?: boolean
}

// 上传按钮
export interface ProFormUploadButtonProps extends ProFormFieldItemProps {
  accept?: string
  multiple?: boolean
  maxCount?: number
  listType?: 'text' | 'picture' | 'picture-card'
}

// 上传拖拽
export interface ProFormUploadDraggerProps extends ProFormFieldItemProps {
  accept?: string
  multiple?: boolean
  maxCount?: number
}

// 表单列表
export interface ProFormListProps extends ProFormFieldItemProps {
  min?: number
  max?: number
  copyIconProps?: any
  deleteIconProps?: any
  creatorButtonProps?: any
  creatorRecord?: any
  actionRender?: (field: any, action: any, defaultActionDom: VNode[], count: number) => VNode[]
  actionGuard?: {
    beforeAddRow?: (defaultValue: any, insertIndex: number, count: number) => boolean | Promise<boolean>
    beforeRemoveRow?: (index: number, count: number) => boolean | Promise<boolean>
  }
}

// 表单组
export interface ProFormGroupProps extends ProFormFieldItemProps {
  title?: VNode | string
  collapsible?: boolean
  defaultCollapsed?: boolean
  extra?: VNode
}

// 表单集合
export interface ProFormFieldSetProps extends ProFormFieldItemProps {
  type?: 'space' | 'group' | 'card'
  title?: VNode | string
  tooltip?: VNode | string
}

// 表单依赖
export interface ProFormDependencyProps {
  name: string | string[]
  children: (values: any, form: any) => VNode | VNode[]
  ignoreFormListField?: boolean
}