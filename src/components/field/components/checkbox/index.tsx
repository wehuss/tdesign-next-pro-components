import { objectToMap, proFieldParsingText } from '@/utils'
import { Checkbox, CheckboxGroup, type CheckboxGroupProps, type CheckboxProps } from 'tdesign-vue-next'
import { computed, defineComponent, ref, useModel, type PropType } from 'vue'
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
      type: Object as PropType<CheckboxGroupProps|CheckboxProps>,
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
  setup(props, { expose }) {
    const modelValue = useModel(props, 'modelValue')
    const dataEntryRef = ref<InstanceType<typeof CheckboxGroup | typeof Checkbox>>()
    const getDataEntryRef = () => dataEntryRef.value

    expose({
      getDataEntryRef,
      dataEntryRef
    })

    // 转换 valueEnum 为选项列表
    const options = computed(() => {
      const valueEnum = objectToMap(props.valueEnum as ProFieldValueEnumType)
      console.log('props.fieldProps ',props.fieldProps )
      if (!valueEnum || valueEnum.size === 0) {
        if((props.fieldProps as CheckboxGroupProps)?.options) {
          return (props.fieldProps as CheckboxGroupProps)!.options
        }
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
      const hasOptions = options.value!.length > 0
      console.log('options.value',options.value)
      if (hasOptions) {
        // 有选项的情况，显示复选框组
        return (
          <CheckboxGroup
            ref={dataEntryRef}
            v-model={modelValue.value}
            options={options.value}
            disabled={props.disabled}
            {...props.fieldProps as CheckboxGroupProps}
          />
        )
      } else {
        // 没有选项的情况，显示单个复选框
        return (
          <Checkbox
            ref={dataEntryRef}
            v-model={modelValue.value}
            disabled={props.disabled}
            {...props.fieldProps as CheckboxProps}
          >
            {props.fieldProps?.label || ''}
          </Checkbox>
        )
      }
    }
  },
})

export default FieldCheckbox
