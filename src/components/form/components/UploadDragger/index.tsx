import { Upload } from 'tdesign-vue-next'
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
 * ProFormUploadDragger 组件
 * 拖拽上传表单字段，继承 TDesign Upload 的所有 props
 */
export const ProFormUploadDragger = defineComponent({
  name: 'ProFormUploadDragger',
  extends: Upload,
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

      const renderUpload = () => {
        if (currentMode.value === 'read') {
          const files = modelValue.value as any[]
          if (!files || files.length === 0) {
            return (
              <span class="pro-form-upload-dragger-read">
                {proFormProps.emptyText}
              </span>
            )
          }
          return (
            <span class="pro-form-upload-dragger-read">
              {files.map(file => file.name || file.url).join(', ')}
            </span>
          )
        }

        return (
          <Upload
            v-model={modelValue.value}
            theme="custom"
            draggable
            {...componentProps}
            {...filteredAttrs}
          >
            {slots.default?.() || (
              <div class="pro-form-upload-dragger-trigger">
                <p>点击或拖拽文件到此区域上传</p>
              </div>
            )}
          </Upload>
        )
      }

      if (proFormProps.ignoreFormItem) {
        return renderUpload()
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
          {renderUpload()}
        </ProFormItem>
      )
    }
  },
})

export default ProFormUploadDragger
