import { Textarea } from 'tdesign-vue-next'
import { createField } from '../../utils/createField'
import type { ProFormTextAreaProps } from '../types'

export const ProFormTextArea = createField<ProFormTextAreaProps>({
  name: 'ProFormTextArea',
  renderFormItem: (props: any, { slots }: any) => {
    return (
      <Textarea
        v-model={props.modelValue.value}
        placeholder={props.placeholder as string}
        disabled={props.disabled}
        readonly={props.readonly}
        clearable={props.fieldProps?.allowClear}
        autosize={props.fieldProps?.autosize}
        maxlength={props.fieldProps?.maxlength}
        {...props.fieldProps}
      />
    )
  },
})

export default ProFormTextArea
