import { CheckboxGroup } from 'tdesign-vue-next'
import { createField } from '../../utils/createField'
import type { ProFormCheckboxGroupProps } from '../types'

export const ProFormCheckbox = createField<ProFormCheckboxGroupProps>({
  name: 'ProFormCheckbox',
  renderFormItem: (props: any, { slots }: any) => {
    return (
      <CheckboxGroup
        v-model={props.modelValue}
        options={props.options || props.fieldProps?.options}
        disabled={props.disabled}
        {...props.fieldProps}
      />
    )
  },
})

export default ProFormCheckbox