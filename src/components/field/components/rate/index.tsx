import { Rate } from 'tdesign-vue-next'
import { defineComponent, useModel } from 'vue'
import type { ProFieldMode } from '../../types'

/**
 * Rate 组件 - 评分字段
 * 只读和编辑模式都显示星级评分
 */
export const FieldRate = defineComponent({
  name: 'ProFieldRate',
  props: {
    modelValue: {
      type: [String, Number, null, undefined] as any,
      default: null,
    },
    mode: {
      type: String as () => ProFieldMode,
      default: 'read' as ProFieldMode,
    },
    count: {
      type: Number,
      default: 5,
    },
    allowHalf: {
      type: Boolean,
      default: false,
    },
    showText: {
      type: Boolean,
      default: false,
    },
    texts: {
      type: Array as () => string[],
      default: () => ['极差', '失望', '一般', '满意', '惊喜'],
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
    return () => {
      // 只读模式和编辑模式都显示评分组件，但只读模式不可交互
      const isReadonly = props.mode === 'read' || props.readonly

      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Rate
            v-model={modelValue.value}
            count={props.count}
            allowHalf={props.allowHalf}
            readonly={isReadonly}
            disabled={props.disabled}
            {...props.fieldProps}
          />
          {props.showText && modelValue.value > 0 && (
            <span>
              {props.texts[Math.ceil(modelValue.value) - 1] ||
                `${modelValue.value}星`}
            </span>
          )}
        </div>
      )
    }
  },
})

export default FieldRate
