import { Cascader } from 'tdesign-vue-next'
import { createField } from '../../utils/createField'
import type { ProFormCascaderProps } from '../types'

export const ProFormCascader = createField<ProFormCascaderProps>({
  name: 'ProFormCascader',
  renderFormItem: (props: any, { slots }: any) => {
    return (
      <Cascader
        v-model={props.modelValue}
        options={props.options || props.fieldProps?.options}
        placeholder={props.placeholder as string}
        disabled={props.disabled}
        readonly={props.readonly}
        clearable={props.fieldProps?.allowClear}
        filterable={props.fieldProps?.showSearch}
        multiple={props.fieldProps?.multiple}
        {...props.fieldProps}
      />
    )
  },
})

export default ProFormCascader
