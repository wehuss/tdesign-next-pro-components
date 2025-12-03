import { Image, Input } from 'tdesign-vue-next'
import { defineComponent, ref, useModel } from 'vue'
import type { ProFieldMode } from '../../types'

/**
 * Image 组件 - 图片展示字段
 * 只读模式显示图片，编辑模式显示 URL 输入框
 */
export const FieldImage = defineComponent({
  name: 'ProFieldImage',
  props: {
    modelValue: {
      type: String,
      default: '',
    },
    mode: {
      type: String as () => ProFieldMode,
      default: 'read' as ProFieldMode,
    },
    width: {
      type: [Number, String],
      default: 32,
    },
    height: {
      type: [Number, String],
      default: undefined,
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
      default: '请输入图片地址',
    },
  },
  emits: ['update:modelValue', 'change'],
  setup(props, { expose }) {
    const modelValue = useModel(props, 'modelValue')
    const dataEntryRef = ref<InstanceType<typeof Input>>()
    const getDataEntryRef = () => dataEntryRef.value

    expose({
      getDataEntryRef,
      dataEntryRef,
    })

    return () => {
      // 只读模式显示图片
      if (props.mode === 'read' || props.readonly) {
        const src = props.modelValue

        if (!src) {
          return <span>-</span>
        }

        return (
          <Image
            src={src}
            style={{
              width:
                typeof props.width === 'number'
                  ? `${props.width}px`
                  : props.width,
              height: props.height
                ? typeof props.height === 'number'
                  ? `${props.height}px`
                  : props.height
                : 'auto',
            }}
            fit="contain"
            {...props.fieldProps}
          />
        )
      }

      // 编辑模式显示输入框
      return (
        <Input
          ref={dataEntryRef}
          v-model={modelValue.value}
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

export default FieldImage
