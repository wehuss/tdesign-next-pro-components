import { objectToMap, proFieldParsingText } from '@/utils'
import { Select } from 'tdesign-vue-next'
import type { PropType, VNode } from 'vue'
import { computed, defineComponent, inject, ref, useModel } from 'vue'
import type { ProFieldMode, ProFieldValueEnumType } from '../../../field/types'
import { EditOrReadOnlyContextKey } from '../../BaseForm/EditOrReadOnlyContext'
import type { SearchTransformKeyFn } from '../../FieldContext'
import { ProFormItem } from '../FormItem'

/**
 * 需要从 attrs 中过滤掉的属性列表
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
 * 选项类型
 */
interface SelectOption {
  label: string
  value: any
  disabled?: boolean
}

/**
 * ProFormSelect 组件
 * 支持 options、valueEnum、v-model 双向绑定
 */
export const ProFormSelect = defineComponent({
  name: 'ProFormSelect',
  inheritAttrs: false,
  props: {
    // 基础属性
    'name': [String, Array] as PropType<string | string[]>,
    'label': String,
    'rules': Array,
    'required': Boolean,
    'help': String,
    'extra': String,
    'width': [String, Number] as PropType<string | number>,
    'ignoreFormItem': Boolean,
    // valueType 和 valueEnum 支持
    'valueType': {
      type: String,
      default: 'select',
    },
    'valueEnum': {
      type: [Object, Map] as PropType<ProFieldValueEnumType>,
      default: undefined,
    },
    // 选项数据
    'options': {
      type: Array as PropType<SelectOption[]>,
      default: undefined,
    },
    // 值转换
    'transform': Function as PropType<SearchTransformKeyFn>,
    'convertValue': Function,
    'dataFormat': String,
    // 样式和布局
    'lightProps': Object,
    'addonBefore': [String, Object] as PropType<string | VNode>,
    'addonAfter': [String, Object] as PropType<string | VNode>,
    'addonWarpStyle': Object,
    'disabled': Boolean,
    'readonly': Boolean,
    'placeholder': {
      type: [String, Array] as PropType<string | string[]>,
      default: '请选择',
    },
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
  setup(props, { emit, attrs }) {
    // 使用 useModel 实现双向绑定
    const modelValue = useModel(props, 'modelValue')
    const selectRef = ref<InstanceType<typeof Select>>()

    // 获取编辑/只读模式上下文
    const editOrReadOnlyContext = inject(EditOrReadOnlyContextKey, {
      mode: 'edit',
    })

    // 计算当前模式
    const currentMode = computed<ProFieldMode>(() => {
      if (props.readonly) return 'read'
      const contextMode =
        typeof editOrReadOnlyContext.mode === 'object' &&
        'value' in editOrReadOnlyContext.mode
          ? editOrReadOnlyContext.mode.value
          : editOrReadOnlyContext.mode
      return (contextMode as ProFieldMode) || 'edit'
    })

    // 将 valueEnum 转换为 options
    const valueEnumOptions = computed<SelectOption[]>(() => {
      if (!props.valueEnum) return []

      const valueEnumMap = objectToMap(props.valueEnum)
      if (!valueEnumMap || valueEnumMap.size === 0) return []

      return Array.from(valueEnumMap.entries()).map(([value, config]) => {
        return {
          value,
          label:
            typeof config === 'string'
              ? config
              : (config as any)?.text || String(value),
          disabled:
            typeof config === 'object' ? (config as any)?.disabled : false,
        }
      })
    })

    // 合并 options：优先使用 props.options，其次使用 fieldProps.options，最后使用 valueEnum 转换的 options
    const mergedOptions = computed<SelectOption[]>(() => {
      if (props.options && props.options.length > 0) {
        return props.options
      }
      if (props.fieldProps?.options && props.fieldProps.options.length > 0) {
        return props.fieldProps.options
      }
      return valueEnumOptions.value
    })

    // 获取选中项的 label（用于 read 模式）
    const selectedLabel = computed(() => {
      const value = modelValue.value
      if (value === undefined || value === null) {
        return props.emptyText
      }

      // 如果有 valueEnum，使用 proFieldParsingText 解析
      if (props.valueEnum) {
        return proFieldParsingText(value, props.valueEnum)
      }

      // 否则从 options 中查找
      const options = mergedOptions.value
      if (Array.isArray(value)) {
        // 多选模式
        const labels = value
          .map(v => {
            const option = options.find(opt => opt.value === v)
            return option?.label || v
          })
          .join(', ')
        return labels || props.emptyText
      }

      // 单选模式
      const option = options.find(opt => opt.value === value)
      return option?.label || value || props.emptyText
    })

    // 处理值变更
    const handleChange = (value: any) => {
      modelValue.value = value
      emit('change', value)
    }

    return () => {
      // 过滤掉不需要传递给 ProFormItem 的 attrs
      const filteredAttrs = filterAttrs(attrs as Record<string, any>)

      // 渲染 Select 组件
      const renderSelect = () => {
        // 只读模式显示选项文本
        if (currentMode.value === 'read') {
          return <span class="pro-form-select-read">{selectedLabel.value}</span>
        }

        // 编辑模式显示下拉选择框
        const { allowClear, showSearch, mode, ...restFieldProps } =
          props.fieldProps || {}

        return (
          <Select
            ref={selectRef}
            value={modelValue.value}
            onChange={handleChange}
            options={mergedOptions.value}
            placeholder={
              Array.isArray(props.placeholder)
                ? props.placeholder[0]
                : props.placeholder
            }
            disabled={props.disabled}
            clearable={allowClear !== false}
            filterable={showSearch}
            multiple={mode === 'multiple' || mode === 'tags'}
            {...restFieldProps}
          />
        )
      }

      // 如果设置了 ignoreFormItem，直接渲染表单控件
      if (props.ignoreFormItem) {
        return renderSelect()
      }

      // 否则包装在 ProFormItem 中
      return (
        <ProFormItem
          name={props.name}
          label={props.label}
          rules={props.rules as any[]}
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
          {...filteredAttrs}
        >
          {renderSelect()}
        </ProFormItem>
      )
    }
  },
})

export default ProFormSelect
