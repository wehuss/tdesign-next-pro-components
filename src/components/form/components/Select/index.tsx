import { Select } from 'tdesign-vue-next'
import { createField } from '../../utils/createField'
import type { ProFormSelectProps } from '../types'

export const ProFormSelect = createField<ProFormSelectProps>({
  name: 'ProFormSelect',
  renderFormItem: (props: any, { slots }: any) => {
    return (
      <Select
        v-model={props.modelValue}
        options={props.options || props.fieldProps?.options}
        placeholder={props.placeholder as string}
        disabled={props.disabled}
        readonly={props.readonly}
        clearable={props.fieldProps?.allowClear}
        filterable={props.fieldProps?.showSearch}
        multiple={props.fieldProps?.mode === 'multiple'}
        {...props.fieldProps}
      />
    )
  },
})

export default ProFormSelect