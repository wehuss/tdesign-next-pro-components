import { ColorPicker } from 'tdesign-vue-next'
import type { CSSProperties } from 'vue'
import { defineComponent, ref, useModel } from 'vue'
import type { ProFieldMode } from '../../types'

/**
 * 默认预设颜色
 */
const DEFAULT_SWATCHES = [
  '#F5222D',
  '#FA8C16',
  '#FADB14',
  '#8BBB11',
  '#52C41A',
  '#13A8A8',
  '#1677FF',
  '#2F54EB',
  '#722ED1',
  '#EB2F96',
  '#F5222D4D',
  '#FA8C164D',
  '#FADB144D',
  '#8BBB114D',
  '#52C41A4D',
  '#13A8A84D',
  '#1677FF4D',
  '#2F54EB4D',
  '#722ED14D',
  '#EB2F964D',
]

/**
 * ColorPicker 组件 - 颜色选择字段
 * 支持 read/edit 模式
 */
export const FieldColorPicker = defineComponent({
  name: 'ProFieldColorPicker',
  props: {
    modelValue: {
      type: String,
      default: '',
    },
    mode: {
      type: String as () => ProFieldMode,
      default: 'read' as ProFieldMode,
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
    const dataEntryRef = ref<InstanceType<typeof ColorPicker>>()
    const getDataEntryRef = () => dataEntryRef.value

    expose({
      getDataEntryRef,
      dataEntryRef,
    })

    // 颜色预览样式
    const getColorPreviewStyle = (color: string): CSSProperties => ({
      display: 'inline-block',
      width: '24px',
      height: '24px',
      borderRadius: '4px',
      backgroundColor: color || 'transparent',
      border: '1px solid var(--td-border-level-2-color)',
      verticalAlign: 'middle',
    })

    return () => {
      // 只读模式显示颜色预览
      if (props.mode === 'read' || props.readonly) {
        const color = props.modelValue
        return (
          <span
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
          >
            <span style={getColorPreviewStyle(color)} />
            <span>{color || '-'}</span>
          </span>
        )
      }

      // 编辑模式显示颜色选择器
      return (
        <ColorPicker
          ref={dataEntryRef}
          v-model={modelValue.value}
          disabled={props.disabled}
          swatchColors={DEFAULT_SWATCHES}
          {...props.fieldProps}
        />
      )
    }
  },
})

export default FieldColorPicker
