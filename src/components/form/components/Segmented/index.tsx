import type { PropType } from 'vue'
import { computed, defineComponent, inject, useModel } from 'vue'
import { FieldSegmented } from '../../../field/components/segmented'
import type { ProFieldMode } from '../../../field/types'
import { EditOrReadOnlyContextKey } from '../../BaseForm/EditOrReadOnlyContext'
import {
    proFormFieldEmits,
    proFormFieldProps,
} from '../../utils/proFormFieldProps'
import { ProFormItem } from '../FormItem'

/**
 * ProFormSegmented 组件
 * 分段控制器表单字段，使用 FieldSegmented 组件
 */
export const ProFormSegmented = defineComponent({
  name: 'ProFormSegmented',
  inheritAttrs: false,
  props: {
    ...proFormFieldProps,
    options: {
      type: Array as PropType<
        Array<{ label: string; value: string | number; disabled?: boolean }>
      >,
      default: undefined,
    },
    fieldProps: {
      type: Object,
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
        <FieldSegmented
          v-model={modelValue.value}
          mode={currentMode.value}
          valueEnum={props.valueEnum}
          fieldProps={{
            ...props.fieldProps,
            options: props.options ?? props.fieldProps?.options
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
          addonBefore={props.addonBefore}
          addonAfter={props.addonAfter}
          addonWarpStyle={props.addonWarpStyle}
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

export default ProFormSegmented
