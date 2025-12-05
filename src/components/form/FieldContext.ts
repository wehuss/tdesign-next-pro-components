import type { FormItemProps } from 'tdesign-vue-next'
import {
  inject,
  provide,
  type ComputedRef,
  type InjectionKey,
  type Ref,
} from 'vue'
import type { ProFieldProps, ProFieldValueType } from '../field/types'
import type { ProFormInstance } from './BaseForm'
import type { ProFormGroupProps } from './typing'

/**
 * 搜索转换函数类型
 * 用于在表单提交时转换字段值
 */
export type SearchTransformKeyFn = (
  value: unknown,
  namePath: string | string[],
  allValues: Record<string, unknown>
) => string | Record<string, unknown>

/**
 * 字段属性类型
 */
export interface FieldProps {
  style?: Record<string, unknown>
  width?: string | number
  [key: string]: unknown
}

/**
 * FieldContext 的值类型
 * 提供表单字段级别的上下文信息
 */
export interface FieldContextValue {
  /** 表单实例引用 */
  formRef?: Ref<ProFormInstance | undefined>

  /** 字段属性，传递给底层输入组件 */
  fieldProps?: FieldProps

  /** ProField 属性 */
  proFieldProps?: ProFieldProps

  /** 表单项属性 */
  formItemProps?: FormItemProps

  /** 分组属性 */
  groupProps?: ProFormGroupProps

  /**
   * 设置字段值类型
   * 用于在表单提交时进行值转换
   */
  setFieldValueType?: (
    name: string | string[],
    config: {
      /** 值类型 */
      valueType?: ProFieldValueType
      /** 日期格式 */
      dateFormat?: string
      /** 数据转换函数 */
      transform?: SearchTransformKeyFn
    }
  ) => void

  /** 表单组件类型 */
  formComponentType?:
    | 'DrawerForm'
    | 'ModalForm'
    | 'QueryFilter'
    | 'LightFilter'
    | 'StepsForm'
    | string

  /** 表单唯一标识，用于获取表单实例 */
  formKey?: string

  /** 获取弹出层容器 */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getPopupContainer?: (node: any) => any

  /** 是否启用网格布局 */
  grid?: boolean

  /** 列属性（网格布局时使用） */
  colProps?: Record<string, unknown>

  /** 行属性（网格布局时使用） */
  rowProps?: Record<string, unknown>
}

/**
 * 响应式 FieldContext 值类型
 * 支持响应式属性
 */
export interface ReactiveFieldContextValue
  extends Omit<FieldContextValue, 'grid'> {
  /** 是否启用网格布局（响应式） */
  grid?: boolean | ComputedRef<boolean> | Ref<boolean>
}

/** 默认上下文值 */
const defaultContextValue: FieldContextValue = {
  fieldProps: {},
  proFieldProps: {},
  formItemProps: {},
  groupProps: {},
  grid: false,
}

/** 注入键 */
export const FieldContextKey: InjectionKey<
  FieldContextValue | ReactiveFieldContextValue
> = Symbol('FieldContext')

/**
 * 使用 FieldContext
 * @returns 当前的字段上下文
 */
export const useFieldContext = (): FieldContextValue => {
  const context = inject(FieldContextKey, defaultContextValue)

  // 处理响应式 grid 值
  if (
    context &&
    context.grid &&
    typeof context.grid === 'object' &&
    'value' in context.grid
  ) {
    return {
      ...context,
      grid: (context.grid as ComputedRef<boolean> | Ref<boolean>).value,
    } as FieldContextValue
  }

  return context as FieldContextValue
}

/**
 * 提供 FieldContext
 * @param value 上下文值
 */
export const provideFieldContext = (
  value: FieldContextValue | ReactiveFieldContextValue
) => {
  provide(FieldContextKey, value)
}

/**
 * 创建 FieldContext 值
 * 合并默认值和传入的值
 * @param value 部分上下文值
 * @returns 完整的上下文值
 */
export const createFieldContext = (
  value: Partial<FieldContextValue | ReactiveFieldContextValue>
): FieldContextValue | ReactiveFieldContextValue => {
  return {
    ...defaultContextValue,
    ...value,
  }
}

/**
 * FieldContext 对象
 * 提供 provide 和 inject 方法的便捷访问
 */
export const FieldContext = {
  /** 提供上下文 */
  provide: provideFieldContext,
  /** 注入上下文 */
  inject: useFieldContext,
  /** 创建上下文 */
  create: createFieldContext,
  /** 注入键 */
  key: FieldContextKey,
}

export default FieldContext
