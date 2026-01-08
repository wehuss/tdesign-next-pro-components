import {
  computed,
  defineComponent,
  inject,
  onBeforeUnmount,
  onMounted,
  useModel,
  watch,
} from 'vue'
import type { ProFieldValueEnumType } from '../../field/types'
import { EditOrReadOnlyContextKey } from '../BaseForm/EditOrReadOnlyContext'
import { ProFormItem } from '../components/form-item'
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
 * 需要从 attrs 中过滤掉的属性列表
 * 这些属性通常来自 ProTable columns 配置，不应该传递给表单项
 */
const FILTERED_ATTRS = [
  'title',
  'description',
  'dataIndex',
  'key',
  'hideInTable',
  'hideInSearch',
  'hideInForm',
  'sorter',
  'filters',
  'ellipsis',
  'copyable',
  'order',
  'search',
  'editable',
  'fixed',
  'align',
  'className',
  'render',
  'renderText',
  'renderFormItem',
  'children',
  'onFilter',
  'onCell',
  'onHeaderCell',
]

/**
 * 过滤掉不需要传递给表单项的属性
 */
function filterAttrs(attrs: Record<string, any>): Record<string, any> {
  const result: Record<string, any> = {}
  for (const key of Object.keys(attrs)) {
    if (!FILTERED_ATTRS.includes(key)) {
      result[key] = attrs[key]
    }
  }
  return result
}

/**
 * 创建表单字段组件的工厂函数
 * 支持 valueType、valueEnum、表单上下文集成
 *
 * 注意：Vue 组件不支持将泛型作为 props 传递，因此这里不使用泛型参数
 */
export function createField(config: CreateFieldConfig) {
  return defineComponent({
    name: config.name,
    inheritAttrs: false,
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
      // 初始值（用于重置）
      'initialValue': null,
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

      // 注册字段到表单上下文
      let unregisterField: (() => void) | undefined

      onMounted(() => {
        if (fieldContext.registerField && props.name) {
          unregisterField = fieldContext.registerField({
            name: props.name,
            getValue: () => modelValue.value,
            setValue: (value: any) => {
              modelValue.value = value
            },
            initialValue: props.initialValue,
            valueType: props.valueType,
            dateFormat: props.dataFormat,
            transform: props.transform,
          })
        }
      })

      // 组件卸载时注销字段
      onBeforeUnmount(() => {
        if (unregisterField) {
          unregisterField()
        }
      })

      // 监听值变化，通知表单上下文
      watch(
        () => modelValue.value,
        newValue => {
          // 触发 change 事件
          emit('change', newValue)
        }
      )

      return () => {
        const renderProps = {
          ...props,
          modelValue,
          mode: currentMode.value,
          fieldProps: mergedFieldProps.value,
        }

        // 如果设置了 ignoreFormItem，直接渲染表单控件
        if (props.ignoreFormItem) {
          return config.renderFormItem(renderProps, { slots, emit })
        }

        // 过滤掉不需要传递给 ProFormItem 的 attrs
        // 这些属性通常来自 ProTable columns 配置
        const filteredAttrs = filterAttrs(attrs as Record<string, any>)

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
            secondary={props.secondary}
            colProps={props.colProps}
            {...mergedFormItemProps.value}
            {...filteredAttrs}
          >
            {config.renderFormItem(renderProps, { slots, emit })}
          </ProFormItem>
        )
      }
    },
  })
}
