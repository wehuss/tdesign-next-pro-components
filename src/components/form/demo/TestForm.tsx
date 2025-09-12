import { Button, Message, Space } from 'tdesign-vue-next'
import { defineComponent, ref } from 'vue'
import {
    DrawerForm,
    LightFilter,
    ModalForm,
    ProForm,
    ProFormCascader,
    ProFormCheckbox,
    ProFormColorPicker,
    ProFormDatePicker,
    ProFormDateRangePicker,
    ProFormDependency,
    ProFormDigit,
    ProFormFieldSet,
    ProFormGroup,
    ProFormList,
    ProFormMoney,
    ProFormPassword,
    ProFormRadio,
    ProFormRate,
    ProFormSelect,
    ProFormSlider,
    ProFormSwitch,
    ProFormText,
    ProFormTextArea,
    ProFormTimePicker,
    ProFormTimeRangePicker,
    ProFormTreeSelect,
    ProFormUploadButton,
    QueryFilter,
    StepForm,
    StepsForm
} from '../index'

export const TestForm = defineComponent({
  name: 'TestForm',
  setup() {
    const modalVisible = ref(false)
    const drawerVisible = ref(false)
    const currentStep = ref(0)

    const handleFinish = async (values: any) => {
      console.log('Form values:', values)
      Message.success('提交成功！')
      return true
    }

    const treeData = [
      {
        label: '前端开发',
        value: 'frontend',
        children: [
          { label: 'Vue.js', value: 'vue' },
          { label: 'React', value: 'react' },
          { label: 'Angular', value: 'angular' },
        ],
      },
      {
        label: '后端开发',
        value: 'backend',
        children: [
          { label: 'Node.js', value: 'nodejs' },
          { label: 'Java', value: 'java' },
          { label: 'Python', value: 'python' },
        ],
      },
    ]

    const cascaderOptions = [
      {
        label: '北京',
        value: 'beijing',
        children: [
          {
            label: '朝阳区',
            value: 'chaoyang',
            children: [
              { label: '三里屯', value: 'sanlitun' },
              { label: '国贸', value: 'guomao' },
            ],
          },
          {
            label: '海淀区',
            value: 'haidian',
            children: [
              { label: '中关村', value: 'zhongguancun' },
              { label: '五道口', value: 'wudaokou' },
            ],
          },
        ],
      },
      {
        label: '上海',
        value: 'shanghai',
        children: [
          {
            label: '浦东新区',
            value: 'pudong',
            children: [
              { label: '陆家嘴', value: 'lujiazui' },
              { label: '张江', value: 'zhangjiang' },
            ],
          },
        ],
      },
    ]

    const steps = [
      { title: '基本信息', description: '填写基本信息' },
      { title: '详细信息', description: '填写详细信息' },
      { title: '确认信息', description: '确认提交信息' },
    ]

    return () => (
      <div style={{ padding: '24px' }}>
        <h1>ProForm 组件功能测试</h1>
        
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          {/* 基础表单控件测试 */}
          <div>
            <h2>1. 基础表单控件测试</h2>
            <ProForm
              title="基础表单控件"
              onFinish={handleFinish}
              initialValues={{
                name: '张三',
                age: 25,
                salary: 10000,
                rating: 4,
                enabled: true,
                gender: 'male',
                hobbies: ['reading', 'music'],
                color: '#1890ff',
              }}
            >
              <ProFormText
                name="name"
                label="姓名"
                placeholder="请输入姓名"
                rules={[{ required: true, message: '请输入姓名' }]}
              />
              
              <ProFormPassword
                name="password"
                label="密码"
                placeholder="请输入密码"
                rules={[{ required: true, message: '请输入密码' }]}
              />
              
              <ProFormTextArea
                name="description"
                label="描述"
                placeholder="请输入描述"
                fieldProps={{ rows: 4 }}
              />
              
              <ProFormSelect
                name="department"
                label="部门"
                placeholder="请选择部门"
                options={[
                  { label: '技术部', value: 'tech' },
                  { label: '产品部', value: 'product' },
                  { label: '设计部', value: 'design' },
                  { label: '运营部', value: 'operation' },
                ]}
              />
              
              <ProFormTreeSelect
                name="skills"
                label="技能"
                placeholder="请选择技能"
                fieldProps={{
                  data: treeData,
                  multiple: true,
                }}
              />
              
              <ProFormCascader
                name="location"
                label="地区"
                placeholder="请选择地区"
                fieldProps={{
                  options: cascaderOptions,
                }}
              />
              
              <ProFormDatePicker
                name="birthday"
                label="生日"
                placeholder="请选择生日"
              />
              
              <ProFormDateRangePicker
                name="workPeriod"
                label="工作时间"
                placeholder={['开始日期', '结束日期']}
              />
              
              <ProFormTimePicker
                name="workTime"
                label="上班时间"
                placeholder="请选择时间"
              />
              
              <ProFormTimeRangePicker
                name="workTimeRange"
                label="工作时间段"
                placeholder={['开始时间', '结束时间']}
              />
              
              <ProFormDigit
                name="age"
                label="年龄"
                placeholder="请输入年龄"
                fieldProps={{ min: 0, max: 120 }}
              />
              
              <ProFormMoney
                name="salary"
                label="薪资"
                placeholder="请输入薪资"
              />
              
              <ProFormSlider
                name="experience"
                label="工作经验"
                fieldProps={{ min: 0, max: 10, marks: { 0: '0年', 5: '5年', 10: '10年+' } }}
              />
              
              <ProFormRate
                name="rating"
                label="评分"
              />
              
              <ProFormSwitch
                name="enabled"
                label="启用状态"
              />
              
              <ProFormRadio
                name="gender"
                label="性别"
                options={[
                  { label: '男', value: 'male' },
                  { label: '女', value: 'female' },
                ]}
              />
              
              <ProFormCheckbox
                name="hobbies"
                label="爱好"
                options={[
                  { label: '阅读', value: 'reading' },
                  { label: '音乐', value: 'music' },
                  { label: '运动', value: 'sports' },
                  { label: '旅行', value: 'travel' },
                ]}
              />
              
              <ProFormColorPicker
                name="color"
                label="主题色"
              />
              
              <ProFormUploadButton
                name="avatar"
                label="头像"
                fieldProps={{
                  action: '/api/upload',
                  accept: 'image/*',
                }}
              />
            </ProForm>
          </div>

          {/* 布局组件测试 */}
          <div>
            <h2>2. 布局组件测试</h2>
            <ProForm
              title="布局组件测试"
              onFinish={handleFinish}
            >
              <ProFormGroup title="基本信息">
                <ProFormText
                  name="companyName"
                  label="公司名称"
                  placeholder="请输入公司名称"
                />
                <ProFormText
                  name="contactPerson"
                  label="联系人"
                  placeholder="请输入联系人"
                />
              </ProFormGroup>
              
              <ProFormFieldSet name="address" label="地址信息">
                <ProFormText
                  name="province"
                  label="省份"
                  placeholder="请输入省份"
                />
                <ProFormText
                  name="city"
                  label="城市"
                  placeholder="请输入城市"
                />
                <ProFormText
                  name="district"
                  label="区县"
                  placeholder="请输入区县"
                />
              </ProFormFieldSet>
              
              <ProFormList
                name="members"
                label="团队成员"
                initialValue={[{}]}
                copyIconProps={false}
                deleteIconProps={false}
              >
                <ProFormText
                  name="name"
                  label="姓名"
                  placeholder="请输入姓名"
                />
                <ProFormText
                  name="position"
                  label="职位"
                  placeholder="请输入职位"
                />
              </ProFormList>
              
              <ProFormDependency name={['department']}>
                {({ department }) => {
                  if (department === 'tech') {
                    return (
                      <ProFormSelect
                        name="techStack"
                        label="技术栈"
                        placeholder="请选择技术栈"
                        options={[
                          { label: 'Vue.js', value: 'vue' },
                          { label: 'React', value: 'react' },
                          { label: 'Angular', value: 'angular' },
                        ]}
                      />
                    )
                  }
                  return null
                }}
              </ProFormDependency>
            </ProForm>
          </div>

          {/* 高级组件测试 */}
          <div>
            <h2>3. 高级组件测试</h2>
            
            <Space>
              <Button theme="primary" onClick={() => modalVisible.value = true}>
                打开 ModalForm
              </Button>
              <Button theme="primary" onClick={() => drawerVisible.value = true}>
                打开 DrawerForm
              </Button>
            </Space>
            
            <ModalForm
              title="编辑用户信息"
              visible={modalVisible.value}
              onVisibleChange={(visible) => modalVisible.value = visible}
              onFinish={handleFinish}
            >
              <ProFormText
                name="username"
                label="用户名"
                placeholder="请输入用户名"
                rules={[{ required: true, message: '请输入用户名' }]}
              />
              <ProFormTextArea
                name="bio"
                label="个人简介"
                placeholder="请输入个人简介"
              />
            </ModalForm>
            
            <DrawerForm
              title="创建项目"
              visible={drawerVisible.value}
              onVisibleChange={(visible) => drawerVisible.value = visible}
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
            </DrawerForm>
          </div>

          {/* 分步表单测试 */}
          <div>
            <h2>4. 分步表单测试</h2>
            <StepsForm
              current={currentStep.value}
              steps={steps}
              onCurrentChange={(current) => currentStep.value = current}
              onFinish={handleFinish}
            >
              {({ current, setFormRef }) => (
                <>
                  {current === 0 && (
                    <StepForm
                      ref={setFormRef(0)}
                      title="基本信息"
                    >
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
                    <StepForm
                      ref={setFormRef(1)}
                      title="详细信息"
                    >
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
                    <StepForm
                      ref={setFormRef(2)}
                      title="确认信息"
                    >
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

          {/* 查询筛选器测试 */}
          <div>
            <h2>5. 查询筛选器测试</h2>
            <QueryFilter
              onSearch={(values) => {
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

          {/* 轻量筛选器测试 */}
          <div>
            <h2>6. 轻量筛选器测试</h2>
            <LightFilter
              onFinish={(values) => {
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

export default TestForm