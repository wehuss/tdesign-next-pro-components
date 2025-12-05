import { Switch } from 'tdesign-vue-next'
import { createField } from '../../utils/createField'

/**
 * ProFormSwitch 组件
 * 开关表单字段，支持布尔值 v-model 双向绑定
 */
export const ProFormSwitch = createField({
  name: 'ProFormSwitch',
  valueType: 'switch',
  renderFormItem: (props: any) => {
    const {
      size,
      label: switchLabel,
      loading,
      ...restFieldProps
    } = props.fieldProps || {}

    return (
      <Switch
        v-model={props.modelValue.value}
        disabled={props.disabled}
        size={size}
        label={switchLabel}
        loading={loading}
        {...restFieldProps}
      />
    )
  },
})

export default ProFormSwitch
