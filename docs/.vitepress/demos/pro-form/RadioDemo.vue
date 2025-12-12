<script setup lang="ts">
  import { ProForm, ProFormRadio } from '@/components/form'
  import { ref } from 'vue'

  const formRef = ref()
  const formData = ref({
    gender: '',
    size: '',
    status: '',
  })

  const handleFinish = (values: any) => {
    console.log('表单数据:', values)
  }
</script>

<template>
  <ProForm ref="formRef" @finish="handleFinish">
    <ProFormRadio
      name="gender"
      label="性别"
      v-model="formData.gender"
      :options="[
        { label: '男', value: 'male' },
        { label: '女', value: 'female' },
      ]"
      :rules="[{ required: true, message: '请选择性别' }]"
    />

    <ProFormRadio
      name="size"
      label="尺寸"
      v-model="formData.size"
      :options="[
        { label: '小', value: 'small' },
        { label: '中', value: 'medium' },
        { label: '大', value: 'large' },
      ]"
    />

    <ProFormRadio
      name="status"
      label="状态"
      v-model="formData.status"
      :options="[
        { label: '启用', value: 'enabled' },
        { label: '禁用', value: 'disabled' },
        { label: '待审核', value: 'pending' },
      ]"
    />
  </ProForm>
</template>
