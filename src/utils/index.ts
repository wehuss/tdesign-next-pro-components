/**
 * 通用工具函数
 */

import { ref, watch, type Ref } from 'vue'

// 检查是否为空值
export const isEmpty = (value: unknown): boolean => {
  if (value === null || value === undefined) return true
  if (typeof value === 'string' || Array.isArray(value)) return value.length === 0
  if (typeof value === 'object') return Object.keys(value).length === 0
  return false
}

// 检查是否为null或undefined
export const isNil = (value: unknown): value is null | undefined => {
  return value === null || value === undefined
}

// 深度克隆
export const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== 'object') return obj
  if (obj instanceof Date) return new Date(obj.getTime()) as T
  if (obj instanceof Array) return obj.map((item) => deepClone(item)) as T
  if (typeof obj === 'object') {
    const clonedObj = {} as T
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key])
      }
    }
    return clonedObj
  }
  return obj
}

// 防抖函数
export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number,
): ((...args: Parameters<T>) => void) => {
  let timeout: number | null = null
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait) as unknown as number
  }
}

// 节流函数
export const throttle = <T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number,
): ((...args: Parameters<T>) => void) => {
  let lastTime = 0
  return (...args: Parameters<T>) => {
    const now = Date.now()
    if (now - lastTime >= wait) {
      lastTime = now
      func(...args)
    }
  }
}

// 防抖 ref
export const useDebouncedRef = <T>(source: Ref<T>, delay: number): Ref<T> => {
  const debouncedRef = ref(source.value) as Ref<T>

  let timer: number | null = null
  watch(
    source,
    (newValue) => {
      if (timer) {
        clearTimeout(timer)
      }
      timer = setTimeout(() => {
        debouncedRef.value = newValue
      }, delay) as unknown as number
    },
    { immediate: true },
  )

  return debouncedRef
}

// 获取最新值的 ref
export const useLatest = <T>(value: T): Ref<T> => {
  const latestRef = ref(value) as Ref<T>

  watch(
    () => value,
    (newValue) => {
      latestRef.value = newValue
    },
    { immediate: true, deep: true },
  )

  return latestRef
}

// 导出 proFieldParsingText 相关函数
export { objectToMap, proFieldParsingText, ProFieldTagColor } from './proFieldParsingText'
