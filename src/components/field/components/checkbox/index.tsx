import { Checkbox, CheckboxGroup } from 'tdesign-vue-next'
import { computed, defineComponent, useModel } from 'vue'
import type {
  ProFieldMode,
  ProFieldValueEnumMap,
  ProFieldValueEnumObj,
} from '../../types'

/**
 * Checkbox 组件 - 复选框字段
 * 支持单个复选框和复选框组
 */
export const FieldCheckbox = defineComponent({
  name: 'ProFieldCheckbox',
  props: {
    modelValue: {
      type: [String, Number, Boolean, Array] as any,
      default: null,
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
  },
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

      // 如果是数组，处理多选情况
      if (Array.isArray(value)) {
        if (!valueEnum) return value.join(', ')

        const texts = value.map(v => {
          if (valueEnum instanceof Map) {
            const config = valueEnum.get(v)
            return typeof config === 'string' ? config : config?.text || v
          }
          const config = (valueEnum as ProFieldValueEnumObj)[v]
          return config?.text || v
        })
        return texts.join(', ')
      }

      // 单选情况
      if (typeof value === 'boolean') {
        return value ? '是' : '否'
      }

      if (!valueEnum) return String(value)

      if (valueEnum instanceof Map) {
        const config = valueEnum.get(value)
        return typeof config === 'string' ? config : config?.text || value
      }

      const config = (valueEnum as ProFieldValueEnumObj)[String(value)]
      return config?.text || value
    }

    return () => {
      // 只读模式显示文本
      if (props.mode === 'read' || props.readonly) {
        return <span>{getDisplayText(modelValue.value)}</span>
      }

      // 编辑模式
      const hasOptions = options.value.length > 0

      if (hasOptions) {
        // 有选项的情况，显示复选框组
        return (
          <CheckboxGroup
            v-model={modelValue.value}
            options={options.value}
            disabled={props.disabled}
            {...props.fieldProps}
          />
        )
      } else {
        // 没有选项的情况，显示单个复选框
        return (
          <Checkbox
            v-model={modelValue.value}
            disabled={props.disabled}
            {...props.fieldProps}
          >
            {props.fieldProps?.label || ''}
          </Checkbox>
        )
      }
    }
  },
})

export default FieldCheckbox
