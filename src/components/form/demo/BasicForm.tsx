import { Button, Message } from 'tdesign-vue-next'
import { defineComponent, ref } from 'vue'
import { BaseForm, ProFormSelect, ProFormText, ProFormTextArea } from '../index'

export default defineComponent({
  name: 'BasicFormDemo',
  setup() {
    const formRef = ref()
    const formData = ref({
      name: '',
      email: '',
      type: '',
      description: '',
    })

    const handleSubmit = async () => {
      try {
        const values = await formRef.value?.validate()
        console.log('表单数据:', values)
        Message.success('提交成功！')
      } catch (error) {
        console.error('表单验证失败:', error)
        Message.error('请检查表单数据')
      }
    }

    const handleReset = () => {
      formRef.value?.reset()
      formData.value = {
        name: '',
        email: '',
        type: '',
        description: '',
      }
    }

    return () => (
      <div style={{ padding: '24px', maxWidth: '600px' }}>
        <h2>基础表单示例</h2>
        <BaseForm
          ref={formRef}
          v-model={formData.value}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <ProFormText
            name="name"
            label="姓名"
            placeholder="请输入姓名"
            rules={[{ required: true, message: '请输入姓名' }]}
          />
          
          <ProFormText
            name="email"
            label="邮箱"
            placeholder="请输入邮箱"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入正确的邮箱格式' }
            ]}
          />
          
          <ProFormSelect
            name="type"
            label="类型"
            placeholder="请选择类型"
            options={[
              { label: '个人', value: 'personal' },
              { label: '企业', value: 'company' },
              { label: '其他', value: 'other' }
            ]}
            rules={[{ required: true, message: '请选择类型' }]}
          />
          
          <ProFormTextArea
            name="description"
            label="描述"
            placeholder="请输入描述信息"
            fieldProps={{
              autosize: { minRows: 3, maxRows: 6 }
            }}
          />
          
          <div style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
            <Button theme="primary" onClick={handleSubmit}>
              提交
            </Button>
            <Button variant="outline" onClick={handleReset}>
              重置
            </Button>
          </div>
        </BaseForm>
      </div>
    )
  },
})