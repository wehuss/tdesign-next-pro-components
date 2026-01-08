import { RadioGroup } from 'tdesign-vue-next'
import { computed, defineComponent, ref, useModel } from 'vue'
import type { ProFieldMode, ProFieldValueEnumMap, ProFieldValueEnumObj } from '../../types'

/**
 * Radio 组件 - 单选框字段
 * 支持单选框组
 */
export const FieldRadio = defineComponent({
  name: 'ProFieldRadio',
  props: {
    modelValue: {
      type: [String, Number, Boolean, null, undefined] as any,
      default: null,
    },
    mode: {
      type: String as () => ProFieldMode,
      default: 'read' as ProFieldMode,
    },
    radioType: {
      type: String as () => 'radio' | 'button',
      default: 'radio',
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
  emits: ['update:modelValue', 'change'],
  setup(props, { expose }) {
    const modelValue = useModel(props, 'modelValue')
    const dataEntryRef = ref<InstanceType<typeof RadioGroup>>()
    const getDataEntryRef = () => dataEntryRef.value

    expose({
      getDataEntryRef,
      dataEntryRef,
    })

    // 转换 valueEnum 为选项列表
    const options = computed(() => {
      const valueEnum = props.valueEnum as ProFieldValueEnumObj | ProFieldValueEnumMap

      if (!valueEnum || (typeof valueEnum === 'object' && Object.keys(valueEnum).length === 0)) {
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

      const valueEnum = props.valueEnum as ProFieldValueEnumObj | ProFieldValueEnumMap

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

      // 编辑模式显示单选框组
      return (
        <RadioGroup
          ref={dataEntryRef}
          v-model={modelValue.value}
          options={options.value}
          variant={props.radioType === 'button' ? 'default-filled' : 'outline'}
          disabled={props.disabled}
          {...props.fieldProps}
        />
      )
    }
  },
})

export default FieldRadio
