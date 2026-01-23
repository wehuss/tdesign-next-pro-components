/**
 * FormRender 搜索表单组件
 * 用于 ProTable 的搜索表单渲染
 * 参考 ant-design/pro-components Form 组件
 */

import type { PropType, VNode } from 'vue'
import { computed, defineComponent, ref, watch } from 'vue'
import { LightFilter, ProFormField, QueryFilter } from '../../../form'
import type { ProTableColumn, SearchConfig } from '../../types'
import './style.less'

export interface TableFormProps {
  columns: ProTableColumn[]
  search?: boolean | SearchConfig
  loading?: boolean
  onSubmit?: (values: Record<string, any>, firstLoad?: boolean) => void
  onReset?: (values: Record<string, any>) => void
  dateFormatter?: 'string' | 'number' | false
  type?: 'table' | 'form'
  formRef?: any
  manualRequest?: boolean
  bordered?: boolean
  ghost?: boolean
}

// 从列配置生成表单项
const genFormItemsFromColumns = (
  columns: ProTableColumn[],
  _type: string = 'table',
): { key: string; column: ProTableColumn }[] => {
  return columns
    .filter((column) => {
      // 只有配置了 form 属性的列才会在搜索表单中显示
      if (!column.form) return false
      // 如果明确设置 searchForm: false 则不显示
      if (column.form.searchForm === false) return false
      return true
    })
    .map((column, index) => ({
      key: column.colKey || String(index),
      column,
    }))
}

// 获取表单组件类型
const getFormCompetent = (
  isForm: boolean,
  searchConfig?: boolean | SearchConfig,
): 'Form' | 'LightFilter' | 'QueryFilter' => {
  if (!isForm && searchConfig !== false) {
    if (typeof searchConfig === 'object' && (searchConfig as any).filterType === 'light') {
      return 'LightFilter'
    }
    return 'QueryFilter'
  }
  return 'Form'
}

export default defineComponent({
  name: 'TableFormRender',
  props: {
    columns: {
      type: Array as PropType<ProTableColumn[]>,
      required: true,
    },
    search: {
      type: [Boolean, Object] as PropType<boolean | SearchConfig>,
      default: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    onSubmit: {
      type: Function as PropType<(values: Record<string, any>, firstLoad?: boolean) => void>,
    },
    onReset: {
      type: Function as PropType<(values: Record<string, any>) => void>,
    },
    dateFormatter: {
      type: [String, Boolean] as PropType<'string' | 'number' | false>,
      default: 'string',
    },
    type: {
      type: String as PropType<'table' | 'form'>,
      default: 'table',
    },
    formRef: Object,
    manualRequest: {
      type: Boolean,
      default: false,
    },
    bordered: {
      type: Boolean,
      default: false,
    },
    ghost: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['submit', 'reset'],
  setup(props, { emit, expose }) {
    const internalFormRef = ref()
    const isFirstLoad = ref(true)

    // 表单数据 ref - 用于存储表单值
    const formData = ref<Record<string, any>>({})

    // 监听 formRef
    watch(
      () => internalFormRef.value,
      (newRef) => {
        if (props.formRef && newRef) {
          props.formRef.value = newRef
        }
      },
    )

    // 是否是表单模式
    const isForm = computed(() => props.type === 'form')

    // 获取表单组件类型
    const competentName = computed(() => getFormCompetent(isForm.value, props.search))

    // 生成表单项
    const formItems = computed(() => genFormItemsFromColumns(props.columns, props.type))

    // 根据 column.form.defaultValue 初始化 formData
    watch(
      formItems,
      (items) => {
        const defaultData: Record<string, any> = {}
        items.forEach(({ key, column }) => {
          const form = column.form
          if (form?.defaultValue !== undefined) {
            defaultData[key] = form.defaultValue
          }
        })
        // 合并默认值，保留已有值
        formData.value = { ...defaultData, ...formData.value }
      },
      { immediate: true },
    )

    // 处理提交
    const handleSubmit = (_values: Record<string, any>) => {
      const firstLoad = isFirstLoad.value
      isFirstLoad.value = false

      emit('submit', { ...formData.value }, firstLoad)
    }

    // 处理重置
    const handleReset = (values: Record<string, any>) => {
      emit('reset', values)
      props.onReset?.(values)
    }

    // 暴露方法
    expose({
      submit: () => internalFormRef.value?.submit?.(),
      reset: () => internalFormRef.value?.reset?.(),
      getFieldsValue: () => internalFormRef.value?.getFieldsValue?.(),
      setFieldsValue: (values: Record<string, any>) =>
        internalFormRef.value?.setFieldsValue?.(values),
      validate: () => internalFormRef.value?.validate?.(),
    })

    // 渲染表单项
    const renderFormItems = (): VNode[] => {
      return formItems.value.map(({ key, column }) => {
        const form = column.form
        // 从 form 配置中获取 valueType，如果未配置则使用列的 valueType，默认为 'text'
        const valueType = form?.valueType || column.valueType || 'text'

        return (
          <ProFormField
            key={key}
            name={column.colKey}
            label={column.title as string}
            valueType={valueType as 'text'}
            valueEnum={form?.valueEnum || column.valueEnum}
            fieldProps={form?.fieldProps}
            formItemProps={form}
            placeholder={form?.placeholder}
            rules={form?.rules}
            required={form?.required}
            disabled={form?.disabled}
            readonly={form?.readonly}
            colSize={form?.colSize}
            v-model={formData.value[column.colKey as string]}
          />
        ) as VNode
      })
    }
    // 获取搜索配置
    const getSearchConfig = () => {
      if (typeof props.search === 'object') {
        return props.search
      }
      return {}
    }

    return () => {
      if (props.search === false) {
        return null
      }

      const searchConfig = getSearchConfig()
      const FormComponent = competentName.value === 'LightFilter' ? LightFilter : QueryFilter

      return (
        <FormComponent
          ref={internalFormRef}
          {...searchConfig}
          data={formData.value}
          submitButtonProps={{
            loading: props.loading,
            ...(searchConfig as any).submitButtonProps,
          }}
          onSearch={handleSubmit}
          onReset={handleReset}
          // onFinish={handleSubmit}
        >
          {renderFormItems()}
        </FormComponent>
      )
    }
  },
})
