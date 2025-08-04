import { Button, Space, Tag } from 'tdesign-vue-next'
import { defineComponent, ref } from 'vue'
import ProTable from '../components/table'

// 模拟用户数据类型
interface User {
  id: number
  name: string
  age: number
  email: string
  status: 'active' | 'inactive'
  department: string
  createTime: string
}

// 生成大量模拟数据来测试分页
const generateMockData = (count: number): User[] => {
  const departments = ['前端开发', '后端开发', '产品设计', '测试', '运营']
  const statuses: Array<'active' | 'inactive'> = ['active', 'inactive']

  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    name: `用户${String(index + 1).padStart(3, '0')}`,
    age: 20 + (index % 40),
    email: `user${index + 1}@example.com`,
    status: statuses[index % 2],
    department: departments[index % departments.length],
    createTime: new Date(
      Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000)
    )
      .toISOString()
      .split('T')[0],
  }))
}

const mockData = generateMockData(267) // 生成267条数据用于测试分页

// 模拟API请求函数
const fetchUsers = async (params: {
  current: number
  pageSize: number
  name?: string
  status?: string
  department?: string
}) => {
  console.log('🚀 分页请求参数:', params)

  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 800))

  let filteredData = [...mockData]

  // 模拟搜索过滤
  if (params.name) {
    filteredData = filteredData.filter(user => user.name.includes(params.name!))
  }

  if (params.status) {
    filteredData = filteredData.filter(user => user.status === params.status)
  }

  if (params.department) {
    filteredData = filteredData.filter(user =>
      user.department.includes(params.department!)
    )
  }

  // 分页处理
  const { current = 1, pageSize = 20 } = params
  const start = (current - 1) * pageSize
  const end = start + pageSize
  const pageData = filteredData.slice(start, end)

  console.log(
    `📄 返回第 ${current} 页数据，每页 ${pageSize} 条，共 ${filteredData.length} 条`
  )

  return {
    data: pageData,
    success: true,
    total: filteredData.length,
  }
}

export default defineComponent({
  name: 'PaginationDemo',
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
        colKey: 'department',
        title: '部门',
        width: 120,
      },
      {
        colKey: 'status',
        title: '状态',
        width: 100,
        align: 'center' as const,
        cell: (_: unknown, { row }: { row: User }) => (
          <Tag theme={row.status === 'active' ? 'success' : 'default'}>
            {row.status === 'active' ? '激活' : '禁用'}
          </Tag>
        ),
      },
      {
        colKey: 'createTime',
        title: '创建时间',
        width: 120,
      },
    ]

    const handleReload = () => {
      console.log('🔄 手动刷新数据')
      tableRef.value?.reload()
    }

    const handleReset = () => {
      console.log('🔄 重置并刷新数据')
      tableRef.value?.reloadAndReset()
    }

    const handlePageChange = (page: number, pageSize: number) => {
      console.log(`📄 页码变化: 第 ${page} 页，每页 ${pageSize} 条`)
    }

    const handlePageSizeChange = (page: number, pageSize: number) => {
      console.log(`📏 页面大小变化: 第 ${page} 页，每页 ${pageSize} 条`)
    }

    return () => (
      <div style={{ padding: '24px' }}>
        <h1>ProTable 分页功能演示</h1>
        <p>演示数据：共 {mockData.length} 条记录</p>

        <div style={{ marginBottom: '16px' }}>
          <Space>
            <Button onClick={handleReload}>刷新数据</Button>
            <Button theme="default" onClick={handleReset}>
              重置并刷新
            </Button>
          </Space>
        </div>

        <ProTable
          ref={tableRef}
          rowKey="id"
          columns={columns as any}
          request={fetchUsers}
          pagination={{
            defaultPageSize: 15,
            showJumper: true,
            showSizeChanger: true,
            showTotal: true,
            pageSizeOptions: [10, 15, 20, 50, 100],
            onChange: handlePageChange,
            onShowSizeChange: handlePageSizeChange,
          }}
          onLoad={(dataSource, extra) => {
            console.log('✅ 数据加载完成:', {
              dataCount: dataSource.length,
              total: extra.total,
            })
          }}
          onRequestError={error => {
            console.error('❌ 请求失败:', error)
          }}
        />
      </div>
    )
  },
})
