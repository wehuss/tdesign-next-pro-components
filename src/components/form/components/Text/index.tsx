import { Input } from 'tdesign-vue-next'
import { createField } from '../../utils/createField'

/**
 * ProFormText 组件
 * 文本输入框表单字段，支持 v-model 双向绑定
 */
export const ProFormText = createField({
  name: 'ProFormText',
  valueType: 'text',
  renderFormItem: (props: any) => {
    const { allowClear, ...restFieldProps } = props.fieldProps || {}

    return (
      <Input
        v-model={props.modelValue.value}
        placeholder={props.placeholder as string}
        disabled={props.disabled}
        readonly={props.readonly}
        clearable={allowClear !== false}
        {...restFieldProps}
      />
    )
  },
})

export default ProFormText
