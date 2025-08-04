import { Button, Space, Tag } from 'tdesign-vue-next'
import { defineComponent, ref } from 'vue'
import ProTable from '../components/table'

interface UserData {
  id: number
  name: string
  age: number
  email: string
  status: 'active' | 'inactive'
}

// 模拟数据
const mockUsers: UserData[] = Array.from({ length: 100 }, (_, index) => ({
  id: index + 1,
  name: `用户${index + 1}`,
  age: 20 + (index % 40),
  email: `user${index + 1}@example.com`,
  status: index % 3 === 0 ? 'inactive' : 'active',
}))

// 模拟 API 请求
const mockRequest = async (params: {
  current: number
  pageSize: number
  name?: string
  status?: string
}) => {
  console.log('Request params:', params)

  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 800))

  let filteredData = [...mockUsers]

  // 模拟搜索过滤
  if (params.name) {
    filteredData = filteredData.filter(user => user.name.includes(params.name!))
  }

  if (params.status) {
    filteredData = filteredData.filter(user => user.status === params.status)
  }

  // 模拟分页
  const { current = 1, pageSize = 20 } = params
  const start = (current - 1) * pageSize
  const end = start + pageSize
  const data = filteredData.slice(start, end)

  return {
    data,
    success: true,
    total: filteredData.length,
  }
}

export default defineComponent({
  name: 'ProTableRequestDemo',
  setup() {
    const actionRef = ref()

    const columns = [
      {
        colKey: 'id',
        title: 'ID',
        width: 80,
        align: 'center',
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
        align: 'center',
      },
      {
        colKey: 'email',
        title: '邮箱',
        width: 200,
        ellipsis: true,
      },
      {
        colKey: 'status',
        title: '状态',
        width: 100,
        align: 'center',
        cell: (_: unknown, { row }: { row: UserData }) => {
          const statusConfig = {
            active: { text: '激活', theme: 'success' as const },
            inactive: { text: '禁用', theme: 'danger' as const },
          }
          const config = statusConfig[row.status]
          return <Tag theme={config.theme}>{config.text}</Tag>
        },
      },
    ] as const

    const handleRefresh = () => {
      actionRef.value?.reload()
    }

    const handleReset = () => {
      actionRef.value?.reloadAndReset()
    }

    return () => (
      <div style={{ padding: '20px' }}>
        <h2>ProTable 数据请求演示</h2>

        <div style={{ marginBottom: '16px' }}>
          <Space>
            <Button onClick={handleRefresh}>刷新数据</Button>
            <Button theme="default" onClick={handleReset}>
              重置并刷新
            </Button>
          </Space>
        </div>

        <ProTable
          ref={actionRef}
          rowKey="id"
          headerTitle="用户列表"
          columns={columns as any}
          request={mockRequest}
          pagination={{
            defaultPageSize: 10,
            defaultCurrent: 1,
            showJumper: true,
            pageSizeOptions: [5, 10, 20, 50],
          }}
          onLoad={(dataSource: UserData[], extra: unknown) => {
            console.log('数据加载完成:', dataSource, extra)
          }}
          onRequestError={(error: Error) => {
            console.error('请求失败:', error)
          }}
          postData={(data: UserData[]) => {
            console.log('数据后处理:', data)
            return data
          }}
        />
      </div>
    )
  },
})
