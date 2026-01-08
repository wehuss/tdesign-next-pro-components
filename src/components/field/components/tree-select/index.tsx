import { objectToMap, proFieldParsingText } from '@/utils'
import type { TreeOptionData, TreeSelectValue } from 'tdesign-vue-next'
import { TreeSelect } from 'tdesign-vue-next'
import { computed, defineComponent, ref, useModel } from 'vue'
import type { ProFieldMode, ProFieldValueEnumType } from '../../types'

/**
 * TreeSelect 组件 - 树选择字段
 * 支持 read/edit 模式
 */
export const FieldTreeSelect = defineComponent({
  name: 'ProFieldTreeSelect',
  props: {
    modelValue: {
      type: [String, Number, Array] as any,
      default: undefined,
    },
    mode: {
      type: String as () => ProFieldMode,
      default: 'read' as ProFieldMode,
    },
    data: {
      type: Array as () => TreeOptionData[],
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
    multiple: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:modelValue', 'change'],
  setup(props, { expose }) {
    const modelValue = useModel(props, 'modelValue')
    const dataEntryRef = ref<InstanceType<typeof TreeSelect>>()
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

      const traverseOptions = (options: TreeOptionData[]) => {
        if (!options?.length) return valuesMap

        for (const option of options) {
          valuesMap.set(option[valuePropsName] as string | number, option[labelPropsName] as string)
          if (option[childrenPropsName]) {
            traverseOptions(option[childrenPropsName] as TreeOptionData[])
          }
        }
        return valuesMap
      }

      return traverseOptions(props.data || [])
    })

    return () => {
      // 只读模式显示选项文本
      if (props.mode === 'read' || props.readonly) {
        const valueEnum = objectToMap(
          (props.valueEnum as ProFieldValueEnumType) || optionsValueEnum.value,
        )

        const value = modelValue.value as TreeSelectValue
        if (Array.isArray(value)) {
          const labels = value.map((v) => {
            const item = valueEnum.get(v) || valueEnum.get(String(v))
            return typeof item === 'string' ? item : (item as any)?.text || v
          })
          return <span>{labels.join(', ')}</span>
        }

        return proFieldParsingText(value as string | number, valueEnum)
      }

      // 编辑模式显示树选择器
      return (
        <TreeSelect
          ref={dataEntryRef}
          v-model={modelValue.value}
          data={props.data}
          placeholder={Array.isArray(props.placeholder) ? props.placeholder[0] : props.placeholder}
          disabled={props.disabled}
          multiple={props.multiple}
          {...props.fieldProps}
        />
      )
    }
  },
})

export default FieldTreeSelect
