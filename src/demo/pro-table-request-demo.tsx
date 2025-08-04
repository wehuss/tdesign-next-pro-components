import { defineComponent, ref } from 'vue'
import ProTable from '../components/table'
import type { ProTableColumn } from '../components/table/types'

interface UserData {
  id: number
  name: string
  age: number
  email: string
  phone: string
  address: string
  status: 'active' | 'inactive'
  createTime: string
}

// 模拟数据
const mockUsers: UserData[] = Array.from({ length: 100 }, (_, index) => ({
  id: index + 1,
  name: `用户${index + 1}`,
  age: 20 + (index % 40),
  email: `user${index + 1}@example.com`,
  phone: `138${String(index + 1).padStart(8, '0')}`,
  address: `北京市朝阳区某某街道${index + 1}号`,
  status: index % 3 === 0 ? 'inactive' : 'active',
  createTime: new Date(2024, 0, 1 + index).toISOString(),
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

    const columns: ProTableColumn<UserData>[] = [
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
        form: {
          valueType: 'text',
          searchForm: {
            placeholder: '请输入用户名',
          },
        },
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
        colKey: 'phone',
        title: '电话',
        width: 150,
      },
      {
        colKey: 'status',
        title: '状态',
        width: 100,
        align: 'center',
        form: {
          valueType: 'select',
          valueEnum: {
            active: { text: '激活', status: 'success' },
            inactive: { text: '禁用', status: 'error' },
          },
          searchForm: {
            placeholder: '选择状态',
          },
        },
        cell: (h, { row }) => {
          const statusConfig = {
            active: { text: '激活', theme: 'success' },
            inactive: { text: '禁用', theme: 'danger' },
          }
          const config = statusConfig[row.status]
          return <t-tag theme={config.theme}>{config.text}</t-tag>
        },
      },
      {
        colKey: 'address',
        title: '地址',
        ellipsis: true,
      },
      {
        colKey: 'createTime',
        title: '创建时间',
        width: 180,
        cell: (h, { row }) => new Date(row.createTime).toLocaleString(),
      },
      {
        colKey: 'actions',
        title: '操作',
        width: 150,
        align: 'center',
        cell: (h, { row }) => (
          <t-space>
            <t-button
              variant="text"
              theme="primary"
              size="small"
              onClick={() => console.log('编辑', row)}
            >
              编辑
            </t-button>
            <t-button
              variant="text"
              theme="danger"
              size="small"
              onClick={() => console.log('删除', row)}
            >
              删除
            </t-button>
          </t-space>
        ),
      },
    ]

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
          <t-space>
            <t-button onClick={handleRefresh}>刷新数据</t-button>
            <t-button theme="default" onClick={handleReset}>
              重置并刷新
            </t-button>
          </t-space>
        </div>

        <ProTable
          ref={actionRef}
          rowKey="id"
          headerTitle="用户列表"
          columns={columns}
          request={mockRequest}
          pagination={{
            defaultPageSize: 10,
            defaultCurrent: 1,
            showJumper: true,
            showSizeChanger: true,
            pageSizeOptions: [5, 10, 20, 50],
          }}
          search={{
            labelWidth: 'auto',
            collapsed: false,
            searchText: '搜索',
            resetText: '重置',
            submitText: '查询',
          }}
          toolbar={{
            refresh: true,
            setting: true,
            fullScreen: true,
          }}
          onLoad={(dataSource, extra) => {
            console.log('数据加载完成:', dataSource, extra)
          }}
          onRequestError={error => {
            console.error('请求失败:', error)
          }}
          postData={data => {
            // 可以在这里对数据进行后处理
            console.log('数据后处理:', data)
            return data
          }}
        />
      </div>
    )
  },
})
