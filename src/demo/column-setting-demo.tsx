import { Button, MessagePlugin } from 'tdesign-vue-next'
import { defineComponent } from 'vue'
import ProTable from '../components/table'

export default defineComponent({
  name: 'ColumnSettingDemo',
  setup() {
    // 列配置
    const columns = [
      {
        colKey: 'id',
        title: 'ID',
        width: 80,
      },
      {
        colKey: 'name',
        title: '姓名',
        width: 120,
      },
      {
        colKey: 'age',
        title: '年龄',
        width: 100,
      },
      {
        colKey: 'email',
        title: '邮箱',
        width: 200,
      },
      {
        colKey: 'status',
        title: '状态',
        width: 100,
      },
      {
        colKey: 'department',
        title: '部门',
        width: 120,
      },
      {
        colKey: 'createTime',
        title: '创建时间',
        width: 150,
      },
    ]

    // 模拟数据
    const mockData = [
      {
        id: 1,
        name: '张三',
        age: 28,
        email: 'zhangsan@example.com',
        status: '在职',
        department: '技术部',
        createTime: '2024-01-01',
      },
      {
        id: 2,
        name: '李四',
        age: 32,
        email: 'lisi@example.com',
        status: '离职',
        department: '产品部',
        createTime: '2024-01-02',
      },
      {
        id: 3,
        name: '王五',
        age: 26,
        email: 'wangwu@example.com',
        status: '在职',
        department: '设计部',
        createTime: '2024-01-03',
      },
    ]

    // 模拟请求
    const request = async () => {
      await new Promise(resolve => setTimeout(resolve, 500))
      return {
        data: mockData,
        success: true,
        total: mockData.length,
      }
    }

    // 工具栏渲染
    const toolbarRender = () => [
      <Button theme="primary" onClick={() => MessagePlugin.success('新建员工')}>
        新建员工
      </Button>,
      <Button onClick={() => MessagePlugin.info('导出数据')}>导出</Button>,
    ]

    return () => (
      <div style={{ padding: '24px' }}>
        <h1>列配置功能演示</h1>
        <p>点击右上角的设置按钮可以控制列的显示/隐藏</p>

        <ProTable
          columns={columns}
          request={request}
          headerTitle="员工管理 - 支持列配置"
          rowKey="id"
          toolbarRender={toolbarRender}
          pagination={{
            showJumper: true,
            showSizeChanger: true,
            defaultCurrent: 1,
            defaultPageSize: 10,
          }}
        />
      </div>
    )
  },
})
