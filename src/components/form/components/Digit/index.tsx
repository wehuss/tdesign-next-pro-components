import { InputNumber } from 'tdesign-vue-next'
import { createField } from '../../utils/createField'
import type { ProFormDigitProps } from '../types'

export const ProFormDigit = createField<ProFormDigitProps>({
  name: 'ProFormDigit',
  renderFormItem: (props: any, { slots }: any) => {
    return (
      <InputNumber
        v-model={props.modelValue}
        placeholder={props.placeholder as string}
        disabled={props.disabled}
        readonly={props.readonly}
        min={props.fieldProps?.min}
        max={props.fieldProps?.max}
        step={props.fieldProps?.step}
        precision={props.fieldProps?.precision}
        {...props.fieldProps}
      />
    )
  },
})

export default ProFormDigit
