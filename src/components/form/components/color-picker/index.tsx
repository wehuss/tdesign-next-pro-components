import type { ColorPickerProps } from 'tdesign-vue-next'
import type { PropType } from 'vue'
import { computed, defineComponent, inject, useModel } from 'vue'
import { FieldColorPicker } from '../../../field/components/color-picker'
import type { ProFieldMode } from '../../../field/types'
import { EditOrReadOnlyContextKey } from '../../BaseForm/EditOrReadOnlyContext'
import {
  proFormFieldEmits,
  proFormFieldProps,
} from '../../utils/proFormFieldProps'
import { ProFormItem } from '../form-item'

/**
 * ProFormColorPicker 组件
 * 颜色选择器表单字段，使用 FieldColorPicker 组件
 */
export const ProFormColorPicker = defineComponent({
  name: 'ProFormColorPicker',
  inheritAttrs: false,
  props: {
    ...proFormFieldProps,
    format: String as PropType<'hex' | 'rgb' | 'hsl'>,
    showText: Boolean,
    fieldProps: {
      type: Object as PropType<ColorPickerProps>,
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
        <FieldColorPicker
          v-model={modelValue.value}
          mode={currentMode.value}
          fieldProps={{
            ...props.fieldProps,
            format: props.format ?? props.fieldProps?.format,
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

export default ProFormColorPicker
