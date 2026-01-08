import type { SwitchProps } from 'tdesign-vue-next'
import type { PropType } from 'vue'
import { computed, defineComponent, inject, useModel } from 'vue'
import { FieldSwitch } from '../../../field/components/switch'
import type { ProFieldMode } from '../../../field/types'
import { EditOrReadOnlyContextKey } from '../../base-form/edit-or-read-only-context'
import { proFormFieldEmits, proFormFieldProps } from '../../utils/pro-form-field-props'
import { ProFormItem } from '../form-item'

/**
 * ProFormSwitch 组件
 * 开关表单字段，使用 FieldSwitch 组件
 */
export const ProFormSwitch = defineComponent({
  name: 'ProFormSwitch',
  inheritAttrs: false,
  props: {
    ...proFormFieldProps,
    checkedChildren: [String, Object] as PropType<string | any>,
    unCheckedChildren: [String, Object] as PropType<string | any>,
    fieldProps: {
      type: Object as PropType<SwitchProps>,
      default: () => ({}),
    },
  },
  emits: [...proFormFieldEmits],
  setup(props, { attrs }) {
    const modelValue = useModel(props, 'modelValue')

    const editOrReadOnlyContext = inject(EditOrReadOnlyContextKey, {
      mode: 'edit',
    })

    const currentMode = computed<ProFieldMode>(() => {
      if (props.readonly) return 'read'
      const contextMode =
        typeof editOrReadOnlyContext.mode === 'object' && 'value' in editOrReadOnlyContext.mode
          ? editOrReadOnlyContext.mode.value
          : editOrReadOnlyContext.mode
      return (contextMode as ProFieldMode) || 'edit'
    })

    return () => {
      const renderField = () => (
        <FieldSwitch
          v-model={modelValue.value}
          mode={currentMode.value}
          fieldProps={{
            ...props.fieldProps,
            label: props.fieldProps.label ?? [props.checkedChildren, props.unCheckedChildren],
          }}
          {...attrs}
        />
      )

      if (props.ignoreFormItem) {
        return renderField()
      }

      return (
        <ProFormItem
          name={props.name}
          label={props.label}
          rules={props.rules}
          required={props.required}
          help={props.help}
          extra={props.extra}
          width={props.width}
          transform={props.transform}
          dataFormat={props.dataFormat}
          lightProps={props.lightProps}
          secondary={props.secondary}
          colProps={props.colProps}
          {...props.formItemProps}
        >
          {renderField()}
        </ProFormItem>
      )
    }
  },
})

export default ProFormSwitch
