import { computed, defineComponent, inject, useModel } from 'vue'
import type { ProFieldValueEnumType } from '../../field/types'
import { EditOrReadOnlyContextKey } from '../BaseForm/EditOrReadOnlyContext'
import { ProFormItem } from '../components/FormItem'
import { useFieldContext } from '../FieldContext'

/**
 * 创建表单字段组件的配置
 */
export interface CreateFieldConfig {
  /** 组件名称 */
  name: string
  /** 渲染表单项的函数 */
  renderFormItem: (props: any, context: any) => any
  /** 默认的 valueType */
  valueType?: string
  /** 是否忽略默认宽度 */
  ignoreWidth?: boolean
  /** 自定义 lightMode */
  customLightMode?: boolean
}

/**
 * 创建表单字段组件的工厂函数
 * 支持 valueType、valueEnum、表单上下文集成
 */
export function createField<T = any>(config: CreateFieldConfig) {
  return defineComponent({
    name: config.name,
    props: {
      // 基础属性
      'name': [String, Array],
      'label': String,
      'rules': Array,
      'required': Boolean,
      'help': String,
      'extra': String,
      'width': [String, Number],
      'ignoreFormItem': Boolean,
      // valueType 和 valueEnum 支持
      'valueType': {
        type: String,
        default: config.valueType,
      },
      'valueEnum': {
        type: [Object, Map] as unknown as () => ProFieldValueEnumType,
        default: undefined,
      },
      // 值转换
      'transform': Function,
      'convertValue': Function,
      'dataFormat': String,
      // 样式和布局
      'lightProps': Object,
      'addonBefore': [String, Object],
      'addonAfter': [String, Object],
      'addonWarpStyle': Object,
      'disabled': Boolean,
      'readonly': Boolean,
      'placeholder': [String, Array],
      'emptyText': {
        type: String,
        default: '-',
      },
      'secondary': Boolean,
      'colProps': Object,
      'rowProps': Object,
      // 字段属性
      'fieldProps': {
        type: Object,
        default: () => ({}),
      },
      'formItemProps': {
        type: Object,
        default: () => ({}),
      },
      // 选项数据
      'options': Array,
      // 请求相关
      'request': Function,
      'params': Object,
      'debounceTime': {
        type: Number,
        default: 300,
      },
      // ProField 属性
      'proFieldProps': Object,
      // v-model
      'modelValue': null,
      'onUpdate:modelValue': Function,
      'onChange': Function,
      'onBlur': Function,
      'onFocus': Function,
    },
    emits: ['update:modelValue', 'change', 'blur', 'focus'],
    setup(props: any, { slots, emit, attrs }) {
      // 使用 useModel 实现双向绑定
      const modelValue = useModel(props, 'modelValue')

      // 获取表单上下文
      const fieldContext = useFieldContext()

      // 获取编辑/只读模式上下文
      const editOrReadOnlyContext = inject(EditOrReadOnlyContextKey, {
        mode: 'edit',
      })

      // 计算当前模式
      const currentMode = computed(() => {
        if (props.readonly) return 'read'
        const contextMode =
          typeof editOrReadOnlyContext.mode === 'object' &&
          'value' in editOrReadOnlyContext.mode
            ? editOrReadOnlyContext.mode.value
            : editOrReadOnlyContext.mode
        return contextMode || 'edit'
      })

      // 合并 fieldProps
      const mergedFieldProps = computed(() => ({
        ...fieldContext.fieldProps,
        ...props.fieldProps,
      }))

      // 合并 formItemProps
      const mergedFormItemProps = computed(() => ({
        ...fieldContext.formItemProps,
        ...props.formItemProps,
      }))

      // 注册字段类型到上下文
      if (fieldContext.setFieldValueType && props.name) {
        const namePath = Array.isArray(props.name) ? props.name : [props.name]
        fieldContext.setFieldValueType(namePath, {
          valueType: props.valueType,
          dateFormat: props.dataFormat,
          transform: props.transform,
        })
      }

      return () => {
        const renderProps = {
          ...props,
          modelValue: modelValue.value,
          mode: currentMode.value,
          fieldProps: mergedFieldProps.value,
        }

        // 如果设置了 ignoreFormItem，直接渲染表单控件
        if (props.ignoreFormItem) {
          return config.renderFormItem(renderProps, { slots, emit })
        }

        // 否则包装在 ProFormItem 中
        return (
          <ProFormItem
            name={props.name}
            label={props.label}
            rules={props.rules}
            required={props.required}
            help={props.help}
            extra={props.extra}
            width={props.width}
            valueType={props.valueType}
            transform={props.transform}
            dataFormat={props.dataFormat}
            lightProps={props.lightProps}
            addonBefore={props.addonBefore}
            addonAfter={props.addonAfter}
            addonWarpStyle={props.addonWarpStyle}
            secondary={props.secondary}
            colProps={props.colProps}
            {...mergedFormItemProps.value}
            {...attrs}
          >
            {config.renderFormItem(renderProps, { slots, emit })}
          </ProFormItem>
        )
      }
    },
  })
}
