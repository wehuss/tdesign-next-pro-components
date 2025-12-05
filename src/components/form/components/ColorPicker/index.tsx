import { ColorPicker } from 'tdesign-vue-next'
import { createField } from '../../utils/createField'
import type { ProFormColorPickerProps } from '../types'

export const ProFormColorPicker = createField<ProFormColorPickerProps>({
  name: 'ProFormColorPicker',
  renderFormItem: (props: any, { slots }: any) => {
    return (
      <ColorPicker
        v-model={props.modelValue.value}
        disabled={props.disabled}
        clearable={props.fieldProps?.allowClear}
        format={props.fieldProps?.format}
        {...props.fieldProps}
      />
    )
  },
})

export default ProFormColorPicker
