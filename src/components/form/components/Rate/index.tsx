import { Rate } from 'tdesign-vue-next'
import { createField } from '../../utils/createField'
import type { ProFormRateProps } from '../types'

export const ProFormRate = createField<ProFormRateProps>({
  name: 'ProFormRate',
  renderFormItem: (props: any, { slots }: any) => {
    return (
      <Rate
        v-model={props.modelValue.value}
        disabled={props.disabled}
        count={props.fieldProps?.count}
        allowHalf={props.fieldProps?.allowHalf}
        showText={props.fieldProps?.showText}
        {...props.fieldProps}
      />
    )
  },
})

export default ProFormRate
