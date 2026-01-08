<script setup lang="ts">
import { ProForm, ProFormCheckbox } from '@/components/form'
import { ref } from 'vue'

const formRef = ref()
const formData = ref({
  hobbies: [],
  skills: [],
  permissions: [],
})

const handleFinish = (values: any) => {
  console.log('表单数据:', values)
}
</script>

<template>
  <ProForm ref="formRef" @finish="handleFinish">
    <ProFormCheckbox
      name="hobbies"
      label="爱好"
      v-model="formData.hobbies"
      :options="[
        { label: '阅读', value: 'reading' },
        { label: '运动', value: 'sports' },
        { label: '音乐', value: 'music' },
        { label: '旅行', value: 'travel' },
      ]"
      :rules="[{ required: true, message: '请至少选择一个爱好' }]"
    />

    <ProFormCheckbox
      name="skills"
      label="技能"
      v-model="formData.skills"
      :options="[
        { label: 'JavaScript', value: 'js' },
        { label: 'TypeScript', value: 'ts' },
        { label: 'Vue', value: 'vue' },
        { label: 'React', value: 'react' },
      ]"
    />

    <ProFormCheckbox
      name="permissions"
      label="权限"
      v-model="formData.permissions"
      :options="[
        { label: '查看', value: 'view' },
        { label: '编辑', value: 'edit' },
        { label: '删除', value: 'delete' },
        { label: '管理', value: 'admin' },
      ]"
    />
  </ProForm>
</template>
