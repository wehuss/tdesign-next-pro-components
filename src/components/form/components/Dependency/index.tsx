import { computed, defineComponent, type PropType, type VNode } from 'vue'
import type { ProFormInstance } from '../../BaseForm'
import { useFieldContext } from '../../FieldContext'
import { useFormListContext } from '../List'

export interface ProFormDependencyProps {
  /** 依赖的字段名列表 */
  name: (string | string[])[]
  /** 原始依赖名（用于嵌套场景） */
  originDependencies?: (string | string[])[]
  /** 是否忽略 FormList 字段 */
  ignoreFormListField?: boolean
  /** 子元素渲染函数 */
  children: (
    values: Record<string, any>,
    form: ProFormInstance
  ) => VNode | VNode[]
}

/**
 * 从对象中获取嵌套值
 */
function get(obj: any, path: (string | number)[]): any {
  if (!obj || !path || path.length === 0) return undefined

  let current = obj
  for (const key of path) {
    if (current === null || current === undefined) return undefined
    current = current[key]
  }
  return current
}

/**
 * 设置对象的嵌套值
 */
function set(obj: any, path: (string | number)[], value: any): any {
  if (!path || path.length === 0) return obj

  const result = { ...obj }
  let current = result

  for (let i = 0; i < path.length - 1; i++) {
    const key = path[i]
    if (current[key] === undefined || current[key] === null) {
      current[key] = typeof path[i + 1] === 'number' ? [] : {}
    } else {
      current[key] = Array.isArray(current[key])
        ? [...current[key]]
        : { ...current[key] }
    }
    current = current[key]
  }

  current[path[path.length - 1]] = value
  return result
}

export const ProFormDependency = defineComponent({
  name: 'ProFormDependency',
  props: {
    name: {
      type: Array as PropType<(string | string[])[]>,
      required: true,
    },
    originDependencies: {
      type: Array as PropType<(string | string[])[]>,
      default: undefined,
    },
    ignoreFormListField: {
      type: Boolean,
      default: false,
    },
    children: {
      type: Function as PropType<ProFormDependencyProps['children']>,
      required: true,
    },
  },
  setup(props, { slots }) {
    const fieldContext = useFieldContext()
    const formListField = useFormListContext()

    // 计算原始依赖名
    const originDeps = computed(() => {
      return props.originDependencies || props.name
    })

    // 将字段名展平为路径数组
    const flattenNames = computed(() => {
      return props.name.map(itemName => {
        const name: (string | number)[] = Array.isArray(itemName)
          ? [...itemName]
          : [itemName]

        // 如果不忽略 FormList 字段，且在 FormList 中，需要添加前缀
        if (
          !props.ignoreFormListField &&
          formListField.name !== undefined &&
          formListField.listName?.length
        ) {
          return [...formListField.listName, ...name]
        }

        return name
      })
    })

    // 获取依赖值
    const dependencyValues = computed(() => {
      if (!fieldContext.formRef?.value) {
        return {}
      }

      let values: Record<string, any> = {}
      const form = fieldContext.formRef.value

      for (let i = 0; i < props.name.length; i++) {
        const itemName = flattenNames.value[i]
        const originName = originDeps.value[i]

        // 尝试获取格式化后的值
        let value: any
        if (typeof form.getFieldFormatValueObject === 'function') {
          value = form.getFieldFormatValueObject(itemName)
          if (value && Object.keys(value).length) {
            values = { ...values, ...value }
            const itemValue = get(value, itemName)
            if (itemValue !== undefined) {
              const originPath = Array.isArray(originName)
                ? originName
                : [originName]
              values = set(values, originPath, itemValue)
            }
            continue
          }
        }

        // 直接从表单获取值 - 使用 getFieldsValue 获取所有值然后取特定字段
        // TDesign Form 的 getFieldsValue 返回所有字段值
        const allValues = (form as any).getFieldsValue?.() || {}
        const fieldPath = Array.isArray(itemName)
          ? itemName.join('.')
          : itemName
        value = get(allValues, fieldPath.toString().split('.'))

        if (value !== undefined) {
          const originPath = Array.isArray(originName)
            ? originName
            : [originName]
          values = set(values, originPath, value)
        }
      }

      return values
    })

    return () => {
      const form = fieldContext.formRef?.value

      // 如果没有表单实例，返回空
      if (!form) {
        return null
      }

      // 调用 children 渲染函数
      if (props.children) {
        return props.children(dependencyValues.value, form as ProFormInstance)
      }

      // 支持 slot 方式
      if (slots.default) {
        return slots.default({
          values: dependencyValues.value,
          form: form as ProFormInstance,
        })
      }

      return null
    }
  },
})

// 设置 displayName
ProFormDependency.displayName = 'ProFormDependency'

export default ProFormDependency
