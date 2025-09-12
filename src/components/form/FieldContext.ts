import type { FormItemProps } from 'tdesign-vue-next'
import { inject, provide, type InjectionKey, type Ref } from 'vue'
import type { ProFieldProps } from '../field/types'
import type { ProFormInstance } from './BaseForm'
import type { ProFormGroupProps } from './typing'

export interface FieldContextValue {
  formRef?: Ref<ProFormInstance | undefined>
  fieldProps?: any
  proFieldProps?: ProFieldProps
  formItemProps?: FormItemProps
  groupProps?: ProFormGroupProps
  formComponentType?: 'DrawerForm' | 'ModalForm' | 'QueryFilter'
  getPopupContainer?: (node: HTMLElement) => HTMLElement
  formKey?: string
  setFieldValueType?: (
    name: any,
    config: {
      valueType?: string
      dateFormat?: string
      transform?: any
    }
  ) => void
}

export const FieldContextKey: InjectionKey<FieldContextValue> = Symbol('FieldContext')

export const useFieldContext = () => {
  return inject(FieldContextKey, {} as FieldContextValue)
}

export const provideFieldContext = (value: FieldContextValue) => {
  provide(FieldContextKey, value)
}

// 兼容性导出
export const FieldContext = {
  provide: provideFieldContext,
  inject: useFieldContext,
}

export default FieldContext