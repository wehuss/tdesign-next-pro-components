import { Slider } from 'tdesign-vue-next'
import { defineComponent, useModel } from 'vue'
import type { ProFieldMode } from '../../types'

/**
 * Slider 组件 - 滑块字段
 * 只读模式显示数值，编辑模式显示滑块
 */
export const FieldSlider = defineComponent({
  name: 'ProFieldSlider',
  props: {
    modelValue: {
      type: [String, Number, Array, null, undefined] as any,
      default: null,
    },
    mode: {
      type: String as () => ProFieldMode,
      default: 'read' as ProFieldMode,
    },
    min: {
      type: Number,
      default: 0,
    },
    max: {
      type: Number,
      default: 100,
    },
    step: {
      type: Number,
      default: 1,
    },
    range: {
      type: Boolean,
      default: false,
    },
    marks: {
      type: Object,
      default: () => ({}),
    },
    showTooltip: {
      type: Boolean,
      default: true,
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
  setup(props) {
    const modelValue = useModel(props, 'modelValue')

    // 格式化滑块值显示
    const formatSliderValue = (value: any) => {
      if (value === null || value === undefined) return '-'

      if (Array.isArray(value)) {
        return value.join(' ~ ')
      }

      return String(value)
    }

    return () => {
      // 只读模式显示数值
      if (props.mode === 'read' || props.readonly) {
        return <span>{formatSliderValue(modelValue.value)}</span>
      }

      // 编辑模式显示滑块
      return (
        <div style={{ padding: '0 8px' }}>
          <Slider
            v-model={modelValue.value}
            min={props.min}
            max={props.max}
            step={props.step}
            range={props.range}
            marks={props.marks}
            tooltip={props.showTooltip}
            disabled={props.disabled}
            {...props.fieldProps}
          />
        </div>
      )
    }
  },
})

export default FieldSlider
