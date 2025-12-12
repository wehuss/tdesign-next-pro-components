import type { FormItemProps } from 'tdesign-vue-next'
import type { PropType, VNode } from 'vue'
import type { ProFieldValueEnumType } from '../../field/types'

/**
 * 搜索值转换函数类型
 * 用于在表单提交时转换字段值
 */
export type SearchTransformKeyFn = (
  value: any,
  namePath: string | string[],
  allValues: Record<string, any>
) => string | Record<string, any>

/**
 * ProForm 通用 props 定义
 * 这些 props 是所有 ProFormXXX 组件共有的
 */
export const proFormFieldProps = {
  /** 字段名称，用于表单数据收集 */
  name: [String, Array] as PropType<string | string[]>,
  /** v-model 值 */
  modelValue: {
    type: [String, Number, Boolean, Array, Object] as PropType<any>,
    default: undefined,
  },
  /** 标签文本 - 与 TDesign FormItem label 类型兼容 */
  label: [String, Function] as PropType<FormItemProps['label']>,
  /** 表单验证规则 */
  rules: Array as PropType<FormItemProps['rules']>,
  /** 是否必填 */
  required: Boolean,
  /** 帮助提示信息 - 与 TDesign FormItem help 类型兼容 */
  help: [String, Object, Function] as PropType<FormItemProps['help']>,
  /** 额外信息 */
  extra: [String, Function] as PropType<string | (() => VNode)>,
  /** 字段宽度 */
  width: [String, Number] as PropType<string | number>,
  /** 是否忽略 FormItem 包装 */
  ignoreFormItem: Boolean,
  /** valueType 类型 */
  valueType: {
    type: String,
    default: undefined,
  },
  /** 值枚举 */
  valueEnum: {
    type: [Object, Map] as unknown as () => ProFieldValueEnumType,
    default: undefined,
  },
  /** 值转换函数 */
  transform: Function as PropType<SearchTransformKeyFn>,
  /** 获取时转化值 */
  convertValue: Function,
  /** 数据格式 */
  dataFormat: String,
  /** LightFilter 相关属性 */
  lightProps: Object,
  /** 前置装饰 */
  addonBefore: [String, Function] as PropType<string | (() => VNode)>,
  /** 后置装饰 */
  addonAfter: [String, Function] as PropType<string | (() => VNode)>,
  /** 装饰容器样式 */
  addonWarpStyle: Object,
  /** 是否次要 */
  secondary: Boolean,
  /** 栅格列配置 */
  colProps: Object,
  /** 栅格行配置 */
  rowProps: Object,
  /** FormItem 的额外属性 */
  formItemProps: {
    type: Object as PropType<Partial<FormItemProps>>,
    default: () => ({}),
  },
  /** 请求相关 */
  request: Function,
  /** 请求参数 */
  params: Object,
  /** 防抖时间 */
  debounceTime: {
    type: Number,
    default: 300,
  },
  /** ProField 属性 */
  proFieldProps: Object,
  /** 空值文本 */
  emptyText: {
    type: String,
    default: '-',
  },
  /** 是否只读 */
  readonly: Boolean,
  /** 初始值 */
  initialValue: null,
} as const

/**
 * ProForm 通用 emits
 */
export const proFormFieldEmits = [
  'update:modelValue',
  'change',
  'blur',
  'focus',
] as const

/**
 * 从 attrs 中过滤掉 ProTable columns 配置属性
 */
export const FILTERED_ATTRS = [
  'title',
  'description',
  'dataIndex',
  'key',
  'hideInTable',
  'hideInSearch',
  'hideInForm',
  'sorter',
  'filters',
  'ellipsis',
  'copyable',
  'order',
  'search',
  'editable',
  'fixed',
  'align',
  'className',
  'render',
  'renderText',
  'renderFormItem',
  'children',
  'onFilter',
  'onCell',
  'onHeaderCell',
] as const

/**
 * 过滤掉不需要传递给表单项的属性
 */
export function filterAttrs(attrs: Record<string, any>): Record<string, any> {
  const result: Record<string, any> = {}
  for (const key of Object.keys(attrs)) {
    if (!FILTERED_ATTRS.includes(key as any)) {
      result[key] = attrs[key]
    }
  }
  return result
}

/**
 * ProForm 字段 props 的 key 列表
 * 用于从 props 中分离出 ProForm 特有属性和 TDesign 组件属性
 */
export const proFormFieldPropsKeys = Object.keys(proFormFieldProps) as Array<
  keyof typeof proFormFieldProps
>

/**
 * 从 props 中提取 ProForm 专用属性
 */
export function extractProFormProps<T extends Record<string, any>>(props: T) {
  const proFormProps: Record<string, any> = {}
  const componentProps: Record<string, any> = {}

  for (const key of Object.keys(props)) {
    if (proFormFieldPropsKeys.includes(key as any)) {
      proFormProps[key] = props[key]
    } else {
      componentProps[key] = props[key]
    }
  }

  return { proFormProps, componentProps }
}
