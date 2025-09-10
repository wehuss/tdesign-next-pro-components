import { Select } from 'tdesign-vue-next'
import { computed, defineComponent, useModel } from 'vue'
import type {
  ProFieldMode,
  ProFieldValueEnumMap,
  ProFieldValueEnumObj,
} from '../../types'

/**
 * Select 组件 - 选择字段
 * 支持 valueEnum 配置选项
 */
export const FieldSelect = defineComponent({
  name: 'ProFieldSelect',
  props: {
    modelValue: {
      type: [String, Number, Boolean, Array, null, undefined] as any,
      default: undefined,
    },
    mode: {
      type: String as () => ProFieldMode,
      default: 'read' as ProFieldMode,
    },
    valueEnum: {
      type: [Object, Map],
      default: () => ({}),
    },
    fieldProps: {
      type: Object as any,
      default: () => ({}),
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: [String, Array] as any,
      default: '请选择',
    },
  },
  emits: ['update:modelValue', 'change'],
  setup(props) {
    const modelValue = useModel(props, 'modelValue')

    // 转换 valueEnum 为选项列表
    const options = computed(() => {
      const valueEnum = props.valueEnum as
        | ProFieldValueEnumObj
        | ProFieldValueEnumMap

      if (
        !valueEnum ||
        (typeof valueEnum === 'object' && Object.keys(valueEnum).length === 0)
      ) {
        return []
      }

      if (valueEnum instanceof Map) {
        return Array.from(valueEnum.entries()).map(([value, config]) => ({
          value,
          label: typeof config === 'string' ? config : config.text,
          disabled: typeof config === 'object' ? config.disabled : false,
        }))
      }

      return Object.entries(valueEnum).map(([value, config]) => ({
        value,
        label: config.text,
        disabled: config.disabled,
      }))
    })

    // 获取显示文本
    const getDisplayText = (value: any) => {
      if (value === null || value === undefined) return '-'

      const valueEnum = props.valueEnum as
        | ProFieldValueEnumObj
        | ProFieldValueEnumMap

      if (!valueEnum) return String(value)

      if (valueEnum instanceof Map) {
        const config = valueEnum.get(value)
        return typeof config === 'string' ? config : config?.text || value
      }

      const config = (valueEnum as ProFieldValueEnumObj)[String(value)]
      return config?.text || value
    }

    return () => {
      // 只读模式显示选项文本
      if (props.mode === 'read' || props.readonly) {
        return <span>{getDisplayText(modelValue.value)}</span>
      }

      // 编辑模式显示下拉选择框
      return (
        <Select
          v-model={modelValue.value}
          options={options.value}
          placeholder={
            Array.isArray(props.placeholder)
              ? props.placeholder[0]
              : props.placeholder
          }
          disabled={props.disabled}
          {...props.fieldProps}
        />
      )
    }
  },
})

export default FieldSelect
