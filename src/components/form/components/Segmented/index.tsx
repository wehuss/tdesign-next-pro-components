import { FieldSegmented } from '@/components/field/components/segmented'
import { computed, defineComponent, inject, useModel, type PropType } from 'vue'
import type { ProFieldValueEnumType } from '../../../field/types'
import { EditOrReadOnlyContextKey } from '../../BaseForm/EditOrReadOnlyContext'
import { useFieldContext } from '../../FieldContext'
import { ProFormItem } from '../FormItem'

/**
 * ProFormSegmented - 分段控制器表单组件
 * 基于 FieldSegmented 组件，集成表单功能
 */
export const ProFormSegmented = defineComponent({
  name: 'ProFormSegmented',
  props: {
    // 基础属性
    'name': [String, Array] as PropType<string | string[]>,
    'label': String,
    'rules': Array,
    'required': Boolean,
    'help': String,
    'extra': String,
    'width': [String, Number],
    'ignoreFormItem': Boolean,
    'disabled': Boolean,
    'readonly': Boolean,
    // 选项
    'options': {
      type: Array as PropType<
        Array<{ label: string; value: string | number; disabled?: boolean }>
      >,
      default: () => [],
    },
    'valueEnum': {
      type: [Object, Map] as unknown as () => ProFieldValueEnumType,
      default: undefined,
    },
    // 字段属性
    'fieldProps': {
      type: Object,
      default: () => ({}),
    },
    // ProField 属性
    'proFieldProps': {
      type: Object,
      default: () => ({}),
    },
    // 请求相关
    'request': Function,
    'params': Object,
    // v-model
    'modelValue': [String, Number],
    'onUpdate:modelValue': Function,
  },
  emits: ['update:modelValue', 'change'],
  setup(props) {
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

    // 注册字段类型到上下文
    if (fieldContext.setFieldValueType && props.name) {
      const namePath = Array.isArray(props.name) ? props.name : [props.name]
      fieldContext.setFieldValueType(namePath, {
        valueType: 'segmented',
      })
    }

    return () => {
      const segmentedNode = (
        <FieldSegmented
          v-model={modelValue.value}
          mode={currentMode.value}
          options={props.options}
          valueEnum={props.valueEnum}
          disabled={props.disabled}
          readonly={props.readonly}
          fieldProps={mergedFieldProps.value}
          {...props.proFieldProps}
        />
      )

      // 如果忽略 FormItem，直接返回分段控制器
      if (props.ignoreFormItem) {
        return segmentedNode
      }

      // 包装在 ProFormItem 中
      return (
        <ProFormItem
          name={props.name}
          label={props.label}
          rules={props.rules as any}
          required={props.required}
          help={props.help}
          extra={props.extra}
          width={props.width}
          valueType="segmented"
        >
          {segmentedNode}
        </ProFormItem>
      )
    }
  },
})

export default ProFormSegmented
