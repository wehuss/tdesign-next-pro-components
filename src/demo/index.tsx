import { Button, MessagePlugin } from 'tdesign-vue-next'
import { defineComponent } from 'vue'
import ProTable from '../components/table'
import type { ProTableColumn } from '../components/table/types'

interface UserData {
  id: number
  name: string
  age: number
  email: string
  status: 'active' | 'inactive'
  createTime: string
}

export default defineComponent({
  name: 'ProTableDemo',
  setup() {
    // 模拟数据
    const mockData: UserData[] = [
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
    const columns: ProTableColumn<UserData>[] = [
      {
        colKey: 'id',
        title: 'ID',
        width: 80,
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
      },
      {
        colKey: 'email',
        title: '邮箱',
        valueType: 'text',
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
            <Button
              variant="text"
              size="small"
              onClick={() => MessagePlugin.info('编辑')}
            >
              编辑
            </Button>
            <Button
              variant="text"
              size="small"
              theme="danger"
              onClick={() => MessagePlugin.warning('删除')}
            >
              删除
            </Button>
          </div>
        ),
      },
    ]

    // 模拟请求
    const request = async (params: Record<string, unknown>) => {
      console.log('Request params:', params)

      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 500))

      return {
        data: mockData,
        success: true,
        total: mockData.length,
      }
    }

    // 工具栏渲染
    const toolbarRender = () => [
      <Button theme="primary" onClick={() => MessagePlugin.success('新建用户')}>
        新建用户
      </Button>,
      <Button onClick={() => MessagePlugin.info('批量导出')}>批量导出</Button>,
    ]

    return () => (
      <div style={{ padding: '24px' }}>
        <ProTable
          columns={columns}
          request={request}
          headerTitle="用户管理"
          rowKey="id"
          search={{
            labelWidth: 'auto',
            searchText: '查询',
            resetText: '重置',
          }}
          toolbarRender={toolbarRender}
          pagination={{
            showJumper: true,
            showSizeChanger: true,
          }}
        />
      </div>
    )
  },
})
