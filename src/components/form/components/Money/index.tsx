import { InputNumber } from 'tdesign-vue-next'
import { createField } from '../../utils/createField'
import type { ProFormMoneyProps } from '../types'

export const ProFormMoney = createField<ProFormMoneyProps>({
  name: 'ProFormMoney',
  renderFormItem: (props: any, { slots }: any) => {
    return (
      <InputNumber
        v-model={props.modelValue}
        placeholder={props.placeholder as string}
        disabled={props.disabled}
        readonly={props.readonly}
        min={0}
        step={0.01}
        precision={2}
        {...props.fieldProps}
        v-slots={{
          suffix: () => props.fieldProps?.customSymbol || '¥',
        }}
      />
    )
  },
})

export default ProFormMoney
