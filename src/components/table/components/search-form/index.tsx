import { RefreshIcon, SearchIcon } from 'tdesign-icons-vue-next'
import { Button, Form, Space } from 'tdesign-vue-next'
import type { PropType } from 'vue'
import { computed, defineComponent, ref } from 'vue'
import type { ProTableColumn, SearchConfig } from '../../types'

export default defineComponent({
  name: 'SearchForm',
  props: {
    columns: {
      type: Array as PropType<ProTableColumn[]>,
      required: true,
    },
    search: {
      type: [Boolean, Object] as PropType<boolean | SearchConfig>,
      default: true,
    },
  },
  emits: ['submit', 'reset'],
  setup(props, { emit, expose }) {
    const formRef = ref()
    const formData = ref<Record<string, unknown>>({})

    // 搜索列配置
    const searchColumns = computed(() => {
      return props.columns
        ?.filter(column => !column.hideInSearch && column.search !== false)
        .slice(0, 3) // 暂时只显示前3个字段
    })

    // 搜索配置
    const searchConfig = computed(() => {
      if (typeof props.search === 'boolean') {
        return {}
      }
      return props.search || {}
    })

    // 处理搜索
    const handleSubmit = () => {
      emit('submit', { ...formData.value })
    }

    // 处理重置
    const handleReset = () => {
      formData.value = {}
      emit('reset')
    }

    // 暴露方法
    expose({
      submit: handleSubmit,
      reset: handleReset,
      getFormData: () => formData.value,
      setFormData: (data: Record<string, unknown>) => {
        Object.assign(formData.value, data)
      },
    })

    return () => {
      const { search } = props

      if (search === false) {
        return null
      }

      const config = searchConfig.value
      const columns = searchColumns.value

      if (columns.length === 0) {
        return null
      }

      return (
        <div class="t-pro-table-search">
          <Form
            ref={formRef}
            data={formData.value}
            labelWidth={config.labelWidth || 'auto'}
            layout="inline"
            class="t-pro-table-search-form"
          >
            {columns.map((column, index) => (
              <Form.FormItem
                key={column.colKey || index}
                label={column.title}
                name={column.colKey}
              >
                <div>搜索字段：{column.title}</div>
              </Form.FormItem>
            ))}

            <Form.FormItem class="t-pro-table-search-actions">
              <Space size="small">
                <Button
                  theme="primary"
                  icon={() => <SearchIcon />}
                  onClick={handleSubmit}
                >
                  {config.searchText || '搜索'}
                </Button>
                <Button
                  variant="base"
                  icon={() => <RefreshIcon />}
                  onClick={handleReset}
                >
                  {config.resetText || '重置'}
                </Button>
              </Space>
            </Form.FormItem>
          </Form>
        </div>
      )
    }
  },
})
