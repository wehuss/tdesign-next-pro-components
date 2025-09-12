import { DatePicker } from 'tdesign-vue-next'
import { createField } from '../../utils/createField'
import type { ProFormDatePickerProps } from '../types'

export const ProFormDatePicker = createField<ProFormDatePickerProps>({
  name: 'ProFormDatePicker',
  renderFormItem: (props: any, { slots }: any) => {
    return (
      <DatePicker
        v-model={props.modelValue}
        placeholder={props.placeholder as string}
        disabled={props.disabled}
        readonly={props.readonly}
        clearable={props.fieldProps?.allowClear}
        format={props.fieldProps?.format}
        valueFormat={props.fieldProps?.valueFormat}
        {...props.fieldProps}
      />
    )
  },
})

export default ProFormDatePicker