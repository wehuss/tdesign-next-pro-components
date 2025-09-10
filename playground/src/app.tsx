import {
  Button,
  Card,
  Divider,
  MessagePlugin,
  Space,
  Tag,
} from 'tdesign-vue-next'
import { defineComponent } from 'vue'
import ProFieldDemo from '../../src/demo/field-demo'
import ProTableDemo from './components/pro-table-demo'

export default defineComponent({
  name: 'PlaygroundApp',
  setup() {
    const handleClick = () => {
      MessagePlugin.success('TDesign Pro Components 开发环境运行正常！')
    }

    return () => (
      <div class="playground">
        <h1>TDesign Pro Components Playground</h1>
        <p>This is a development playground for testing components.</p>

        <Divider>基础组件测试</Divider>

        <Space direction="vertical" size="large">
          <Card title="测试区域" bordered>
            <p>在这里可以测试和开发组件</p>
            <Button theme="primary" onClick={handleClick}>
              测试按钮
            </Button>
          </Card>

          <Card title="Pro Table 组件" bordered>
            <p>TDesign Pro Table 组件演示：</p>
            <ProTableDemo />
          </Card>

          <Card title="Pro Field 组件" bordered>
            <p>TDesign Pro Field 组件演示：</p>
            <ProFieldDemo />
          </Card>

          <Card title="组件列表" bordered>
            <p>当前可用的组件：</p>
            <Tag theme="success">Pro Table</Tag>
            <Tag theme="success">Pro Field</Tag>
            <Tag>Pro Form (开发中)</Tag>
            <Tag>Pro Select (开发中)</Tag>
          </Card>
        </Space>
      </div>
    )
  },
})
