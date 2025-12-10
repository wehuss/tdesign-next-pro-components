import type { UploadProps } from 'tdesign-vue-next'
import { Upload } from 'tdesign-vue-next'
import type { PropType } from 'vue'
import { computed, defineComponent, inject, useModel } from 'vue'
import type { ProFieldMode } from '../../../field/types'
import { EditOrReadOnlyContextKey } from '../../BaseForm/EditOrReadOnlyContext'
import {
    proFormFieldEmits,
    proFormFieldProps,
} from '../../utils/proFormFieldProps'
import { ProFormItem } from '../FormItem'

/**
 * ProFormUploadDragger 组件
 * 拖拽上传表单字段，使用 TDesign Upload 组件
 */
export const ProFormUploadDragger = defineComponent({
  name: 'ProFormUploadDragger',
  inheritAttrs: false,
  props: {
    ...proFormFieldProps,
    accept: String,
    multiple: Boolean,
    action: String,
    autoUpload: {
      type: Boolean,
      default: true,
    },
    max: Number,
    fieldProps: {
      type: Object as PropType<UploadProps>,
      default: () => ({}),
    },
  },
  emits: [...proFormFieldEmits],
  setup(props, { slots, attrs }) {
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
      const renderField = () => {
        if (currentMode.value === 'read') {
          const files = modelValue.value as any[]
          if (!files || files.length === 0) {
            return (
              <span class="pro-form-upload-dragger-read">
                {props.fieldProps?.tips || props.emptyText || '-'}
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
            accept={props.accept}
            multiple={props.multiple}
            action={props.action}
            autoUpload={props.autoUpload}
            max={props.max}
            {...props.fieldProps}
            {...attrs}
          >
            {slots.default?.() || (
              <div class="pro-form-upload-dragger-trigger">
                <p>点击或拖拽文件到此区域上传</p>
              </div>
            )}
          </Upload>
        )
      }

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

export default ProFormUploadDragger
