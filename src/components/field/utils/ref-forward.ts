import type { Ref } from 'vue'

/**
 * 创建 ref 转发工具函数
 * 类似 React.forwardRef 的效果，将内部组件的引用暴露给外部
 */
export interface RefForwardOptions {
  /** 内部组件的 ref */
  innerRef: Ref<any>
  /** 要暴露的方法名列表 */
  exposeMethods?: string[]
  /** 自定义暴露的方法 */
  customMethods?: Record<string, (...args: any[]) => any>
}

/**
 * 创建 ref 转发配置
 * @param options 配置选项
 * @returns 要传递给 expose 的对象
 */
export function createRefForward(options: RefForwardOptions) {
  const { innerRef, exposeMethods = [], customMethods = {} } = options

  const exposeObject: Record<string, any> = {
    // 直接暴露内部组件实例
    getInnerInstance: () => innerRef.value,
    // 兼容性：暴露 innerRef
    innerRef: innerRef,
    ...customMethods,
  }

  // 自动暴露指定的方法
  exposeMethods.forEach((methodName) => {
    exposeObject[methodName] = (...args: any[]) => {
      return innerRef.value?.[methodName]?.(...args)
    }
  })

  return exposeObject
}

/**
 * 常用输入组件的方法列表
 */
export const CommonInputMethods = ['focus', 'blur', 'select'] as const
export const CommonSelectMethods = ['focus', 'blur'] as const
export const CommonDatePickerMethods = ['focus', 'blur'] as const
