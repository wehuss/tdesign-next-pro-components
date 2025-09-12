import { DateRangePicker } from 'tdesign-vue-next'
import { createField } from '../../utils/createField'
import type { ProFormDateRangePickerProps } from '../types'

export const ProFormDateRangePicker = createField<ProFormDateRangePickerProps>({
  name: 'ProFormDateRangePicker',
  renderFormItem: (props: any, { slots }: any) => {
    return (
      <DateRangePicker
        v-model={props.modelValue}
        placeholder={props.placeholder as [string, string]}
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

export default ProFormDateRangePicker