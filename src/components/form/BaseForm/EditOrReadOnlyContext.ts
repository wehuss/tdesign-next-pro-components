import { inject, provide, type InjectionKey } from 'vue'

export interface EditOrReadOnlyContextValue {
  mode?: 'edit' | 'read'
}

export const EditOrReadOnlyContextKey: InjectionKey<EditOrReadOnlyContextValue> = Symbol('EditOrReadOnlyContext')

export const useEditOrReadOnlyContext = () => {
  return inject(EditOrReadOnlyContextKey, { mode: 'edit' } as EditOrReadOnlyContextValue)
}

export const provideEditOrReadOnlyContext = (value: EditOrReadOnlyContextValue) => {
  provide(EditOrReadOnlyContextKey, value)
}

export const EditOrReadOnlyContext = {
  provide: provideEditOrReadOnlyContext,
  inject: useEditOrReadOnlyContext,
}