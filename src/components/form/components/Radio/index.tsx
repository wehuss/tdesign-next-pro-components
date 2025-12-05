import { objectToMap } from '@/utils'
import { RadioGroup } from 'tdesign-vue-next'
import { computed } from 'vue'
import { createField } from '../../utils/createField'

/**
 * 选项类型
 */
interface RadioOption {
  label: string
  value: any
  disabled?: boolean
}

/**
 * ProFormRadio 组件
 * 单选框组表单字段，支持 options 和 valueEnum
 * 确保选中值正确更新
 */
export const ProFormRadio = createField({
  name: 'ProFormRadio',
  valueType: 'radio',
  renderFormItem: (props: any) => {
    const {
      radioType,
      options: fieldOptions,
      ...restFieldProps
    } = props.fieldProps || {}

    // 将 valueEnum 转换为 options
    const valueEnumOptions = computed<RadioOption[]>(() => {
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
    const mergedOptions = computed<RadioOption[]>(() => {
      if (props.options && props.options.length > 0) {
        return props.options
      }
      if (fieldOptions && fieldOptions.length > 0) {
        return fieldOptions
      }
      return valueEnumOptions.value
    })

    // 根据 radioType 确定 variant
    const variant = radioType === 'button' ? 'default-filled' : 'outline'

    return (
      <RadioGroup
        v-model={props.modelValue.value}
        options={mergedOptions.value}
        disabled={props.disabled}
        variant={variant}
        {...restFieldProps}
      />
    )
  },
})

export default ProFormRadio
