import { Slider } from 'tdesign-vue-next'
import { createField } from '../../utils/createField'
import type { ProFormSliderProps } from '../types'

export const ProFormSlider = createField<ProFormSliderProps>({
  name: 'ProFormSlider',
  renderFormItem: (props: any, { slots }: any) => {
    return (
      <Slider
        v-model={props.modelValue}
        disabled={props.disabled}
        min={props.fieldProps?.min}
        max={props.fieldProps?.max}
        step={props.fieldProps?.step}
        marks={props.fieldProps?.marks}
        range={props.fieldProps?.range}
        {...props.fieldProps}
      />
    )
  },
})

export default ProFormSlider