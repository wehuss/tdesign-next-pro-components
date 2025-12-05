import { Switch } from 'tdesign-vue-next'
import { computed, defineComponent, inject, useModel } from 'vue'
import type { ProFieldMode } from '../../../field/types'
import { EditOrReadOnlyContextKey } from '../../BaseForm/EditOrReadOnlyContext'
import {
    extractProFormProps,
    filterAttrs,
    proFormFieldEmits,
    proFormFieldProps,
} from '../../utils/proFormFieldProps'
import { ProFormItem } from '../FormItem'

/**
 * ProFormSwitch 组件
 * 开关表单字段，继承 TDesign Switch 的所有 props
 */
export const ProFormSwitch = defineComponent({
  name: 'ProFormSwitch',
  extends: Switch,
  inheritAttrs: false,
  props: {
    ...proFormFieldProps,
  },
  emits: [...proFormFieldEmits],
  setup(props, { slots, emit, attrs }) {
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
      const { proFormProps, componentProps } = extractProFormProps(props)
      const filteredAttrs = filterAttrs(attrs as Record<string, any>)

      const renderSwitch = () => {
        if (currentMode.value === 'read') {
          return (
            <span class="pro-form-switch-read">
              {modelValue.value ? '是' : '否'}
            </span>
          )
        }

        return (
          <Switch
            v-model={modelValue.value}
            {...componentProps}
            {...filteredAttrs}
          />
        )
      }

      if (proFormProps.ignoreFormItem) {
        return renderSwitch()
      }

      return (
        <ProFormItem
          name={proFormProps.name}
          label={proFormProps.label}
          rules={proFormProps.rules}
          required={proFormProps.required}
          help={proFormProps.help}
          extra={proFormProps.extra}
          width={proFormProps.width}
          transform={proFormProps.transform}
          dataFormat={proFormProps.dataFormat}
          lightProps={proFormProps.lightProps}
          addonBefore={proFormProps.addonBefore}
          addonAfter={proFormProps.addonAfter}
          addonWarpStyle={proFormProps.addonWarpStyle}
          secondary={proFormProps.secondary}
          colProps={proFormProps.colProps}
          {...proFormProps.formItemProps}
        >
          {renderSwitch()}
        </ProFormItem>
      )
    }
  },
})

export default ProFormSwitch
