import { Button, Space } from 'tdesign-vue-next'
import { defineComponent, ref } from 'vue'
import ProTable from '../components/table'

// 模拟用户数据类型
interface User {
  id: number
  name: string
  age: number
  email: string
  status: 'active' | 'inactive'
}

// 模拟数据源
const mockData: User[] = Array.from({ length: 50 }, (_, index) => ({
  id: index + 1,
  name: `用户${index + 1}`,
  age: 20 + (index % 40),
  email: `user${index + 1}@example.com`,
  status: index % 3 === 0 ? 'inactive' : 'active',
}))

// 模拟API请求函数
const fetchUsers = async (params: {
  current: number
  pageSize: number
  name?: string
}) => {
  console.log('请求参数:', params)

  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 1000))

  let filteredData = [...mockData]

  // 模拟名称搜索
  if (params.name) {
    filteredData = filteredData.filter(user => user.name.includes(params.name!))
  }

  // 模拟分页
  const { current = 1, pageSize = 10 } = params
  const start = (current - 1) * pageSize
  const end = start + pageSize
  const pageData = filteredData.slice(start, end)

  return {
    data: pageData,
    success: true,
    total: filteredData.length,
  }
}

export default defineComponent({
  name: 'ProTableExample',
  setup() {
    const tableRef = ref()

    // 表格列定义
    const columns = [
      {
        colKey: 'id',
        title: 'ID',
        width: 80,
        align: 'center' as const,
      },
      {
        colKey: 'name',
        title: '姓名',
        width: 120,
      },
      {
        colKey: 'age',
        title: '年龄',
        width: 80,
        align: 'center' as const,
      },
      {
        colKey: 'email',
        title: '邮箱',
        ellipsis: true,
      },
      {
        colKey: 'status',
        title: '状态',
        width: 100,
        align: 'center' as const,
        cell: (_: unknown, { row }: { row: User }) => {
          return row.status === 'active' ? '激活' : '禁用'
        },
      },
    ]

    const handleReload = () => {
      tableRef.value?.reload()
    }

    const handleReset = () => {
      tableRef.value?.reloadAndReset()
    }

    return () => (
      <div style={{ padding: '24px' }}>
        <h1>ProTable 数据请求演示</h1>

        <div style={{ marginBottom: '16px' }}>
          <Space>
            <Button onClick={handleReload}>刷新</Button>
            <Button theme="default" onClick={handleReset}>
              重置
            </Button>
          </Space>
        </div>

        <ProTable
          ref={tableRef}
          rowKey="id"
          columns={columns as any}
          request={fetchUsers}
          pagination={{
            defaultPageSize: 10,
            showJumper: true,
            pageSizeOptions: [5, 10, 20],
          }}
        />
      </div>
    )
  },
})
