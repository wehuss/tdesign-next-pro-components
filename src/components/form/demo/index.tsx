import { Card, Space } from 'tdesign-vue-next'
import { defineComponent } from 'vue'
import BasicFormDemo from './BasicForm'

export default defineComponent({
  name: 'FormDemo',
  setup() {
    return () => (
      <div style={{ padding: '24px' }}>
        <h1>ProForm 组件库 Vue3 版本演示</h1>

        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Card title="基础表单" bordered>
            <BasicFormDemo />
          </Card>

          <Card title="功能特性" bordered>
            <div style={{ padding: '16px' }}>
              <h3>✅ 已完成功能</h3>
              <ul>
                <li>✅ Vue3 Composition API 转换</li>
                <li>✅ TDesign 组件适配</li>
                <li>✅ 双向绑定机制（useModel）</li>
                <li>✅ 表单校验集成</li>
                <li>✅ TypeScript 类型定义</li>
                <li>
                  ✅ 基础表单控件（Text, Select, TextArea, Radio, Checkbox等）
                </li>
                <li>✅ 高级控件（DatePicker, TreeSelect, Upload等）</li>
                <li>✅ 布局组件（Group, FieldSet, List, Dependency）</li>
              </ul>

              <h3>🔄 React vs Vue 核心差异对比</h3>
              <table
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  marginTop: '12px',
                }}
              >
                <thead>
                  <tr style={{ backgroundColor: '#f5f5f5' }}>
                    <th style={{ border: '1px solid #ddd', padding: '8px' }}>
                      特性
                    </th>
                    <th style={{ border: '1px solid #ddd', padding: '8px' }}>
                      React
                    </th>
                    <th style={{ border: '1px solid #ddd', padding: '8px' }}>
                      Vue3
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                      状态管理
                    </td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                      useState, useReducer
                    </td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                      ref, reactive
                    </td>
                  </tr>
                  <tr>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                      生命周期
                    </td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                      useEffect
                    </td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                      onMounted, watchEffect
                    </td>
                  </tr>
                  <tr>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                      双向绑定
                    </td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                      受控组件 + onChange
                    </td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                      v-model + useModel
                    </td>
                  </tr>
                  <tr>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                      上下文
                    </td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                      React.createContext
                    </td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                      provide/inject
                    </td>
                  </tr>
                </tbody>
              </table>

              <h3>🎨 Ant Design vs TDesign 对比</h3>
              <table
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  marginTop: '12px',
                }}
              >
                <thead>
                  <tr style={{ backgroundColor: '#f5f5f5' }}>
                    <th style={{ border: '1px solid #ddd', padding: '8px' }}>
                      方面
                    </th>
                    <th style={{ border: '1px solid #ddd', padding: '8px' }}>
                      Ant Design
                    </th>
                    <th style={{ border: '1px solid #ddd', padding: '8px' }}>
                      TDesign
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                      设计风格
                    </td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                      企业级、稳重
                    </td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                      现代化、简洁
                    </td>
                  </tr>
                  <tr>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                      表单布局
                    </td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                      layout: horizontal/vertical/inline
                    </td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                      layout: vertical/inline
                    </td>
                  </tr>
                  <tr>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                      校验提示
                    </td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                      validateStatus + help
                    </td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                      status + help
                    </td>
                  </tr>
                  <tr>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                      主题定制
                    </td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                      CSS Variables + Less
                    </td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                      CSS Variables + Design Tokens
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
        </Space>
      </div>
    )
  },
})
