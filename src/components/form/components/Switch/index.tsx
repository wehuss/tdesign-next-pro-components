import { Switch } from 'tdesign-vue-next'
import { createField } from '../../utils/createField'
import type { ProFormSwitchProps } from '../types'

export const ProFormSwitch = createField<ProFormSwitchProps>({
  name: 'ProFormSwitch',
  renderFormItem: (props: any, { slots }: any) => {
    return (
      <Switch
        v-model={props.modelValue}
        disabled={props.disabled}
        size={props.fieldProps?.size}
        {...props.fieldProps}
      />
    )
  },
})

export default ProFormSwitch