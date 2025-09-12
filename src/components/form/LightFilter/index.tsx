import { RefreshIcon } from 'tdesign-icons-vue-next'
import { Button, Space, Tag } from 'tdesign-vue-next'
import { computed, defineComponent, ref } from 'vue'
import { BaseForm } from '../BaseForm/BaseForm'
import type { BaseFormProps } from '../typing'

export interface LightFilterProps extends BaseFormProps {
  // 轻量筛选器特有属性
  placement?: 'bottomLeft' | 'bottomRight' | 'topLeft' | 'topRight'
  footerRender?: (onConfirm: () => void, onClear: () => void) => any
  onFinish?: (values: any) => void
  onReset?: () => void
  onValuesChange?: (changedValues: any, allValues: any) => void
}

export const LightFilter = defineComponent({
  name: 'LightFilter',
  props: {
    // 继承 BaseForm 的所有属性
    ...BaseForm.props,
    // LightFilter 特有属性
    placement: {
      type: String as () => 'bottomLeft' | 'bottomRight' | 'topLeft' | 'topRight',
      default: 'bottomLeft',
    },
    footerRender: Function,
    onFinish: Function,
    onReset: Function,
    onValuesChange: Function,
  },
  emits: ['finish', 'reset', 'valuesChange'],
  setup(props, { slots, emit, expose }) {
    const formRef = ref()
    const formValues = ref<any>({})

    // 处理表单值变化
    const handleValuesChange = (changedValues: any, allValues: any) => {
      formValues.value = allValues
      if (props.onValuesChange) {
        props.onValuesChange(changedValues, allValues)
      }
      emit('valuesChange', changedValues, allValues)
      
      // 自动提交
      if (props.onFinish) {
        props.onFinish(allValues)
      }
      emit('finish', allValues)
    }

    // 处理重置
    const handleReset = () => {
      formRef.value?.reset()
      formValues.value = {}
      if (props.onReset) {
        props.onReset()
      }
      emit('reset')
    }

    // 清除单个筛选项
    const clearFilter = (field: string) => {
      formRef.value?.setFieldValue(field, undefined)
    }

    // 获取激活的筛选项
    const activeFilters = computed(() => {
      const filters: Array<{ field: string; label: string; value: any }> = []
      Object.keys(formValues.value || {}).forEach(field => {
        const value = formValues.value[field]
        if (value !== undefined && value !== null && value !== '') {
          filters.push({
            field,
            label: field, // 这里可以根据实际需求获取字段的显示名称
            value,
          })
        }
      })
      return filters
    })

    // 暴露方法
    expose({
      reset: handleReset,
      getFieldsValue: () => formRef.value?.getFieldsValue(),
      setFieldsValue: (values: any) => formRef.value?.setFieldsValue(values),
    })

    return () => (
      <div class="light-filter">
        {/* 筛选标签 */}
        {activeFilters.value.length > 0 && (
          <div class="light-filter-tags" style={{ marginBottom: '16px' }}>
            <Space breakLine>
              {activeFilters.value.map(filter => (
                <Tag
                  key={filter.field}
                  closable
                  onClose={() => clearFilter(filter.field)}
                >
                  {filter.label}: {String(filter.value)}
                </Tag>
              ))}
              {activeFilters.value.length > 0 && (
                <Button
                  variant="text"
                  size="small"
                  icon={() => <RefreshIcon />}
                  onClick={handleReset}
                >
                  清空
                </Button>
              )}
            </Space>
          </div>
        )}

        {/* 表单 */}
        <BaseForm
          ref={formRef}
          {...props}
          layout="inline"
          submitter={false}
          onValuesChange={handleValuesChange}
          class="light-filter-form"
        >
          {slots.default?.()}
        </BaseForm>
      </div>
    )
  },
})

export default LightFilter