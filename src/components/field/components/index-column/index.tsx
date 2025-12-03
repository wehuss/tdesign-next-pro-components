import type { CSSProperties } from 'vue'
import { computed, defineComponent } from 'vue'

/**
 * IndexColumn 组件 - 序号列字段
 * 用于表格中显示行序号
 */
export const FieldIndexColumn = defineComponent({
  name: 'ProFieldIndexColumn',
  props: {
    modelValue: {
      type: Number,
      default: 0,
    },
    border: {
      type: Boolean,
      default: false,
    },
    fieldProps: {
      type: Object as any,
      default: () => ({}),
    },
  },
  setup(props) {
    // 基础样式
    const baseStyle: CSSProperties = {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '18px',
      height: '18px',
    }

    // 带边框样式
    const borderStyle = computed<CSSProperties>(() => {
      if (!props.border) return {}

      const isTopThree = props.modelValue <= 3
      return {
        color: '#fff',
        fontSize: '12px',
        lineHeight: '12px',
        backgroundColor: isTopThree ? '#314659' : '#979797',
        borderRadius: '9px',
      }
    })

    // 合并样式
    const mergedStyle = computed<CSSProperties>(() => ({
      ...baseStyle,
      ...borderStyle.value,
      ...(props.fieldProps?.style || {}),
    }))

    return () => {
      return <div style={mergedStyle.value}>{props.modelValue}</div>
    }
  },
})

export default FieldIndexColumn
