import type { FormItemProps } from 'tdesign-vue-next'
import {
  inject,
  provide,
  reactive,
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
 * 字段注册信息
 * 用于跟踪表单中的字段及其值
 */
export interface FieldRegistration {
  /** 字段名称路径 */
  name: string | string[]
  /** 获取字段当前值 */
  getValue: () => any
  /** 设置字段值 */
  setValue: (value: any) => void
  /** 字段初始值 */
  initialValue?: any
  /** 值类型 */
  valueType?: ProFieldValueType
  /** 日期格式 */
  dateFormat?: string
  /** 数据转换函数 */
  transform?: SearchTransformKeyFn
}

/**
 * 字段存储类型
 * 使用字段名称路径作为键
 */
export type FieldStore = Map<string, FieldRegistration>

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

  /**
   * 注册字段到表单
   * @param registration 字段注册信息
   * @returns 注销函数
   */
  registerField?: (registration: FieldRegistration) => () => void

  /**
   * 注销字段
   * @param name 字段名称路径
   */
  unregisterField?: (name: string | string[]) => void

  /**
   * 获取所有字段值
   * @returns 所有字段的值对象
   */
  getFieldsValue?: () => Record<string, any>

  /**
   * 获取单个字段值
   * @param name 字段名称路径
   * @returns 字段值
   */
  getFieldValue?: (name: string | string[]) => any

  /**
   * 设置字段值
   * @param name 字段名称路径
   * @param value 字段值
   */
  setFieldValue?: (name: string | string[], value: any) => void

  /**
   * 批量设置字段值
   * @param values 字段值对象
   */
  setFieldsValue?: (values: Record<string, any>) => void

  /**
   * 重置所有字段到初始值
   */
  resetFields?: () => void

  /**
   * 重置指定字段到初始值
   * @param names 字段名称路径数组
   */
  resetFieldsToInitial?: (names?: (string | string[])[]) => void

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
 * 将字段名称路径转换为字符串键
 * @param name 字段名称路径
 * @returns 字符串键
 */
export function getFieldKey(name: string | string[]): string {
  if (Array.isArray(name)) {
    return name.join('.')
  }
  return name
}

/**
 * 根据字段名称路径设置嵌套对象的值
 * @param obj 目标对象
 * @param path 字段名称路径
 * @param value 要设置的值
 */
export function setNestedValue(
  obj: Record<string, any>,
  path: string | string[],
  value: any
): void {
  const keys = Array.isArray(path) ? path : path.split('.')
  let current = obj

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i]
    if (!(key in current) || typeof current[key] !== 'object') {
      current[key] = {}
    }
    current = current[key]
  }

  current[keys[keys.length - 1]] = value
}

/**
 * 根据字段名称路径获取嵌套对象的值
 * @param obj 源对象
 * @param path 字段名称路径
 * @returns 字段值
 */
export function getNestedValue(
  obj: Record<string, any>,
  path: string | string[]
): any {
  const keys = Array.isArray(path) ? path : path.split('.')
  let current = obj

  for (const key of keys) {
    if (current === null || current === undefined) {
      return undefined
    }
    current = current[key]
  }

  return current
}

/**
 * 创建字段存储
 * 用于管理表单中的所有字段
 */
export function createFieldStore(): FieldStore {
  return reactive(new Map<string, FieldRegistration>()) as FieldStore
}

/**
 * 创建字段管理器
 * 提供字段注册、注销、值收集等功能
 */
export function createFieldManager(fieldStore: FieldStore) {
  /**
   * 注册字段
   */
  const registerField = (registration: FieldRegistration): (() => void) => {
    const key = getFieldKey(registration.name)
    fieldStore.set(key, registration)

    // 返回注销函数
    return () => {
      unregisterField(registration.name)
    }
  }

  /**
   * 注销字段
   */
  const unregisterField = (name: string | string[]): void => {
    const key = getFieldKey(name)
    fieldStore.delete(key)
  }

  /**
   * 获取所有字段值
   */
  const getFieldsValue = (): Record<string, any> => {
    const values: Record<string, any> = {}

    fieldStore.forEach((registration, _key) => {
      const value = registration.getValue()
      setNestedValue(values, registration.name, value)
    })

    return values
  }

  /**
   * 获取单个字段值
   */
  const getFieldValue = (name: string | string[]): any => {
    const key = getFieldKey(name)
    const registration = fieldStore.get(key)
    return registration?.getValue()
  }

  /**
   * 设置字段值
   */
  const setFieldValue = (name: string | string[], value: any): void => {
    const key = getFieldKey(name)
    const registration = fieldStore.get(key)
    registration?.setValue(value)
  }

  /**
   * 批量设置字段值
   */
  const setFieldsValue = (values: Record<string, any>): void => {
    fieldStore.forEach((registration, _key) => {
      const value = getNestedValue(values, registration.name)
      if (value !== undefined) {
        registration.setValue(value)
      }
    })
  }

  /**
   * 重置所有字段到初始值
   */
  const resetFields = (): void => {
    fieldStore.forEach(registration => {
      if (registration.initialValue !== undefined) {
        registration.setValue(registration.initialValue)
      } else {
        registration.setValue(undefined)
      }
    })
  }

  /**
   * 重置指定字段到初始值
   */
  const resetFieldsToInitial = (names?: (string | string[])[]): void => {
    if (!names || names.length === 0) {
      resetFields()
      return
    }

    for (const name of names) {
      const key = getFieldKey(name)
      const registration = fieldStore.get(key)
      if (registration) {
        if (registration.initialValue !== undefined) {
          registration.setValue(registration.initialValue)
        } else {
          registration.setValue(undefined)
        }
      }
    }
  }

  return {
    registerField,
    unregisterField,
    getFieldsValue,
    getFieldValue,
    setFieldValue,
    setFieldsValue,
    resetFields,
    resetFieldsToInitial,
    fieldStore,
  }
}

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
