import { ProFormCaptcha } from './captcha'
import { ProFormCascader } from './cascader'
import { ProFormCheckbox } from './checkbox'
import { ProFormColorPicker } from './color-picker'
import { ProFormDatePicker } from './date-picker'
import { ProFormDateRangePicker } from './date-range-picker'
import { ProFormDependency } from './dependency'
import { ProFormDigit } from './digit'
import { ProFormField } from './field'
import { ProFormFieldSet } from './field-set'
import { ProFormItem } from './form-item'
import { ProFormGroup } from './group'
import { ProFormList } from './list'
import { ProFormMoney } from './money'
import { ProFormPassword } from './password'
import { ProFormRadio } from './radio'
import { ProFormRate } from './rate'
import { ProFormSegmented } from './segmented'
import { ProFormSelect } from './select'
import { ProFormSlider } from './slider'
import { ProFormSwitch } from './switch'
import { ProFormText } from './text'
import { ProFormTextArea } from './text-area'
import { ProFormTimePicker } from './time-picker'
import { ProFormTimeRangePicker } from './time-range-picker'
import { ProFormTreeSelect } from './tree-select'
import { ProFormUploadButton } from './upload-button'
import { ProFormUploadDragger } from './upload-dragger'

/**
 * 搜索值转换函数类型
 * 用于在表单提交时转换字段值
 */
export type SearchTransformKeyFn = (
  value: any,
  namePath: string | string[],
  allValues: Record<string, any>,
) => string | Record<string, any>

// 基础表单项类型
export type ProFormItemProps = InstanceType<typeof ProFormItem>['$props']

// 文本输入框
export type ProFormTextProps = InstanceType<typeof ProFormText>['$props']

// 文本域
export type ProFormTextAreaProps = InstanceType<typeof ProFormTextArea>['$props']

// 选择器
export type ProFormSelectProps = InstanceType<typeof ProFormSelect>['$props']

// 单选框组
export type ProFormRadioGroupProps = InstanceType<typeof ProFormRadio>['$props']

// 复选框组
export type ProFormCheckboxGroupProps = InstanceType<typeof ProFormCheckbox>['$props']

// 开关
export type ProFormSwitchProps = InstanceType<typeof ProFormSwitch>['$props']

// 滑块
export type ProFormSliderProps = InstanceType<typeof ProFormSlider>['$props']

// 评分
export type ProFormRateProps = InstanceType<typeof ProFormRate>['$props']

// 日期选择器
export type ProFormDatePickerProps = InstanceType<typeof ProFormDatePicker>['$props']

// 日期范围选择器
export type ProFormDateRangePickerProps = InstanceType<typeof ProFormDateRangePicker>['$props']

// 时间选择器
export type ProFormTimePickerProps = InstanceType<typeof ProFormTimePicker>['$props']

// 时间范围选择器
export type ProFormTimeRangePickerProps = InstanceType<typeof ProFormTimeRangePicker>['$props']

// 数字输入框
export type ProFormDigitProps = InstanceType<typeof ProFormDigit>['$props']

// 金额输入框
export type ProFormMoneyProps = InstanceType<typeof ProFormMoney>['$props']

// 树选择器
export type ProFormTreeSelectProps = InstanceType<typeof ProFormTreeSelect>['$props']

// 级联选择器
export type ProFormCascaderProps = InstanceType<typeof ProFormCascader>['$props']

// 颜色选择器
export type ProFormColorPickerProps = InstanceType<typeof ProFormColorPicker>['$props']

// 密码输入框
export type ProFormPasswordProps = InstanceType<typeof ProFormPassword>['$props']

// 分段控制器
export type ProFormSegmentedProps = InstanceType<typeof ProFormSegmented>['$props']

// 上传按钮
export type ProFormUploadButtonProps = InstanceType<typeof ProFormUploadButton>['$props']

// 上传拖拽
export type ProFormUploadDraggerProps = InstanceType<typeof ProFormUploadDragger>['$props']

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
    count: number,
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
export type ProFormListProps = InstanceType<typeof ProFormList>['$props']

// 表单组
export type ProFormGroupProps = InstanceType<typeof ProFormGroup>['$props']

// 表单集合
export type ProFormFieldSetProps = InstanceType<typeof ProFormFieldSet>['$props']

// 表单依赖
export type ProFormDependencyProps = InstanceType<typeof ProFormDependency>['$props']

// 验证码输入框
export type ProFormCaptchaProps = InstanceType<typeof ProFormCaptcha>['$props']

// 通用字段包装器
export type ProFormFieldProps = InstanceType<typeof ProFormField>['$props']
