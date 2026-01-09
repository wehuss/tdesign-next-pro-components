import type { CheckboxGroupProps } from 'tdesign-vue-next'
import type { PropType } from 'vue'
import { computed, defineComponent, inject, useModel } from 'vue'
import { FieldCheckbox } from '../../../field/components/checkbox'
import type { ProFieldMode } from '../../../field/types'
import { EditOrReadOnlyContextKey } from '../../base-form/edit-or-read-only-context'
import { proFormFieldEmits, proFormFieldProps } from '../../utils/pro-form-field-props'
import { ProFormItem } from '../form-item'

/**
 * ProFormCheckbox 组件
 * 复选框表单字段，使用 FieldCheckbox 组件
 */
export const ProFormCheckbox = defineComponent({
  name: 'ProFormCheckbox',
  inheritAttrs: false,
  props: {
    ...proFormFieldProps,
    options: {
      type: Array as PropType<Array<{ label: string; value: any; disabled?: boolean }>>,
      default: () => [],
    },
    fieldProps: {
      type: Object as PropType<CheckboxGroupProps>,
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
        <FieldCheckbox
          v-model={modelValue.value}
          mode={currentMode.value}
          valueEnum={props.valueEnum}
          fieldProps={{
            ...props.fieldProps,
            options: props.options ?? props.fieldProps?.options,
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

export default ProFormCheckbox
