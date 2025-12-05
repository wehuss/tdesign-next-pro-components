import { DatePicker } from 'tdesign-vue-next'
import { createField } from '../../utils/createField'

/**
 * ProFormDatePicker 组件
 * 日期选择器表单字段，支持 v-model 双向绑定
 * 正确合并 fieldProps 属性
 */
export const ProFormDatePicker = createField({
  name: 'ProFormDatePicker',
  valueType: 'date',
  renderFormItem: (props: any) => {
    const { allowClear, format, valueFormat, mode, ...restFieldProps } =
      props.fieldProps || {}

    return (
      <DatePicker
        v-model={props.modelValue.value}
        placeholder={props.placeholder as string}
        disabled={props.disabled}
        readonly={props.readonly}
        clearable={allowClear !== false}
        format={format || props.dataFormat}
        valueFormat={valueFormat}
        mode={mode || 'date'}
        {...restFieldProps}
      />
    )
  },
})

export default ProFormDatePicker
