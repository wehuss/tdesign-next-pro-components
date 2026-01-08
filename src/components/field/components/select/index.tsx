import { objectToMap, proFieldParsingText } from '@/utils'
import { Select } from 'tdesign-vue-next'
import { computed, defineComponent, ref, useModel } from 'vue'
import type { ProFieldMode, ProFieldValueEnumType } from '../../types'

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
  setup(props, { expose }) {
    const modelValue = useModel(props, 'modelValue')
    const dataEntryRef = ref<InstanceType<typeof Select>>()
    const getDataEntryRef = () => dataEntryRef.value

    expose({
      getDataEntryRef,
      dataEntryRef,
    })

    // 转换 valueEnum 为选项列表
    const options = computed(() => {
      const valueEnum = objectToMap(props.valueEnum as ProFieldValueEnumType)

      if (!valueEnum || valueEnum.size === 0) {
        return []
      }

      return Array.from(valueEnum.entries()).map((entry) => {
        const [value, config] = entry as any[]
        return {
          value,
          label: typeof config === 'string' ? config : (config as any)?.text || value,
          disabled: typeof config === 'object' ? (config as any)?.disabled : false,
        }
      })
    })

    return () => {
      // 只读模式显示选项文本
      if (props.mode === 'read' || props.readonly) {
        return proFieldParsingText(modelValue.value, props.valueEnum as ProFieldValueEnumType)
      }

      // 编辑模式显示下拉选择框
      return (
        <Select
          ref={dataEntryRef}
          v-model={modelValue.value}
          options={options.value}
          placeholder={Array.isArray(props.placeholder) ? props.placeholder[0] : props.placeholder}
          disabled={props.disabled}
          {...props.fieldProps}
        />
      )
    }
  },
})

export default FieldSelect
