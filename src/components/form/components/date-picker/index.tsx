import type { DatePickerProps } from 'tdesign-vue-next'
import type { PropType } from 'vue'
import { computed, defineComponent, inject, useModel } from 'vue'
import { FieldDate } from '../../../field/components/date'
import type { ProFieldMode } from '../../../field/types'
import { EditOrReadOnlyContextKey } from '../../BaseForm/EditOrReadOnlyContext'
import {
  proFormFieldEmits,
  proFormFieldProps,
} from '../../utils/proFormFieldProps'
import { ProFormItem } from '../form-item'

/**
 * ProFormDatePicker 组件
 * 日期选择器表单字段，使用 FieldDate 组件
 */
export const ProFormDatePicker = defineComponent({
  name: 'ProFormDatePicker',
  inheritAttrs: false,
  props: {
    ...proFormFieldProps,
    format: String,
    valueFormat: String,
    placeholder: String,
    fieldProps: {
      type: Object as PropType<DatePickerProps>,
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
        <FieldDate
          v-model={modelValue.value}
          mode={currentMode.value}
          format={props.format}
          valueFormat={props.valueFormat}
          placeholder={props.placeholder}
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
          addonBefore={props.addonBefore}
          addonAfter={props.addonAfter}
          addonWarpStyle={props.addonWarpStyle}
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

export default ProFormDatePicker
