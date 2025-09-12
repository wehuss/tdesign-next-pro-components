import { RefreshIcon, SearchIcon, UnfoldLessIcon, UnfoldMoreIcon } from 'tdesign-icons-vue-next'
import { Button, Collapse, CollapsePanel, Space } from 'tdesign-vue-next'
import { defineComponent, ref } from 'vue'
import { BaseForm } from '../BaseForm/BaseForm'
import type { BaseFormProps } from '../typing'

export interface QueryFilterProps extends BaseFormProps {
  // 查询表单特有属性
  defaultCollapsed?: boolean
  collapsed?: boolean
  collapseRender?: (collapsed: boolean) => any
  optionRender?: (searchConfig: any, formProps: any, dom: any[]) => any
  searchText?: string
  resetText?: string
  submitButtonProps?: any
  resetButtonProps?: any
  onCollapse?: (collapsed: boolean) => void
  onSearch?: (values: any) => void
  onReset?: () => void
}

export const QueryFilter = defineComponent({
  name: 'QueryFilter',
  props: {
    // 继承 BaseForm 的所有属性
    ...BaseForm.props,
    // QueryFilter 特有属性
    defaultCollapsed: {
      type: Boolean,
      default: true,
    },
    collapsed: {
      type: Boolean,
    },
    collapseRender: {
      type: Function as () => (collapsed: boolean) => any,
    },
    optionRender: {
      type: Function as () => (searchConfig: any, formProps: any, dom: any[]) => any,
    },
    searchText: {
      type: String,
      default: '查询',
    },
    resetText: {
      type: String,
      default: '重置',
    },
    submitButtonProps: {
      type: Object,
    },
    resetButtonProps: {
      type: Object,
    },
    onCollapse: {
      type: Function as () => (collapsed: boolean) => void,
    },
    onSearch: {
      type: Function as () => (values: any) => void,
    },
    onReset: {
      type: Function as () => () => void,
    },
  },
  emits: ['update:collapsed', 'collapse', 'search', 'reset', 'finish'],
  setup(props, { slots, emit, expose }) {
    const formRef = ref()
    const internalCollapsed = ref(props.collapsed ?? props.defaultCollapsed)

    // 切换折叠状态
    const toggleCollapsed = () => {
      const newCollapsed = !internalCollapsed.value
      internalCollapsed.value = newCollapsed
      emit('update:collapsed', newCollapsed)
      if (props.onCollapse) {
        props.onCollapse(newCollapsed)
      }
      emit('collapse', newCollapsed)
    }

    // 处理搜索
    const handleSearch = async () => {
      try {
        const values = await formRef.value?.validate()
        if (props.onSearch) {
          props.onSearch(values)
        }
        emit('search', values)
        emit('finish', values)
      } catch (error) {
        console.error('Query filter search error:', error)
      }
    }

    // 处理重置
    const handleReset = () => {
      formRef.value?.reset()
      if (props.onReset) {
        props.onReset()
      }
      emit('reset')
      // 重置后自动搜索
      setTimeout(() => {
        handleSearch()
      }, 0)
    }

    // 暴露方法
    expose({
      submit: handleSearch,
      reset: handleReset,
      validate: () => formRef.value?.validate(),
      getFieldsValue: () => formRef.value?.getFieldsValue(),
      setFieldsValue: (values: any) => formRef.value?.setFieldsValue(values),
    })

    // 默认操作按钮
    const defaultActions = [
      <Button
        theme="primary"
        icon={() => <SearchIcon />}
        onClick={handleSearch}
        {...props.submitButtonProps}
      >
        {props.searchText}
      </Button>,
      <Button
        variant="outline"
        icon={() => <RefreshIcon />}
        onClick={handleReset}
        {...props.resetButtonProps}
      >
        {props.resetText}
      </Button>,
    ]

    // 折叠按钮
    const collapseButton = (
      <Button
        variant="text"
        icon={() => internalCollapsed.value ? <UnfoldMoreIcon /> : <UnfoldLessIcon />}
        onClick={toggleCollapsed}
      >
        {internalCollapsed.value ? '展开' : '收起'}
      </Button>
    )

    return () => (
      <div class="query-filter">
        <BaseForm
          ref={formRef}
          {...props}
          layout="inline"
          submitter={false} // 自定义提交按钮
          class="query-filter-form"
        >
          {/* 基础查询条件 */}
          <div class="query-filter-base">
            {slots.default?.()}
          </div>

          {/* 高级查询条件 */}
          {slots.collapsed && (
            <Collapse value={internalCollapsed.value ? [] : ['advanced']}>
              <CollapsePanel value="advanced" header="">
                <div class="query-filter-advanced">
                  {slots.collapsed?.()}
                </div>
              </CollapsePanel>
            </Collapse>
          )}

          {/* 操作按钮 */}
          <div class="query-filter-actions">
            <Space>
              {props.optionRender
                ? props.optionRender({}, props, defaultActions)
                : defaultActions
              }
              {slots.collapsed && (
                props.collapseRender
                  ? props.collapseRender(internalCollapsed.value)
                  : collapseButton
              )}
            </Space>
          </div>
        </BaseForm>
      </div>
    )
  },
})

export default QueryFilter