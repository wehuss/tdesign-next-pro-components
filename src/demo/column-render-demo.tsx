import { Button, MessagePlugin, Tag } from 'tdesign-vue-next'
import { defineComponent, ref } from 'vue'
import ProTable from '../components/table'
import type { ProTableColumn } from '../components/table/types'

interface UserData {
  id: number
  name: string
  age: number
  email: string
  status: 'active' | 'inactive' | 'pending'
  createTime: string
  score: number
  tags: string[]
}

export default defineComponent({
  name: 'ColumnRenderDemo',
  setup() {
    const editable = ref(false)

    // 模拟数据
    const mockData: UserData[] = [
      {
        id: 1,
        name: '张三',
        age: 28,
        email: 'zhangsan@example.com',
        status: 'active',
        createTime: '2024-01-01',
        score: 85,
        tags: ['开发', '技术'],
      },
      {
        id: 2,
        name: '李四',
        age: 32,
        email: 'lisi@example.com',
        status: 'inactive',
        createTime: '2024-01-02',
        score: 92,
        tags: ['设计', '创意'],
      },
      {
        id: 3,
        name: '王五',
        age: 26,
        email: 'wangwu@example.com',
        status: 'pending',
        createTime: '2024-01-03',
        score: 78,
        tags: ['产品', '策划'],
      },
    ]

    // 状态值枚举
    const statusValueEnum = {
      active: { text: '活跃', status: 'success' as const },
      inactive: { text: '非活跃', status: 'error' as const },
      pending: { text: '待处理', status: 'warning' as const },
    }

    // 列配置 - 展示不同的渲染方式
    const columns: ProTableColumn<UserData>[] = [
      {
        colKey: 'index',
        title: '序号',
        valueType: 'index',
        width: 80,
      },
      {
        colKey: 'id',
        title: 'ID',
        width: 80,
        valueType: 'digit',
      },
      {
        colKey: 'name',
        title: '姓名',
        width: 120,
        valueType: 'text',
        editable: true,
      },
      {
        colKey: 'age',
        title: '年龄',
        width: 100,
        valueType: 'digit',
        editable: true,
      },
      {
        colKey: 'email',
        title: '邮箱',
        width: 200,
        valueType: 'text',
        editable: true,
      },
      {
        colKey: 'status',
        title: '状态',
        width: 120,
        valueType: 'select',
        valueEnum: statusValueEnum,
        editable: true,
        // 自定义只读渲染
        render: (_, record) => {
          const statusConfig = statusValueEnum[record.status]
          const theme =
            statusConfig.status === 'error' ? 'danger' : statusConfig.status
          return <Tag theme={theme}>{statusConfig.text}</Tag>
        },
      },
      {
        colKey: 'score',
        title: '评分',
        width: 120,
        valueType: 'percent',
        // 自定义文本处理
        renderText: (text: unknown) => {
          return (text as number) / 100 // 转换为百分比
        },
      },
      {
        colKey: 'tags',
        title: '标签',
        width: 200,
        // 自定义渲染数组
        render: (_, record) => {
          return (
            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
              {record.tags.map((tag, index) => (
                <Tag key={index} variant="light">
                  {tag}
                </Tag>
              ))}
            </div>
          )
        },
        // 自定义表单项渲染
        formItemRender: (_, config) => {
          if (config.type === 'form') {
            // 在表单中显示为文本输入
            return config.defaultRender()
          }
          return null
        },
      },
      {
        colKey: 'createTime',
        title: '创建时间',
        width: 150,
        valueType: 'date',
      },
      {
        colKey: 'operation',
        title: '操作',
        valueType: 'option',
        width: 200,
        render: () => {
          return (
            <div style={{ display: 'flex', gap: '8px' }}>
              <Button variant="text" theme="primary" size="small">
                编辑
              </Button>
              <Button variant="text" theme="danger" size="small">
                删除
              </Button>
            </div>
          )
        },
      },
    ]

    const handleEdit = () => {
      editable.value = !editable.value
      MessagePlugin.info(editable.value ? '已进入编辑模式' : '已退出编辑模式')
    }

    const handleSave = () => {
      MessagePlugin.success('保存成功')
      editable.value = false
    }

    return () => (
      <div style={{ padding: '20px' }}>
        <h2>列渲染演示</h2>
        <p>这个演示展示了 ProTable 的各种列渲染功能：</p>
        <ul>
          <li>index: 自动序号列</li>
          <li>数字类型: 格式化数字显示</li>
          <li>状态枚举: 使用 valueEnum 和自定义 render</li>
          <li>百分比: 自定义 renderText 处理数据</li>
          <li>标签数组: 自定义 render 显示多个标签</li>
          <li>操作列: valueType: 'option' 显示操作按钮</li>
        </ul>

        <div style={{ marginBottom: '16px' }}>
          <Button onClick={handleEdit} theme="primary">
            {editable.value ? '退出编辑' : '进入编辑'}
          </Button>
          {editable.value && (
            <Button
              onClick={handleSave}
              theme="success"
              style={{ marginLeft: '8px' }}
            >
              保存
            </Button>
          )}
        </div>

        <ProTable
          rowKey="id"
          columns={columns as any}
          dataSource={mockData as any}
          pagination={false}
          search={false}
          toolbar={false}
          // 模拟可编辑状态
          {...(editable.value
            ? {
                // 这里可以添加可编辑表格的配置
              }
            : {})}
        />
      </div>
    )
  },
})
