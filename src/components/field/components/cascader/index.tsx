import { objectToMap, proFieldParsingText } from '@/utils'
import type { TreeOptionData } from 'tdesign-vue-next'
import { Cascader } from 'tdesign-vue-next'
import { computed, defineComponent, ref, useModel } from 'vue'
import type { ProFieldMode, ProFieldValueEnumType } from '../../types'

// Cascader option type
type CascaderOption = TreeOptionData

// Cascader value type
type CascaderValueType = (string | number)[] | string | number

/**
 * Cascader 组件 - 级联选择字段
 * 支持 read/edit 模式
 */
export const FieldCascader = defineComponent({
  name: 'ProFieldCascader',
  props: {
    modelValue: {
      type: [String, Number, Array] as any,
      default: undefined,
    },
    mode: {
      type: String as () => ProFieldMode,
      default: 'read' as ProFieldMode,
    },
    options: {
      type: Array as () => CascaderOption[],
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
    placeholder: {
      type: [String, Array] as any,
      default: '请选择',
    },
  },
  emits: ['update:modelValue', 'change'],
  setup(props, { expose }) {
    const modelValue = useModel(props, 'modelValue')
    const dataEntryRef = ref<InstanceType<typeof Cascader>>()
    const getDataEntryRef = () => dataEntryRef.value

    expose({
      getDataEntryRef,
      dataEntryRef,
    })

    // 构建 valueEnum 用于只读模式显示
    const optionsValueEnum = computed(() => {
      if (props.mode !== 'read') return new Map()

      const {
        value: valuePropsName = 'value',
        label: labelPropsName = 'label',
        children: childrenPropsName = 'children',
      } = (props.fieldProps?.keys as any) || {}

      const valuesMap = new Map<string | number, string>()

      const traverseOptions = (options: CascaderOption[]) => {
        if (!options?.length) return valuesMap

        for (const option of options) {
          valuesMap.set(
            option[valuePropsName] as string | number,
            option[labelPropsName] as string
          )
          if (option[childrenPropsName]) {
            traverseOptions(option[childrenPropsName] as CascaderOption[])
          }
        }
        return valuesMap
      }

      return traverseOptions(props.options || [])
    })

    // 获取显示文本
    const getDisplayText = (value: CascaderValueType) => {
      if (!value) return ''

      const valueEnum = objectToMap(
        (props.valueEnum as ProFieldValueEnumType) || optionsValueEnum.value
      )

      if (Array.isArray(value)) {
        // 级联选择的值通常是数组，取最后一个值显示
        const labels = value.map(v => {
          const item =
            valueEnum.get(v as string | number) || valueEnum.get(String(v))
          return typeof item === 'string' ? item : (item as any)?.text || v
        })
        return labels.join(' / ')
      }

      return proFieldParsingText(value as string | number, valueEnum)
    }

    return () => {
      // 只读模式显示选项文本
      if (props.mode === 'read' || props.readonly) {
        const displayText = getDisplayText(
          modelValue.value as CascaderValueType
        )
        return <span>{displayText}</span>
      }

      // 编辑模式显示级联选择器
      return (
        <Cascader
          ref={dataEntryRef}
          v-model={modelValue.value}
          options={props.options}
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

export default FieldCascader
