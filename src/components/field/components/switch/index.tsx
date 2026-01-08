import { Switch } from 'tdesign-vue-next'
import { defineComponent, ref, useModel } from 'vue'
import type { ProFieldMode } from '../../types'

/**
 * Switch 组件 - 开关字段
 * 只读模式显示是/否，编辑模式显示开关
 */
export const FieldSwitch = defineComponent({
  name: 'ProFieldSwitch',
  props: {
    modelValue: {
      type: [Boolean, String, Number] as any,
      default: false,
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
    const dataEntryRef = ref<InstanceType<typeof Switch>>()
    const getDataEntryRef = () => dataEntryRef.value

    expose({
      getDataEntryRef,
      dataEntryRef,
    })

    return () => {
      const value = Boolean(modelValue.value)

      // 只读模式直接显示是/否
      if (props.mode === 'read' || props.readonly) {
        return <span>{value ? '是' : '否'}</span>
      }

      // 编辑模式显示开关
      return (
        <Switch
          ref={dataEntryRef}
          v-model={modelValue.value}
          disabled={props.disabled}
          {...props.fieldProps}
        />
      )
    }
  },
})

export default FieldSwitch
