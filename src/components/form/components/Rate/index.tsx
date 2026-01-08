import type { RateProps } from 'tdesign-vue-next'
import type { PropType } from 'vue'
import { computed, defineComponent, inject, useModel } from 'vue'
import { FieldRate } from '../../../field/components/rate'
import type { ProFieldMode } from '../../../field/types'
import { EditOrReadOnlyContextKey } from '../../BaseForm/EditOrReadOnlyContext'
import {
  proFormFieldEmits,
  proFormFieldProps,
} from '../../utils/proFormFieldProps'
import { ProFormItem } from '../form-item'

/**
 * ProFormRate 组件
 * 评分表单字段，使用 FieldRate 组件
 */
export const ProFormRate = defineComponent({
  name: 'ProFormRate',
  inheritAttrs: false,
  props: {
    ...proFormFieldProps,
    count: Number,
    allowHalf: Boolean,
    allowClear: Boolean,
    fieldProps: {
      type: Object as PropType<RateProps>,
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
        typeof editOrReadOnlyContext.mode === 'object' &&
        'value' in editOrReadOnlyContext.mode
          ? editOrReadOnlyContext.mode.value
          : editOrReadOnlyContext.mode
      return (contextMode as ProFieldMode) || 'edit'
    })

    return () => {
      const renderField = () => (
        <FieldRate
          v-model={modelValue.value}
          mode={currentMode.value}
          count={props.count}
          allowHalf={props.allowHalf}
          fieldProps={{
            ...props.fieldProps,
            clearable: props.allowClear ?? props.fieldProps?.clearable,
          }}
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

export default ProFormRate
