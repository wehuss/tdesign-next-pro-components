import { objectToMap, proFieldParsingText } from '@/utils'
import { RadioGroup } from 'tdesign-vue-next'
import { computed, defineComponent, ref, useModel } from 'vue'
import type { ProFieldMode, ProFieldValueEnumType } from '../../types'

/**
 * Segmented 组件 - 分段控制器字段
 * 使用 RadioGroup 的 button 样式实现分段控制器效果
 */
export const FieldSegmented = defineComponent({
  name: 'ProFieldSegmented',
  props: {
    modelValue: {
      type: [String, Number],
      default: undefined,
    },
    mode: {
      type: String as () => ProFieldMode,
      default: 'read' as ProFieldMode,
    },
    options: {
      type: Array as () => Array<{
        label: string
        value: string | number
        disabled?: boolean
      }>,
      default: () => [],
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

    // 从 valueEnum 或 options 生成选项列表
    const computedOptions = computed(() => {
      // 优先使用 options
      if (props.options && props.options.length > 0) {
        return props.options
      }

      // 从 valueEnum 生成
      const valueEnum = objectToMap(props.valueEnum as ProFieldValueEnumType)
      if (!valueEnum || valueEnum.size === 0) {
        return []
      }

      return Array.from(valueEnum.entries()).map(([value, config]) => ({
        value,
        label: typeof config === 'string' ? config : (config as any)?.text || String(value),
        disabled: typeof config === 'object' ? (config as any)?.disabled : false,
      }))
    })

    // 从选项生成 valueEnum 用于只读模式
    const optionsValueEnum = computed(() => {
      if (props.valueEnum && Object.keys(props.valueEnum).length > 0) {
        return props.valueEnum
      }

      const enumObj: Record<string | number, string> = {}
      for (const option of computedOptions.value) {
        enumObj[option.value] = option.label
      }
      return enumObj
    })

    return () => {
      // 只读模式显示选中的文本
      if (props.mode === 'read' || props.readonly) {
        return proFieldParsingText(
          modelValue.value as string | number,
          optionsValueEnum.value as ProFieldValueEnumType,
        )
      }

      // 编辑模式显示分段控制器（使用 RadioGroup button 样式）
      return (
        <RadioGroup
          ref={dataEntryRef}
          v-model={modelValue.value}
          variant="default-filled"
          disabled={props.disabled}
          options={computedOptions.value}
          {...props.fieldProps}
        />
      )
    }
  },
})

export default FieldSegmented
