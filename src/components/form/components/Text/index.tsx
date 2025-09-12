import { Input } from 'tdesign-vue-next'
import { createField } from '../../utils/createField'
import type { ProFormTextProps } from '../types'

export const ProFormText = createField<ProFormTextProps>({
  name: 'ProFormText',
  renderFormItem: (props, { slots }) => {
    return (
      <Input
        v-model={props.modelValue}
        placeholder={props.placeholder as string}
        disabled={props.disabled}
        readonly={props.readonly}
        clearable={props.fieldProps?.allowClear}
        {...props.fieldProps}
      />
    )
  },
})

export default ProFormText