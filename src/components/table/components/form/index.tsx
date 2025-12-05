/**
 * FormRender 搜索表单组件
 * 用于 ProTable 的搜索表单渲染
 * 参考 ant-design/pro-components Form 组件
 */

import type { PropType, VNode } from 'vue'
import { computed, defineComponent, ref, watch } from 'vue'
import { LightFilter, QueryFilter } from '../../../form'
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
  type: string = 'table'
): { key: string; column: ProTableColumn }[] => {
  return columns
    .filter(column => {
      // 过滤掉不需要在搜索表单中显示的列
      if (column.form?.searchForm === false) return false
      if (type === 'form' && column.form?.searchForm === false) return false
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
  searchConfig?: boolean | SearchConfig
): 'Form' | 'LightFilter' | 'QueryFilter' => {
  if (!isForm && searchConfig !== false) {
    if (
      typeof searchConfig === 'object' &&
      (searchConfig as any).filterType === 'light'
    ) {
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
      type: Function as PropType<
        (values: Record<string, any>, firstLoad?: boolean) => void
      >,
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

    // 监听 formRef
    watch(
      () => internalFormRef.value,
      newRef => {
        if (props.formRef && newRef) {
          props.formRef.value = newRef
        }
      }
    )

    // 是否是表单模式
    const isForm = computed(() => props.type === 'form')

    // 获取表单组件类型
    const competentName = computed(() =>
      getFormCompetent(isForm.value, props.search)
    )

    // 生成表单项
    const formItems = computed(() =>
      genFormItemsFromColumns(props.columns, props.type)
    )

    // 处理提交
    const handleSubmit = (values: Record<string, any>) => {
      const firstLoad = isFirstLoad.value
      isFirstLoad.value = false

      emit('submit', values, firstLoad)
      props.onSubmit?.(values, firstLoad)
    }

    // 处理重置
    const handleReset = (values: Record<string, any>) => {
      emit('reset', values)
      props.onReset?.(values)
    }

    // 初始化时触发一次提交（如果不是手动请求模式）
    const handleInit = (values: Record<string, any>) => {
      if (!props.manualRequest && props.type !== 'form') {
        handleSubmit(values)
      }
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
        const valueType = column.valueType || 'text'
        const formConfig = column.form || {}

        // 这里简化处理，实际应该根据 valueType 渲染对应的表单组件
        // 完整实现需要集成 ProFormField 组件
        return (
          <div key={key} class="t-pro-table-form-item">
            {/* 表单项占位，实际应该渲染 ProFormField */}
            <span data-value-type={valueType} data-form-config={formConfig}>
              {column.title}
            </span>
          </div>
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
      const FormComponent =
        competentName.value === 'LightFilter' ? LightFilter : QueryFilter

      return (
        <div
          class={[
            't-pro-table-search',
            {
              't-pro-table-search-bordered': props.bordered,
              't-pro-table-search-ghost': props.ghost,
            },
          ]}
        >
          <FormComponent
            ref={internalFormRef}
            {...searchConfig}
            submitButtonProps={{
              loading: props.loading,
              ...(searchConfig as any).submitButtonProps,
            }}
            onSearch={handleSubmit}
            onReset={handleReset}
            onFinish={handleSubmit}
          >
            {renderFormItems()}
          </FormComponent>
        </div>
      )
    }
  },
})
