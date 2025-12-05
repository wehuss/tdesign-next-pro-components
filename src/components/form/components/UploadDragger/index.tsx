import { Upload } from 'tdesign-vue-next'
import { createField } from '../../utils/createField'
import type { ProFormUploadDraggerProps } from '../types'

export const ProFormUploadDragger = createField<ProFormUploadDraggerProps>({
  name: 'ProFormUploadDragger',
  renderFormItem: (props: any, { slots }: any) => {
    return (
      <Upload
        v-model={props.modelValue.value}
        disabled={props.disabled}
        multiple={props.fieldProps?.multiple}
        accept={props.fieldProps?.accept}
        action={props.fieldProps?.action}
        theme="file-flow"
        dragContent="点击或拖拽文件到此区域上传"
        {...props.fieldProps}
      />
    )
  },
})

export default ProFormUploadDragger
