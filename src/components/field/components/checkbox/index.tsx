import { objectToMap, proFieldParsingText } from '@/utils'
import { Checkbox, CheckboxGroup } from 'tdesign-vue-next'
import { computed, defineComponent, useModel } from 'vue'
import type { ProFieldMode, ProFieldValueEnumType } from '../../types'

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
      const valueEnum = objectToMap(props.valueEnum as ProFieldValueEnumType)

      if (!valueEnum || valueEnum.size === 0) {
        return []
      }

      return Array.from(valueEnum.entries()).map(([value, config]) => ({
        value,
        label:
          typeof config === 'string' ? config : (config as any)?.text || value,
        disabled:
          typeof config === 'object' ? (config as any)?.disabled : false,
      }))
    })

    return () => {
      // 只读模式显示文本
      if (props.mode === 'read' || props.readonly) {
        // 如果是数组，使用 proFieldParsingText 处理多选
        if (Array.isArray(modelValue.value)) {
          return proFieldParsingText(
            modelValue.value,
            props.valueEnum as ProFieldValueEnumType
          )
        }

        // 单选或布尔值情况
        if (typeof modelValue.value === 'boolean') {
          return <span>{modelValue.value ? '是' : '否'}</span>
        }

        return proFieldParsingText(
          modelValue.value,
          props.valueEnum as ProFieldValueEnumType
        )
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
