import { defineComponent, ref } from 'vue'
import { ProField } from '../components'

export default defineComponent({
  name: 'ProFieldDemo',
  setup() {
    // 测试数据
    const textValue = ref('这是可编辑文本')
    const textareaValue = ref('这是多行文本\n支持换行显示')
    const passwordValue = ref('mypassword123')
    const switchValue = ref(true)
    const selectValue = ref('option1')
    const moneyValue = ref(12345.67)
    const digitValue = ref(100)
    const percentValue = ref(85)
    const dateValue = ref('2023-12-25')
    const dateRangeValue = ref(['2023-12-01', '2023-12-31'])
    const timeValue = ref('14:30:00')
    const rateValue = ref(4.5)
    const sliderValue = ref(60)
    const checkboxValue = ref(['option1', 'option3'])
    const radioValue = ref('option2')

    // 选择框的选项配置
    const selectOptions = {
      option1: { text: '选项一', color: 'blue' },
      option2: { text: '选项二', color: 'green' },
      option3: { text: '选项三', color: 'red' },
    }

    // 复选框选项
    const checkboxOptions = {
      option1: { text: '选项A' },
      option2: { text: '选项B' },
      option3: { text: '选项C' },
    }

    return () => (
      <div style={{ padding: '20px' }}>
        <h2>ProField 组件演示</h2>
        <p>使用 v-model 双向绑定，支持多种字段类型</p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
            gap: '20px',
          }}
        >
          {/* 基础文本组件 */}
          <div>
            <h3>文本字段</h3>
            <div style={{ marginBottom: '10px' }}>
              <strong>只读模式：</strong>
              <ProField
                v-model={textValue.value}
                valueType="text"
                mode="read"
              />
            </div>
            <div>
              <strong>编辑模式：</strong>
              <ProField
                v-model={textValue.value}
                valueType="text"
                mode="edit"
                placeholder="请输入文本"
              />
            </div>
            <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
              当前值: {textValue.value}
            </div>
          </div>

          {/* 多行文本 */}
          <div>
            <h3>多行文本字段</h3>
            <div style={{ marginBottom: '10px' }}>
              <strong>只读模式：</strong>
              <ProField
                v-model={textareaValue.value}
                valueType="textarea"
                mode="read"
              />
            </div>
            <div>
              <strong>编辑模式：</strong>
              <ProField
                v-model={textareaValue.value}
                valueType="textarea"
                mode="edit"
                placeholder="请输入多行文本"
              />
            </div>
            <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
              当前值: {textareaValue.value}
            </div>
          </div>

          {/* 密码字段 */}
          <div>
            <h3>密码字段</h3>
            <div style={{ marginBottom: '10px' }}>
              <strong>只读模式：</strong>
              <ProField
                v-model={passwordValue.value}
                valueType="password"
                mode="read"
              />
            </div>
            <div>
              <strong>编辑模式：</strong>
              <ProField
                v-model={passwordValue.value}
                valueType="password"
                mode="edit"
                placeholder="请输入密码"
              />
            </div>
            <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
              当前值: {passwordValue.value}
            </div>
          </div>

          {/* 金额字段 */}
          <div>
            <h3>金额字段</h3>
            <div style={{ marginBottom: '10px' }}>
              <strong>只读模式：</strong>
              <ProField
                v-model={moneyValue.value}
                valueType="money"
                mode="read"
              />
            </div>
            <div>
              <strong>编辑模式：</strong>
              <ProField
                v-model={moneyValue.value}
                valueType="money"
                mode="edit"
                placeholder="请输入金额"
              />
            </div>
            <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
              当前值: {moneyValue.value}
            </div>
          </div>

          {/* 数字字段 */}
          <div>
            <h3>数字字段</h3>
            <div style={{ marginBottom: '10px' }}>
              <strong>只读模式：</strong>
              <ProField
                v-model={digitValue.value}
                valueType="digit"
                mode="read"
              />
            </div>
            <div>
              <strong>编辑模式：</strong>
              <ProField
                v-model={digitValue.value}
                valueType="digit"
                mode="edit"
                placeholder="请输入数字"
              />
            </div>
            <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
              当前值: {digitValue.value}
            </div>
          </div>

          {/* 百分比字段 */}
          <div>
            <h3>百分比字段</h3>
            <div style={{ marginBottom: '10px' }}>
              <strong>只读模式：</strong>
              <ProField
                v-model={percentValue.value}
                valueType="percent"
                mode="read"
              />
            </div>
            <div>
              <strong>编辑模式：</strong>
              <ProField
                v-model={percentValue.value}
                valueType="percent"
                mode="edit"
                placeholder="请输入百分比"
              />
            </div>
            <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
              当前值: {percentValue.value}%
            </div>
          </div>

          {/* 日期字段 */}
          <div>
            <h3>日期字段</h3>
            <div style={{ marginBottom: '10px' }}>
              <strong>只读模式：</strong>
              <ProField
                v-model={dateValue.value}
                valueType="date"
                mode="read"
              />
            </div>
            <div>
              <strong>编辑模式：</strong>
              <ProField
                v-model={dateValue.value}
                valueType="date"
                mode="edit"
              />
            </div>
            <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
              当前值: {dateValue.value}
            </div>
          </div>

          {/* 日期范围字段 */}
          <div>
            <h3>日期范围字段</h3>
            <div style={{ marginBottom: '10px' }}>
              <strong>只读模式：</strong>
              <ProField
                v-model={dateRangeValue.value}
                valueType="dateRange"
                mode="read"
              />
            </div>
            <div>
              <strong>编辑模式：</strong>
              <ProField
                v-model={dateRangeValue.value}
                valueType="dateRange"
                mode="edit"
              />
            </div>
            <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
              当前值: {JSON.stringify(dateRangeValue.value)}
            </div>
          </div>

          {/* 时间字段 */}
          <div>
            <h3>时间字段</h3>
            <div style={{ marginBottom: '10px' }}>
              <strong>只读模式：</strong>
              <ProField
                v-model={timeValue.value}
                valueType="time"
                mode="read"
              />
            </div>
            <div>
              <strong>编辑模式：</strong>
              <ProField
                v-model={timeValue.value}
                valueType="time"
                mode="edit"
              />
            </div>
            <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
              当前值: {timeValue.value}
            </div>
          </div>

          {/* 评分字段 */}
          <div>
            <h3>评分字段</h3>
            <div style={{ marginBottom: '10px' }}>
              <strong>只读模式：</strong>
              <ProField
                v-model={rateValue.value}
                valueType="rate"
                mode="read"
              />
            </div>
            <div>
              <strong>编辑模式：</strong>
              <ProField
                v-model={rateValue.value}
                valueType="rate"
                mode="edit"
              />
            </div>
            <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
              当前值: {rateValue.value}
            </div>
          </div>

          {/* 滑块字段 */}
          <div>
            <h3>滑块字段</h3>
            <div style={{ marginBottom: '10px' }}>
              <strong>只读模式：</strong>
              <ProField
                v-model={sliderValue.value}
                valueType="slider"
                mode="read"
              />
            </div>
            <div>
              <strong>编辑模式：</strong>
              <ProField
                v-model={sliderValue.value}
                valueType="slider"
                mode="edit"
              />
            </div>
            <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
              当前值: {sliderValue.value}
            </div>
          </div>

          {/* 开关字段 */}
          <div>
            <h3>开关字段</h3>
            <div style={{ marginBottom: '10px' }}>
              <strong>只读模式：</strong>
              <ProField
                v-model={switchValue.value}
                valueType="switch"
                mode="read"
              />
            </div>
            <div>
              <strong>编辑模式：</strong>
              <ProField
                v-model={switchValue.value}
                valueType="switch"
                mode="edit"
              />
            </div>
            <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
              当前值: {switchValue.value ? '开启' : '关闭'}
            </div>
          </div>

          {/* 选择字段 */}
          <div>
            <h3>选择字段</h3>
            <div style={{ marginBottom: '10px' }}>
              <strong>只读模式：</strong>
              <ProField
                v-model={selectValue.value}
                valueType="select"
                mode="read"
                valueEnum={selectOptions}
              />
            </div>
            <div>
              <strong>编辑模式：</strong>
              <ProField
                v-model={selectValue.value}
                valueType="select"
                mode="edit"
                valueEnum={selectOptions}
              />
            </div>
            <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
              当前值: {selectValue.value}
            </div>
          </div>

          {/* 复选框字段 */}
          <div>
            <h3>复选框字段</h3>
            <div style={{ marginBottom: '10px' }}>
              <strong>只读模式：</strong>
              <ProField
                v-model={checkboxValue.value}
                valueType="checkbox"
                mode="read"
                valueEnum={checkboxOptions}
              />
            </div>
            <div>
              <strong>编辑模式：</strong>
              <ProField
                v-model={checkboxValue.value}
                valueType="checkbox"
                mode="edit"
                valueEnum={checkboxOptions}
              />
            </div>
            <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
              当前值: {JSON.stringify(checkboxValue.value)}
            </div>
          </div>

          {/* 单选框字段 */}
          <div>
            <h3>单选框字段</h3>
            <div style={{ marginBottom: '10px' }}>
              <strong>只读模式：</strong>
              <ProField
                v-model={radioValue.value}
                valueType="radio"
                mode="read"
                valueEnum={selectOptions}
              />
            </div>
            <div>
              <strong>编辑模式：</strong>
              <ProField
                v-model={radioValue.value}
                valueType="radio"
                mode="edit"
                valueEnum={selectOptions}
              />
            </div>
            <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
              当前值: {radioValue.value}
            </div>
          </div>
        </div>

        <div
          style={{
            marginTop: '30px',
            padding: '20px',
            backgroundColor: '#f5f5f5',
            borderRadius: '8px',
          }}
        >
          <h3>演示说明</h3>
          <ul>
            <li>所有组件都支持 v-model 双向绑定</li>
            <li>使用 mode="read" 显示只读状态，mode="edit" 显示编辑状态</li>
            <li>支持 readonly 和 disabled 状态</li>
            <li>每个字段下方显示当前绑定的值，验证双向绑定是否正常工作</li>
          </ul>
        </div>
      </div>
    )
  },
})
