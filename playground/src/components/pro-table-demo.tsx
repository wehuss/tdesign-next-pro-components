import ProTable from '@/components/table'
import type { ProColumn } from '@/components/table/types'
import { Button } from 'tdesign-vue-next'
import { defineComponent, ref } from 'vue'

interface TableData {
  id: number
  name: string
  age: number
  email: string
  status: string
  createTime: string
}

export default defineComponent({
  name: 'ProTableDemo',
  setup() {
    const loading = ref(false)
    const actionRef = ref()

    // 模拟数据
    const mockData: TableData[] = [
      {
        id: 1,
        name: '张三',
        age: 28,
        email: 'zhangsan@example.com',
        status: 'active',
        createTime: '2024-01-01',
      },
      {
        id: 2,
        name: '李四',
        age: 32,
        email: 'lisi@example.com',
        status: 'inactive',
        createTime: '2024-01-02',
      },
      {
        id: 3,
        name: '王五',
        age: 26,
        email: 'wangwu@example.com',
        status: 'active',
        createTime: '2024-01-03',
      },
    ]

    // 列配置
    const columns: ProColumn<TableData>[] = [
      {
        colKey: 'id',
        title: 'ID',
        width: 80,
        hideInSearch: true,
      },
      {
        colKey: 'name',
        title: '姓名',
        valueType: 'text',
      },
      {
        colKey: 'age',
        title: '年龄',
        valueType: 'digit',
        hideInSearch: true,
      },
      {
        colKey: 'email',
        title: '邮箱',
        valueType: 'text',
        hideInSearch: true,
      },
      {
        colKey: 'status',
        title: '状态',
        valueType: 'select',
        valueEnum: {
          active: {
            text: '激活',
            status: 'success',
          },
          inactive: {
            text: '禁用',
            status: 'error',
          },
        },
      },
      {
        colKey: 'createTime',
        title: '创建时间',
        valueType: 'date',
      },
      {
        colKey: 'actions',
        title: '操作',
        hideInSearch: true,
        render: () => (
          <div>
            <Button variant="text" size="small">
              编辑
            </Button>
            <Button variant="text" size="small" theme="danger">
              删除
            </Button>
          </div>
        ),
      },
    ]

    // 模拟请求
    const request = async (params: Record<string, unknown>) => {
      loading.value = true
      console.log('Request params:', params)

      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 1000))

      loading.value = false

      return {
        data: mockData,
        success: true,
        total: mockData.length,
      }
    }

    // 工具栏渲染
    const toolbarRender = () => [
      <Button theme="primary">新建用户</Button>,
      <Button>批量导出</Button>,
    ]

    return () => (
      <div style={{ padding: '24px' }}>
        <ProTable
          ref={actionRef}
          columns={columns}
          request={request}
          headerTitle={() => <Button>删除所有用户</Button>}
          rowKey="id"
          search={{
            labelWidth: 'auto',
            searchText: '查询',
            resetText: '重置',
          }}
          toolbarRender={toolbarRender}
          pagination={false}
        />
      </div>
    )
  },
})
