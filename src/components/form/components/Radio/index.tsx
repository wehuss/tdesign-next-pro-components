import type { RadioGroupProps } from 'tdesign-vue-next'
import type { PropType } from 'vue'
import { computed, defineComponent, inject, useModel } from 'vue'
import { FieldRadio } from '../../../field/components/radio'
import type { ProFieldMode } from '../../../field/types'
import { EditOrReadOnlyContextKey } from '../../base-form/edit-or-read-only-context'
import { proFormFieldEmits, proFormFieldProps } from '../../utils/pro-form-field-props'
import { ProFormItem } from '../form-item'

/**
 * ProFormRadio 组件
 * 单选框表单字段，使用 FieldRadio 组件
 */
export const ProFormRadio = defineComponent({
  name: 'ProFormRadio',
  inheritAttrs: false,
  props: {
    ...proFormFieldProps,
    options: {
      type: Array as PropType<Array<{ label: string; value: any; disabled?: boolean }>>,
      default: undefined,
    },
    radioType: {
      type: String as PropType<'radio' | 'button'>,
      default: 'radio',
    },
    fieldProps: {
      type: Object as PropType<RadioGroupProps>,
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
        <FieldRadio
          v-model={modelValue.value}
          mode={currentMode.value}
          valueEnum={props.valueEnum}
          radioType={props.radioType}
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

export default ProFormRadio
