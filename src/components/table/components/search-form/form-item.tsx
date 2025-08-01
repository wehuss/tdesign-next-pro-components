import {
  Checkbox,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Radio,
  Select,
  Switch,
  TimePicker,
} from 'tdesign-vue-next'
import type { PropType } from 'vue'
import { defineComponent } from 'vue'
import type { ProColumn } from '../../types'

export default defineComponent({
  name: 'FormItem',
  props: {
    column: {
      type: Object as PropType<ProColumn>,
      required: true,
    },
    modelValue: {
      type: [String, Number, Boolean, Array, Object],
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const handleChange = (value: unknown) => {
      emit('update:modelValue', value)
    }

    const renderFormComponent = () => {
      const { column } = props
      const { valueType = 'text', fieldProps = {}, valueEnum } = column

      const commonProps = {
        ...fieldProps,
        value: props.modelValue,
        onChange: handleChange,
      } as any

      switch (valueType) {
        case 'text':
          return (
            <Input {...commonProps} placeholder={`请输入${column.title}`} />
          )

        case 'textarea':
          return (
            <Input
              {...commonProps}
              type="textarea"
              placeholder={`请输入${column.title}`}
            />
          )

        case 'select': {
          const options = valueEnum
            ? Object.entries(valueEnum).map(([value, item]) => ({
                value,
                label: item.text,
              }))
            : fieldProps.options || []

          return (
            <Select
              {...commonProps}
              options={options}
              placeholder={`请选择${column.title}`}
            />
          )
        }

        case 'date':
          return (
            <DatePicker
              {...commonProps}
              placeholder={`请选择${column.title}`}
            />
          )

        case 'dateRange':
          return (
            <DatePicker
              {...commonProps}
              mode="date"
              enableTimePicker={false}
              placeholder={['开始日期', '结束日期']}
            />
          )

        case 'dateTime':
          return (
            <DatePicker
              {...commonProps}
              enableTimePicker
              placeholder={`请选择${column.title}`}
            />
          )

        case 'time':
          return (
            <TimePicker
              {...commonProps}
              placeholder={`请选择${column.title}`}
            />
          )

        case 'digit':
          return (
            <InputNumber
              {...commonProps}
              placeholder={`请输入${column.title}`}
            />
          )

        case 'switch':
          return <Switch {...commonProps} />

        case 'checkbox': {
          const checkboxOptions = valueEnum
            ? Object.entries(valueEnum).map(([value, item]) => ({
                value,
                label: item.text,
              }))
            : fieldProps.options || []

          return <Checkbox.Group {...commonProps} options={checkboxOptions} />
        }

        case 'radio': {
          const radioOptions = valueEnum
            ? Object.entries(valueEnum).map(([value, item]) => ({
                value,
                label: item.text,
              }))
            : fieldProps.options || []

          return <Radio.Group {...commonProps} options={radioOptions} />
        }

        default:
          return (
            <Input {...commonProps} placeholder={`请输入${column.title}`} />
          )
      }
    }

    return () => {
      const { column } = props

      return (
        <Form.FormItem
          label={column.title}
          name={column.colKey}
          {...column.formItemProps}
        >
          {renderFormComponent()}
        </Form.FormItem>
      )
    }
  },
})
