import type { InputNumberProps } from 'tdesign-vue-next'
import type { PropType } from 'vue'
import { computed, defineComponent, inject, useModel } from 'vue'
import { FieldMoney } from '../../../field/components/money'
import type { ProFieldMode } from '../../../field/types'
import { EditOrReadOnlyContextKey } from '../../BaseForm/EditOrReadOnlyContext'
import {
  proFormFieldEmits,
  proFormFieldProps,
} from '../../utils/proFormFieldProps'
import { ProFormItem } from '../form-item'

/**
 * ProFormMoney 组件
 * 金额输入框表单字段，使用 FieldMoney 组件
 */
export const ProFormMoney = defineComponent({
  name: 'ProFormMoney',
  inheritAttrs: false,
  props: {
    ...proFormFieldProps,
    min: Number,
    max: Number,
    precision: Number,
    locale: String,
    customSymbol: String,
    fieldProps: {
      type: Object as PropType<InputNumberProps>,
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
        typeof editOrReadOnlyContext.mode === 'object' &&
        'value' in editOrReadOnlyContext.mode
          ? editOrReadOnlyContext.mode.value
          : editOrReadOnlyContext.mode
      return (contextMode as ProFieldMode) || 'edit'
    })

    return () => {
      const renderField = () => (
        <FieldMoney
          v-model={modelValue.value}
          mode={currentMode.value}
          min={props.min}
          max={props.max}
          precision={props.precision}
          locale={props.locale}
          currency={props.customSymbol}
          fieldProps={props.fieldProps}
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

export default ProFormMoney
