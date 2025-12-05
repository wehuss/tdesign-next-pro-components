import { Upload } from 'tdesign-vue-next'
import { createField } from '../../utils/createField'
import type { ProFormUploadButtonProps } from '../types'

export const ProFormUploadButton = createField<ProFormUploadButtonProps>({
  name: 'ProFormUploadButton',
  renderFormItem: (props: any, { slots }: any) => {
    return (
      <Upload
        v-model={props.modelValue.value}
        disabled={props.disabled}
        multiple={props.fieldProps?.multiple}
        accept={props.fieldProps?.accept}
        action={props.fieldProps?.action}
        theme="file"
        {...props.fieldProps}
      />
    )
  },
})

export default ProFormUploadButton
