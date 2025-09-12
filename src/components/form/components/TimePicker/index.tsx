import { TimePicker } from 'tdesign-vue-next'
import { createField } from '../../utils/createField'
import type { ProFormTimePickerProps } from '../types'

export const ProFormTimePicker = createField<ProFormTimePickerProps>({
  name: 'ProFormTimePicker',
  renderFormItem: (props: any, { slots }: any) => {
    return (
      <TimePicker
        v-model={props.modelValue}
        placeholder={props.placeholder as string}
        disabled={props.disabled}
        readonly={props.readonly}
        clearable={props.fieldProps?.allowClear}
        format={props.fieldProps?.format}
        {...props.fieldProps}
      />
    )
  },
})

export default ProFormTimePicker