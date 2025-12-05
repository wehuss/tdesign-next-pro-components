import { RadioGroup } from 'tdesign-vue-next'
import { createField } from '../../utils/createField'
import type { ProFormRadioGroupProps } from '../types'

export const ProFormRadio = createField<ProFormRadioGroupProps>({
  name: 'ProFormRadio',
  renderFormItem: (props: any, { slots }: any) => {
    return (
      <RadioGroup
        v-model={props.modelValue}
        options={props.options || props.fieldProps?.options}
        disabled={props.disabled}
        variant={
          props.fieldProps?.radioType === 'button'
            ? 'default-filled'
            : 'outline'
        }
        {...props.fieldProps}
      />
    )
  },
})

export default ProFormRadio
