<script setup lang="ts">
  import {
    ProForm,
    ProFormCascader,
    ProFormCheckbox,
    ProFormDatePicker,
    ProFormDateRangePicker,
    ProFormDigit,
    ProFormMoney,
    ProFormRadio,
    ProFormRate,
    ProFormSelect,
    ProFormSlider,
    ProFormSwitch,
    ProFormText,
    ProFormTextArea,
    ProFormTreeSelect,
  } from '@/components/form'
  import { Button, Space } from 'tdesign-vue-next'
  import { ref } from 'vue'

  const formRef = ref()
  const readonly = ref(true)

  // 表单初始数据
  const formData = ref({
    username: '张三',
    email: 'zhangsan@example.com',
    phone: '13800138000',
    age: 28,
    salary: 15000,
    gender: 'male',
    role: 'developer',
    department: 'frontend',
    skills: ['vue', 'react'],
    level: 'senior',
    birthday: '1995-06-15',
    workPeriod: ['2020-01-01', '2024-12-31'],
    enabled: true,
    rating: 4.5,
    progress: 75,
    area: ['guangdong', 'shenzhen'],
    description:
      '资深前端开发工程师，擅长 Vue.js 和 React 技术栈，有丰富的大型项目开发经验。',
  })

  // 级联选择数据
  const cascaderOptions = [
    {
      label: '广东省',
      value: 'guangdong',
      children: [
        { label: '深圳市', value: 'shenzhen' },
        { label: '广州市', value: 'guangzhou' },
      ],
    },
    {
      label: '北京市',
      value: 'beijing',
      children: [
        { label: '朝阳区', value: 'chaoyang' },
        { label: '海淀区', value: 'haidian' },
      ],
    },
  ]

  // 树选择数据
  const treeSelectOptions = [
    {
      label: '技术部',
      value: 'tech',
      children: [
        { label: '前端组', value: 'frontend' },
        { label: '后端组', value: 'backend' },
      ],
    },
    {
      label: '产品部',
      value: 'product',
      children: [
        { label: '产品设计', value: 'design' },
        { label: '产品运营', value: 'operation' },
      ],
    },
  ]

  const toggleReadonly = () => {
    readonly.value = !readonly.value
  }
</script>

<template>
  <div>
    <!-- 切换按钮 -->
    <Space style="margin-bottom: 16px">
      <Button @click="toggleReadonly">
        {{ readonly ? '切换到编辑模式' : '切换到只读模式' }}
      </Button>
      <span style="color: #666">
        当前模式: <strong>{{ readonly ? '只读' : '编辑' }}</strong>
      </span>
    </Space>

    <ProForm
      ref="formRef"
      :readonly="readonly"
      :submitter="!readonly"
      :initial-values="formData"
    >
      <!-- 文本输入 -->
      <ProFormText
        name="username"
        label="用户名"
        v-model="formData.username"
        :field-props="{ placeholder: '请输入用户名' }"
      />

      <ProFormText
        name="email"
        label="邮箱"
        v-model="formData.email"
        :field-props="{ placeholder: '请输入邮箱' }"
      />

      <ProFormText
        name="phone"
        label="手机号"
        v-model="formData.phone"
        :field-props="{ placeholder: '请输入手机号' }"
      />

      <ProFormTextArea
        name="description"
        label="个人简介"
        v-model="formData.description"
        :field-props="{
          placeholder: '请输入个人简介',
          autosize: { minRows: 2, maxRows: 4 },
        }"
      />

      <!-- 数字输入 -->
      <ProFormDigit
        name="age"
        label="年龄"
        v-model="formData.age"
        :field-props="{ placeholder: '请输入年龄' }"
      />

      <ProFormMoney
        name="salary"
        label="月薪"
        v-model="formData.salary"
        :field-props="{ placeholder: '请输入月薪' }"
      />

      <!-- 选择类 -->
      <ProFormRadio
        name="gender"
        label="性别"
        v-model="formData.gender"
        :options="[
          { label: '男', value: 'male' },
          { label: '女', value: 'female' },
        ]"
      />

      <ProFormSelect
        name="role"
        label="职位"
        v-model="formData.role"
        :field-props="{ placeholder: '请选择职位' }"
        :options="[
          { label: '开发工程师', value: 'developer' },
          { label: '产品经理', value: 'pm' },
          { label: '设计师', value: 'designer' },
        ]"
      />

      <ProFormTreeSelect
        name="department"
        label="部门"
        v-model="formData.department"
        :field-props="{ placeholder: '请选择部门' }"
        :options="treeSelectOptions"
      />

      <ProFormCheckbox
        name="skills"
        label="技能"
        v-model="formData.skills"
        :options="[
          { label: 'Vue.js', value: 'vue' },
          { label: 'React', value: 'react' },
          { label: 'Angular', value: 'angular' },
          { label: 'Node.js', value: 'node' },
        ]"
      />

      <ProFormCascader
        name="area"
        label="所在地区"
        v-model="formData.area"
        :field-props="{ placeholder: '请选择地区' }"
        :options="cascaderOptions"
      />

      <!-- 日期时间 -->
      <ProFormDatePicker
        name="birthday"
        label="生日"
        v-model="formData.birthday"
        :field-props="{ placeholder: '请选择日期' }"
      />

      <ProFormDateRangePicker
        name="workPeriod"
        label="工作时间"
        v-model="formData.workPeriod"
        :field-props="{ placeholder: ['开始日期', '结束日期'] }"
      />

      <!-- 其他组件 -->
      <ProFormSwitch
        name="enabled"
        label="在职状态"
        v-model="formData.enabled"
      />

      <ProFormRate
        name="rating"
        label="绩效评分"
        v-model="formData.rating"
        :field-props="{ allowHalf: true }"
      />

      <ProFormSlider
        name="progress"
        label="项目进度"
        v-model="formData.progress"
      />
    </ProForm>
  </div>
</template>

<style scoped>
  :deep(.t-form__label) {
    min-width: 100px;
  }
</style>
