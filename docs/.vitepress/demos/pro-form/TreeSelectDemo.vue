<script setup lang="ts">
import { ProForm, ProFormTreeSelect } from '@/components/form'
import { ref } from 'vue'

const formRef = ref()
const formData = ref({
  department: '',
  departments: [],
})

const handleFinish = (values: any) => {
  console.log('表单数据:', values)
}

// 部门数据
const departmentOptions = [
  {
    label: '技术部',
    value: 'tech',
    children: [
      {
        label: '前端组',
        value: 'frontend',
        children: [
          { label: 'Vue 团队', value: 'vue-team' },
          { label: 'React 团队', value: 'react-team' },
        ],
      },
      {
        label: '后端组',
        value: 'backend',
        children: [
          { label: 'Java 团队', value: 'java-team' },
          { label: 'Go 团队', value: 'go-team' },
        ],
      },
      { label: '测试组', value: 'qa' },
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
  {
    label: '市场部',
    value: 'marketing',
    children: [
      { label: '品牌推广', value: 'brand' },
      { label: '渠道销售', value: 'sales' },
    ],
  },
]
</script>

<template>
  <ProForm ref="formRef" @finish="handleFinish">
    <ProFormTreeSelect
      name="department"
      label="部门（单选）"
      v-model="formData.department"
      :options="departmentOptions"
      :field-props="{
        placeholder: '请选择部门',
        clearable: true,
      }"
      :rules="[{ required: true, message: '请选择部门' }]"
    />

    <ProFormTreeSelect
      name="departments"
      label="部门（多选）"
      v-model="formData.departments"
      :options="departmentOptions"
      :field-props="{
        placeholder: '请选择部门',
        multiple: true,
        clearable: true,
      }"
    />
  </ProForm>
</template>
