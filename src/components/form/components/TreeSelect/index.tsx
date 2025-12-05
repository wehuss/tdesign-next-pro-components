import { TreeSelect } from 'tdesign-vue-next'
import { createField } from '../../utils/createField'
import type { ProFormTreeSelectProps } from '../types'

export const ProFormTreeSelect = createField<ProFormTreeSelectProps>({
  name: 'ProFormTreeSelect',
  renderFormItem: (props: any, { slots }: any) => {
    return (
      <TreeSelect
        v-model={props.modelValue}
        data={props.fieldProps?.treeData || props.options}
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

export default ProFormTreeSelect
