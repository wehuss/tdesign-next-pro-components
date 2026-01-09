import type { SelectProps } from 'tdesign-vue-next'
import type { PropType } from 'vue'
import { computed, defineComponent, inject, useModel } from 'vue'
import { FieldSelect } from '../../../field/components/select'
import type { ProFieldMode } from '../../../field/types'
import { EditOrReadOnlyContextKey } from '../../base-form/edit-or-read-only-context'
import { proFormFieldEmits, proFormFieldProps } from '../../utils/pro-form-field-props'
import { ProFormItem } from '../form-item'

/**
 * 选项类型
 */
interface SelectOption {
  label: string
  value: any
  disabled?: boolean
}

/**
 * ProFormSelect 组件
 * 选择器表单字段，使用 FieldSelect 组件
 */
export const ProFormSelect = defineComponent({
  name: 'ProFormSelect',
  inheritAttrs: false,
  props: {
    ...proFormFieldProps,
    options: {
      type: Array as PropType<SelectOption[]>,
      default: undefined,
    },
    fieldProps: {
      type: Object as PropType<SelectProps>,
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
        <FieldSelect
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

export default ProFormSelect
