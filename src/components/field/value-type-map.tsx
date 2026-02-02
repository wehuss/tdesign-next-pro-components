import type { VNode } from 'vue'
import FieldCascader from './components/cascader/index.tsx'
import FieldCheckbox from './components/checkbox/index.tsx'
import FieldCode from './components/code/index.tsx'
import FieldColorPicker from './components/color-picker/index.tsx'
import FieldDateRange from './components/date-range/index.tsx'
import FieldDate from './components/date/index.tsx'
import FieldDigitRange from './components/digit-range/index.tsx'
import FieldDigit from './components/digit/index.tsx'
import FieldFromNow from './components/from-now/index.tsx'
import FieldImage from './components/image/index.tsx'
import FieldIndexColumn from './components/index-column/index.tsx'
import FieldMoney from './components/money/index.tsx'
import FieldOptions from './components/options/index.tsx'
import FieldPassword from './components/password/index.tsx'
import FieldPercent from './components/percent/index.tsx'
import FieldProgress from './components/progress/index.tsx'
import FieldRadio from './components/radio/index.tsx'
import FieldRate from './components/rate/index.tsx'
import FieldSecond from './components/second/index.tsx'
import FieldSegmented from './components/segmented/index.tsx'
import FieldSelect from './components/select/index.tsx'
import FieldSlider from './components/slider/index.tsx'
import FieldStatus from './components/status/index.tsx'
import FieldSwitch from './components/switch/index.tsx'
import FieldText from './components/text/index.tsx'
import FieldTextArea from './components/textarea/index.tsx'
import FieldTime from './components/time/index.tsx'
import FieldTreeSelect from './components/tree-select/index.tsx'
import type { ProFieldTextType, ProRenderFieldPropsType } from './types'

/**
 * 文本组件渲染
 */
const renderText = (modelValue: ProFieldTextType, props: any): VNode => {
  return <FieldText v-model={modelValue} {...props} />
}

/**
 * ValueType 到组件的映射表
 */
export const valueTypeToComponentMap: Record<string, ProRenderFieldPropsType> = {
  text: {
    render: renderText,
    formItemRender: (modelValue, props) => (
      <FieldText v-model={modelValue} mode="edit" {...props} />
    ),
  },

  textarea: {
    render: (modelValue, props) => <FieldTextArea v-model={modelValue} {...props} />,
    formItemRender: (modelValue, props) => (
      <FieldTextArea v-model={modelValue} mode="edit" {...props} />
    ),
  },

  password: {
    render: (modelValue, props) => <FieldPassword v-model={modelValue} {...props} />,
    formItemRender: (modelValue, props) => (
      <FieldPassword v-model={modelValue} mode="edit" {...props} />
    ),
  },

  select: {
    render: (modelValue, props) => <FieldSelect v-model={modelValue} {...props} />,
    formItemRender: (modelValue, props) => (
      <FieldSelect v-model={modelValue} mode="edit" {...props} />
    ),
  },

  switch: {
    render: (modelValue, props) => <FieldSwitch v-model={modelValue} {...props} />,
    formItemRender: (modelValue, props) => (
      <FieldSwitch v-model={modelValue} mode="edit" {...props} />
    ),
  },

  money: {
    render: (modelValue, props) => <FieldMoney v-model={modelValue} {...props} />,
    formItemRender: (modelValue, props) => (
      <FieldMoney v-model={modelValue} mode="edit" {...props} />
    ),
  },

  digit: {
    render: (modelValue, props) => <FieldDigit v-model={modelValue} {...props} />,
    formItemRender: (modelValue, props) => (
      <FieldDigit v-model={modelValue} mode="edit" {...props} />
    ),
  },

  percent: {
    render: (modelValue, props) => <FieldPercent v-model={modelValue} {...props} />,
    formItemRender: (modelValue, props) => (
      <FieldPercent v-model={modelValue} mode="edit" {...props} />
    ),
  },

  date: {
    render: (modelValue, props) => <FieldDate v-model={modelValue} {...props} />,
    formItemRender: (modelValue, props) => (
      <FieldDate v-model={modelValue} mode="edit" {...props} />
    ),
  },

  dateRange: {
    render: (modelValue, props) => <FieldDateRange v-model={modelValue} {...props} />,
    formItemRender: (modelValue, props) => (
      <FieldDateRange v-model={modelValue} mode="edit" {...props} />
    ),
  },

  dateTimeRange: {
    render: (modelValue, props) => (
      <FieldDateRange v-model={modelValue} {...props} enableTimePicker />
    ),
    formItemRender: (modelValue, props) => (
      <FieldDateRange v-model={modelValue} mode="edit" {...props} enableTimePicker />
    ),
  },

  time: {
    render: (modelValue, props) => <FieldTime v-model={modelValue} {...props} />,
    formItemRender: (modelValue, props) => (
      <FieldTime v-model={modelValue} mode="edit" {...props} />
    ),
  },

  rate: {
    render: (modelValue, props) => <FieldRate v-model={modelValue} {...props} />,
    formItemRender: (modelValue, props) => (
      <FieldRate v-model={modelValue} mode="edit" {...props} />
    ),
  },

  slider: {
    render: (modelValue, props) => <FieldSlider v-model={modelValue} {...props} />,
    formItemRender: (modelValue, props) => (
      <FieldSlider v-model={modelValue} mode="edit" {...props} />
    ),
  },

  checkbox: {
    render: (modelValue, props) => <FieldCheckbox v-model={modelValue} {...props} />,
    formItemRender: (modelValue, props) => (
      <FieldCheckbox v-model={modelValue} mode="edit" {...props} />
    ),
  },

  radio: {
    render: (modelValue, props) => <FieldRadio v-model={modelValue} {...props} />,
    formItemRender: (modelValue, props) => (
      <FieldRadio v-model={modelValue} mode="edit" {...props} />
    ),
  },

  radioButton: {
    render: (modelValue, props) => (
      <FieldRadio v-model={modelValue} radioType="button" {...props} />
    ),
    formItemRender: (modelValue, props) => (
      <FieldRadio v-model={modelValue} radioType="button" mode="edit" {...props} />
    ),
  },

  status: {
    render: (modelValue, props) => <FieldStatus v-model={modelValue} {...props} />,
    formItemRender: (modelValue, props) => (
      <FieldSelect v-model={modelValue} mode="edit" {...props} />
    ),
  },

  cascader: {
    render: (modelValue, props) => <FieldCascader v-model={modelValue} {...props} />,
    formItemRender: (modelValue, props) => (
      <FieldCascader v-model={modelValue} mode="edit" {...props} />
    ),
  },

  treeSelect: {
    render: (modelValue, props) => <FieldTreeSelect v-model={modelValue} {...props} />,
    formItemRender: (modelValue, props) => (
      <FieldTreeSelect v-model={modelValue} mode="edit" {...props} />
    ),
  },

  code: {
    render: (modelValue, props) => <FieldCode v-model={modelValue} {...props} />,
    formItemRender: (modelValue, props) => (
      <FieldCode v-model={modelValue} mode="edit" {...props} />
    ),
  },

  jsonCode: {
    render: (modelValue, props) => <FieldCode v-model={modelValue} language="json" {...props} />,
    formItemRender: (modelValue, props) => (
      <FieldCode v-model={modelValue} language="json" mode="edit" {...props} />
    ),
  },

  color: {
    render: (modelValue, props) => <FieldColorPicker v-model={modelValue} {...props} />,
    formItemRender: (modelValue, props) => (
      <FieldColorPicker v-model={modelValue} mode="edit" {...props} />
    ),
  },

  digitRange: {
    render: (modelValue, props) => <FieldDigitRange v-model={modelValue} {...props} />,
    formItemRender: (modelValue, props) => (
      <FieldDigitRange v-model={modelValue} mode="edit" {...props} />
    ),
  },

  fromNow: {
    render: (modelValue, props) => <FieldFromNow v-model={modelValue} {...props} />,
    formItemRender: (modelValue, props) => (
      <FieldFromNow v-model={modelValue} mode="edit" {...props} />
    ),
  },

  image: {
    render: (modelValue, props) => <FieldImage v-model={modelValue} {...props} />,
    formItemRender: (modelValue, props) => (
      <FieldImage v-model={modelValue} mode="edit" {...props} />
    ),
  },

  index: {
    render: (modelValue, props) => <FieldIndexColumn v-model={modelValue} {...props} />,
    formItemRender: (modelValue, props) => <FieldIndexColumn v-model={modelValue} {...props} />,
  },

  indexBorder: {
    render: (modelValue, props) => <FieldIndexColumn v-model={modelValue} border {...props} />,
    formItemRender: (modelValue, props) => (
      <FieldIndexColumn v-model={modelValue} border {...props} />
    ),
  },

  progress: {
    render: (modelValue, props) => <FieldProgress v-model={modelValue} {...props} />,
    formItemRender: (modelValue, props) => (
      <FieldProgress v-model={modelValue} mode="edit" {...props} />
    ),
  },

  second: {
    render: (modelValue, props) => <FieldSecond v-model={modelValue} {...props} />,
    formItemRender: (modelValue, props) => (
      <FieldSecond v-model={modelValue} mode="edit" {...props} />
    ),
  },

  segmented: {
    render: (modelValue, props) => <FieldSegmented v-model={modelValue} {...props} />,
    formItemRender: (modelValue, props) => (
      <FieldSegmented v-model={modelValue} mode="edit" {...props} />
    ),
  },

  option: {
    render: (modelValue, props) => <FieldOptions v-model={modelValue} {...props} />,
    formItemRender: (modelValue, props) => <FieldOptions v-model={modelValue} {...props} />,
  },
}
