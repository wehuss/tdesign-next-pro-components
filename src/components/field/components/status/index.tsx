import { proFieldParsingText } from '@/utils'
import { defineComponent } from 'vue'
import type { ProFieldMode, ProFieldValueEnumType } from '../../types'

/**
 * Status 组件 - 状态标签字段
 * 根据 valueEnum 配置显示不同的状态标签
 */
export const FieldStatus = defineComponent({
  name: 'ProFieldStatus',
  props: {
    modelValue: {
      type: [String, Number, Boolean, null, undefined] as any,
      default: undefined,
    },
    mode: {
      type: String as () => ProFieldMode,
      default: 'read' as ProFieldMode,
    },
    valueEnum: {
      type: [Object, Map] as any,
      default: () => ({}),
    },
    fieldProps: {
      type: Object as any,
      default: () => ({}),
    },
  },
  setup(props) {
    return () => {
      // 使用 proFieldParsingText 来处理 valueEnum 并显示状态
      return proFieldParsingText(
        props.modelValue,
        props.valueEnum as ProFieldValueEnumType
      )
    }
  },
})

export default FieldStatus
