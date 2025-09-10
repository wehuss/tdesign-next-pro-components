import type { VNode } from 'vue'
import FieldCheckbox from './components/checkbox/index.tsx'
import FieldDateRange from './components/date-range/index.tsx'
import FieldDate from './components/date/index.tsx'
import FieldDigit from './components/digit/index.tsx'
import FieldMoney from './components/money/index.tsx'
import FieldPassword from './components/password/index.tsx'
import FieldPercent from './components/percent/index.tsx'
import FieldRadio from './components/radio/index.tsx'
import FieldRate from './components/rate/index.tsx'
import FieldSelect from './components/select/index.tsx'
import FieldSlider from './components/slider/index.tsx'
import FieldStatus from './components/status/index.tsx'
import FieldSwitch from './components/switch/index.tsx'
import FieldText from './components/text/index.tsx'
import FieldTextArea from './components/textarea/index.tsx'
import FieldTime from './components/time/index.tsx'
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
export const valueTypeToComponentMap: Record<string, ProRenderFieldPropsType> =
  {
    text: {
      render: renderText,
      formItemRender: (modelValue, props) => (
        <FieldText v-model={modelValue} mode="edit" {...props} />
      ),
    },

    textarea: {
      render: (modelValue, props) => (
        <FieldTextArea v-model={modelValue} {...props} />
      ),
      formItemRender: (modelValue, props) => (
        <FieldTextArea v-model={modelValue} mode="edit" {...props} />
      ),
    },

    password: {
      render: (modelValue, props) => (
        <FieldPassword v-model={modelValue} {...props} />
      ),
      formItemRender: (modelValue, props) => (
        <FieldPassword v-model={modelValue} mode="edit" {...props} />
      ),
    },

    select: {
      render: (modelValue, props) => (
        <FieldSelect v-model={modelValue} {...props} />
      ),
      formItemRender: (modelValue, props) => (
        <FieldSelect v-model={modelValue} mode="edit" {...props} />
      ),
    },

    switch: {
      render: (modelValue, props) => (
        <FieldSwitch v-model={modelValue} {...props} />
      ),
      formItemRender: (modelValue, props) => (
        <FieldSwitch v-model={modelValue} mode="edit" {...props} />
      ),
    },

    money: {
      render: (modelValue, props) => (
        <FieldMoney v-model={modelValue} {...props} />
      ),
      formItemRender: (modelValue, props) => (
        <FieldMoney v-model={modelValue} mode="edit" {...props} />
      ),
    },

    digit: {
      render: (modelValue, props) => (
        <FieldDigit v-model={modelValue} {...props} />
      ),
      formItemRender: (modelValue, props) => (
        <FieldDigit v-model={modelValue} mode="edit" {...props} />
      ),
    },

    percent: {
      render: (modelValue, props) => (
        <FieldPercent v-model={modelValue} {...props} />
      ),
      formItemRender: (modelValue, props) => (
        <FieldPercent v-model={modelValue} mode="edit" {...props} />
      ),
    },

    date: {
      render: (modelValue, props) => (
        <FieldDate v-model={modelValue} {...props} />
      ),
      formItemRender: (modelValue, props) => (
        <FieldDate v-model={modelValue} mode="edit" {...props} />
      ),
    },

    dateRange: {
      render: (modelValue, props) => (
        <FieldDateRange v-model={modelValue} {...props} />
      ),
      formItemRender: (modelValue, props) => (
        <FieldDateRange v-model={modelValue} mode="edit" {...props} />
      ),
    },

    time: {
      render: (modelValue, props) => (
        <FieldTime v-model={modelValue} {...props} />
      ),
      formItemRender: (modelValue, props) => (
        <FieldTime v-model={modelValue} mode="edit" {...props} />
      ),
    },

    rate: {
      render: (modelValue, props) => (
        <FieldRate v-model={modelValue} {...props} />
      ),
      formItemRender: (modelValue, props) => (
        <FieldRate v-model={modelValue} mode="edit" {...props} />
      ),
    },

    slider: {
      render: (modelValue, props) => (
        <FieldSlider v-model={modelValue} {...props} />
      ),
      formItemRender: (modelValue, props) => (
        <FieldSlider v-model={modelValue} mode="edit" {...props} />
      ),
    },

    checkbox: {
      render: (modelValue, props) => (
        <FieldCheckbox v-model={modelValue} {...props} />
      ),
      formItemRender: (modelValue, props) => (
        <FieldCheckbox v-model={modelValue} mode="edit" {...props} />
      ),
    },

    radio: {
      render: (modelValue, props) => (
        <FieldRadio v-model={modelValue} {...props} />
      ),
      formItemRender: (modelValue, props) => (
        <FieldRadio v-model={modelValue} mode="edit" {...props} />
      ),
    },

    radioButton: {
      render: (modelValue, props) => (
        <FieldRadio v-model={modelValue} radioType="button" {...props} />
      ),
      formItemRender: (modelValue, props) => (
        <FieldRadio
          v-model={modelValue}
          radioType="button"
          mode="edit"
          {...props}
        />
      ),
    },

    status: {
      render: (modelValue, props) => (
        <FieldStatus v-model={modelValue} {...props} />
      ),
      formItemRender: (modelValue, props) => (
        <FieldSelect v-model={modelValue} mode="edit" {...props} />
      ),
    },
  }
