import { objectToMap } from '@/utils'
import { CheckboxGroup } from 'tdesign-vue-next'
import { computed } from 'vue'
import { createField } from '../../utils/createField'

/**
 * 选项类型
 */
interface CheckboxOption {
  label: string
  value: any
  disabled?: boolean
}

/**
 * ProFormCheckbox 组件
 * 复选框组表单字段，支持多选值 v-model 双向绑定
 * 支持 options 和 valueEnum
 */
export const ProFormCheckbox = createField({
  name: 'ProFormCheckbox',
  valueType: 'checkbox',
  renderFormItem: (props: any) => {
    const {
      options: fieldOptions,
      max,
      ...restFieldProps
    } = props.fieldProps || {}

    // 将 valueEnum 转换为 options
    const valueEnumOptions = computed<CheckboxOption[]>(() => {
      if (!props.valueEnum) return []

      const valueEnumMap = objectToMap(props.valueEnum)
      if (!valueEnumMap || valueEnumMap.size === 0) return []

      return Array.from(valueEnumMap.entries()).map(([value, config]) => {
        return {
          value,
          label:
            typeof config === 'string'
              ? config
              : (config as any)?.text || String(value),
          disabled:
            typeof config === 'object' ? (config as any)?.disabled : false,
        }
      })
    })

    // 合并 options：优先使用 props.options，其次使用 fieldProps.options，最后使用 valueEnum
    const mergedOptions = computed<CheckboxOption[]>(() => {
      if (props.options && props.options.length > 0) {
        return props.options
      }
      if (fieldOptions && fieldOptions.length > 0) {
        return fieldOptions
      }
      return valueEnumOptions.value
    })

    // 确保值是数组类型
    const ensureArrayValue = computed(() => {
      const value = props.modelValue.value
      if (value === undefined || value === null) {
        return []
      }
      return Array.isArray(value) ? value : [value]
    })

    return (
      <CheckboxGroup
        v-model={props.modelValue.value}
        value={ensureArrayValue.value}
        options={mergedOptions.value}
        disabled={props.disabled}
        max={max}
        {...restFieldProps}
      />
    )
  },
})

export default ProFormCheckbox
