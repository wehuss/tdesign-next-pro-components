import type { TimeRangePickerProps } from 'tdesign-vue-next'
import type { PropType } from 'vue'
import { computed, defineComponent, inject, useModel } from 'vue'
import { FieldTimeRange } from '../../../field/components/time-range'
import type { ProFieldMode } from '../../../field/types'
import { EditOrReadOnlyContextKey } from '../../base-form/edit-or-read-only-context'
import { proFormFieldEmits, proFormFieldProps } from '../../utils/pro-form-field-props'
import { ProFormItem } from '../form-item'

/**
 * ProFormTimeRangePicker 组件
 * 时间范围选择器表单字段，使用 FieldTimeRange 组件
 */
export const ProFormTimeRangePicker = defineComponent({
  name: 'ProFormTimeRangePicker',
  inheritAttrs: false,
  props: {
    ...proFormFieldProps,
    format: String,
    placeholder: [String, Array] as PropType<string | string[]>,
    fieldProps: {
      type: Object as PropType<TimeRangePickerProps>,
      default: () => ({}),
    },
  },
  emits: [...proFormFieldEmits],
  setup(props, { attrs }) {
    const modelValue = useModel(props, 'modelValue')

    const editOrReadOnlyContext = inject(EditOrReadOnlyContextKey, {
      mode: 'edit',
    })

    const currentMode = computed<ProFieldMode>(() => {
      if (props.readonly) return 'read'
      const contextMode =
        typeof editOrReadOnlyContext.mode === 'object' && 'value' in editOrReadOnlyContext.mode
          ? editOrReadOnlyContext.mode.value
          : editOrReadOnlyContext.mode
      return (contextMode as ProFieldMode) || 'edit'
    })

    return () => {
      const renderField = () => (
        <FieldTimeRange
          v-model={modelValue.value}
          mode={currentMode.value}
          format={props.format}
          placeholder={props.placeholder}
          fieldProps={props.fieldProps}
          {...attrs}
        />
      )

      if (props.ignoreFormItem) {
        return renderField()
      }

      return (
        <ProFormItem
          name={props.name}
          label={props.label}
          rules={props.rules}
          required={props.required}
          help={props.help}
          extra={props.extra}
          width={props.width}
          transform={props.transform}
          dataFormat={props.dataFormat}
          lightProps={props.lightProps}
          secondary={props.secondary}
          colProps={props.colProps}
          {...props.formItemProps}
        >
          {renderField()}
        </ProFormItem>
      )
    }
  },
})

export default ProFormTimeRangePicker
