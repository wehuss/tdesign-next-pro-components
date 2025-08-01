import { createApp } from 'vue'
import TDesign from 'tdesign-vue-next'
import 'tdesign-vue-next/es/style/index.css'

// 导入组件
import ProTable from './components/table'

// 创建一个简单的测试页面
const TestApp = {
  setup() {
    const columns = [
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
        hideInSearch: true,
      },
    ]

    const request = async () => {
      await new Promise(resolve => setTimeout(resolve, 500))
      return {
        data: [
          { id: 1, name: '张三', age: 28 },
          { id: 2, name: '李四', age: 32 },
        ],
        success: true,
        total: 2,
      }
    }

    return () => (
      <div style={{ padding: '24px' }}>
        <h1>TDesign Pro Table 测试</h1>
        <ProTable
          columns={columns}
          request={request}
          headerTitle="用户列表"
          rowKey="id"
        />
      </div>
    )
  },
}

// 创建应用
const app = createApp(TestApp)
app.use(TDesign)
app.mount('#app')

console.log('ProTable 应用已启动')
