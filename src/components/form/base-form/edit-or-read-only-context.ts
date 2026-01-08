import { inject, provide, reactive, type ComputedRef, type InjectionKey, type Ref } from 'vue'

/**
 * 编辑/只读模式类型
 * - edit: 编辑模式，表单项可编辑
 * - read: 只读模式，表单项只展示
 * - update: 更新模式，用于编辑已有数据
 */
export type EditOrReadOnlyMode = 'edit' | 'read' | 'update'

/**
 * EditOrReadOnlyContext 的值类型
 */
export interface EditOrReadOnlyContextValue {
  /** 当前模式 */
  mode: EditOrReadOnlyMode
}

/**
 * 响应式的 EditOrReadOnlyContext 值类型
 */
export interface ReactiveEditOrReadOnlyContextValue {
  /** 当前模式（响应式） */
  mode: ComputedRef<EditOrReadOnlyMode> | Ref<EditOrReadOnlyMode> | EditOrReadOnlyMode
}

/** 默认上下文值 */
const defaultContextValue: EditOrReadOnlyContextValue = {
  mode: 'edit',
}

/** 注入键 */
export const EditOrReadOnlyContextKey: InjectionKey<
  EditOrReadOnlyContextValue | ReactiveEditOrReadOnlyContextValue
> = Symbol('EditOrReadOnlyContext')

/**
 * 使用 EditOrReadOnlyContext
 * @returns 当前的编辑/只读模式上下文
 */
export const useEditOrReadOnlyContext = (): EditOrReadOnlyContextValue => {
  const context = inject(EditOrReadOnlyContextKey, defaultContextValue)

  // 处理响应式值
  if (context && typeof context.mode === 'object' && 'value' in context.mode) {
    return reactive({
      get mode() {
        return (context.mode as ComputedRef<EditOrReadOnlyMode> | Ref<EditOrReadOnlyMode>).value
      },
    }) as EditOrReadOnlyContextValue
  }

  return context as EditOrReadOnlyContextValue
}

/**
 * 提供 EditOrReadOnlyContext
 * @param value 上下文值，支持响应式
 */
export const provideEditOrReadOnlyContext = (
  value: EditOrReadOnlyContextValue | ReactiveEditOrReadOnlyContextValue,
) => {
  provide(EditOrReadOnlyContextKey, value)
}

/**
 * 创建响应式的 EditOrReadOnlyContext 值
 * @param modeRef 模式的响应式引用
 * @returns 响应式上下文值
 */
export const createEditOrReadOnlyContext = (
  modeRef: ComputedRef<EditOrReadOnlyMode> | Ref<EditOrReadOnlyMode>,
): ReactiveEditOrReadOnlyContextValue => {
  return {
    mode: modeRef,
  }
}

/**
 * EditOrReadOnlyContext 对象
 * 提供 provide 和 inject 方法的便捷访问
 */
export const EditOrReadOnlyContext = {
  /** 提供上下文 */
  provide: provideEditOrReadOnlyContext,
  /** 注入上下文 */
  inject: useEditOrReadOnlyContext,
  /** 创建响应式上下文 */
  create: createEditOrReadOnlyContext,
  /** 注入键 */
  key: EditOrReadOnlyContextKey,
}
