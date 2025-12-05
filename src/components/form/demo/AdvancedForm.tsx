import { Button, Message, Space } from 'tdesign-vue-next'
import { defineComponent, ref } from 'vue'
import {
  DrawerForm,
  LightFilter,
  ModalForm,
  ProForm,
  ProFormDatePicker,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  QueryFilter,
  StepForm,
  StepsForm,
} from '../index'

export const AdvancedFormDemo = defineComponent({
  name: 'AdvancedFormDemo',
  setup() {
    const modalVisible = ref(false)
    const drawerVisible = ref(false)
    const currentStep = ref(0)

    const handleFinish = async (values: any) => {
      console.log('Form values:', values)
      Message.success('提交成功！')
      return true
    }

    const steps = [
      { title: '基本信息', description: '填写基本信息' },
      { title: '详细信息', description: '填写详细信息' },
      { title: '确认信息', description: '确认提交信息' },
    ]

    return () => (
      <div style={{ padding: '24px' }}>
        <h2>高级表单组件演示</h2>

        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          {/* ProForm 演示 */}
          <div>
            <h3>1. ProForm - 基础表单</h3>
            <ProForm
              title="用户信息表单"
              description="请填写完整的用户信息"
              onFinish={handleFinish}
              submitter={{
                searchConfig: {
                  submitText: '提交',
                  resetText: '重置',
                },
              }}
            >
              <ProFormText
                name="name"
                label="姓名"
                placeholder="请输入姓名"
                rules={[{ required: true, message: '请输入姓名' }]}
              />
              <ProFormSelect
                name="gender"
                label="性别"
                placeholder="请选择性别"
                options={[
                  { label: '男', value: 'male' },
                  { label: '女', value: 'female' },
                ]}
              />
              <ProFormDatePicker
                name="birthday"
                label="生日"
                placeholder="请选择生日"
              />
            </ProForm>
          </div>

          {/* ModalForm 演示 */}
          <div>
            <h3>2. ModalForm - 弹窗表单</h3>
            <Button theme="primary" onClick={() => (modalVisible.value = true)}>
              打开弹窗表单
            </Button>
            <ModalForm
              title="编辑用户信息"
              visible={modalVisible.value}
              onVisibleChange={visible => (modalVisible.value = visible)}
              onFinish={handleFinish}
            >
              <ProFormText
                name="username"
                label="用户名"
                placeholder="请输入用户名"
                rules={[{ required: true, message: '请输入用户名' }]}
              />
              <ProFormTextArea
                name="description"
                label="描述"
                placeholder="请输入描述"
              />
            </ModalForm>
          </div>

          {/* DrawerForm 演示 */}
          <div>
            <h3>3. DrawerForm - 抽屉表单</h3>
            <Button
              theme="primary"
              onClick={() => (drawerVisible.value = true)}
            >
              打开抽屉表单
            </Button>
            <DrawerForm
              title="创建项目"
              visible={drawerVisible.value}
              onVisibleChange={visible => (drawerVisible.value = visible)}
              onFinish={handleFinish}
            >
              <ProFormText
                name="projectName"
                label="项目名称"
                placeholder="请输入项目名称"
                rules={[{ required: true, message: '请输入项目名称' }]}
              />
              <ProFormSelect
                name="projectType"
                label="项目类型"
                placeholder="请选择项目类型"
                options={[
                  { label: 'Web应用', value: 'web' },
                  { label: '移动应用', value: 'mobile' },
                  { label: '桌面应用', value: 'desktop' },
                ]}
              />
              <ProFormTextArea
                name="projectDesc"
                label="项目描述"
                placeholder="请输入项目描述"
              />
            </DrawerForm>
          </div>

          {/* StepsForm 演示 */}
          <div>
            <h3>4. StepsForm - 分步表单</h3>
            <StepsForm
              current={currentStep.value}
              steps={steps}
              onCurrentChange={current => (currentStep.value = current)}
              onFinish={handleFinish}
            >
              {({ current, setFormRef }) => (
                <>
                  {current === 0 && (
                    <StepForm ref={setFormRef(0)} title="基本信息">
                      <ProFormText
                        name="companyName"
                        label="公司名称"
                        placeholder="请输入公司名称"
                        rules={[{ required: true, message: '请输入公司名称' }]}
                      />
                      <ProFormText
                        name="contactPerson"
                        label="联系人"
                        placeholder="请输入联系人"
                        rules={[{ required: true, message: '请输入联系人' }]}
                      />
                    </StepForm>
                  )}

                  {current === 1 && (
                    <StepForm ref={setFormRef(1)} title="详细信息">
                      <ProFormText
                        name="phone"
                        label="联系电话"
                        placeholder="请输入联系电话"
                        rules={[{ required: true, message: '请输入联系电话' }]}
                      />
                      <ProFormText
                        name="email"
                        label="邮箱"
                        placeholder="请输入邮箱"
                        rules={[{ required: true, message: '请输入邮箱' }]}
                      />
                    </StepForm>
                  )}

                  {current === 2 && (
                    <StepForm ref={setFormRef(2)} title="确认信息">
                      <ProFormTextArea
                        name="remarks"
                        label="备注"
                        placeholder="请输入备注信息"
                      />
                    </StepForm>
                  )}
                </>
              )}
            </StepsForm>
          </div>

          {/* QueryFilter 演示 */}
          <div>
            <h3>5. QueryFilter - 查询筛选器</h3>
            <QueryFilter
              onSearch={values => {
                console.log('Search values:', values)
                Message.info('查询成功')
              }}
              onReset={() => {
                console.log('Reset')
                Message.info('重置成功')
              }}
            >
              <ProFormText
                name="keyword"
                label="关键词"
                placeholder="请输入关键词"
              />
              <ProFormSelect
                name="status"
                label="状态"
                placeholder="请选择状态"
                options={[
                  { label: '启用', value: 'active' },
                  { label: '禁用', value: 'inactive' },
                ]}
              />

              {/* 高级查询条件 */}
              <template v-slot:collapsed>
                <ProFormDatePicker
                  name="startDate"
                  label="开始日期"
                  placeholder="请选择开始日期"
                />
                <ProFormDatePicker
                  name="endDate"
                  label="结束日期"
                  placeholder="请选择结束日期"
                />
              </template>
            </QueryFilter>
          </div>

          {/* LightFilter 演示 */}
          <div>
            <h3>6. LightFilter - 轻量筛选器</h3>
            <LightFilter
              onFinish={values => {
                console.log('Filter values:', values)
                Message.info('筛选成功')
              }}
            >
              <ProFormSelect
                name="category"
                label="分类"
                placeholder="请选择分类"
                options={[
                  { label: '技术', value: 'tech' },
                  { label: '产品', value: 'product' },
                  { label: '设计', value: 'design' },
                ]}
              />
              <ProFormSelect
                name="priority"
                label="优先级"
                placeholder="请选择优先级"
                options={[
                  { label: '高', value: 'high' },
                  { label: '中', value: 'medium' },
                  { label: '低', value: 'low' },
                ]}
              />
            </LightFilter>
          </div>
        </Space>
      </div>
    )
  },
})

export default AdvancedFormDemo
