<script setup lang="ts">
  import { ProForm, ProFormColorPicker } from '@/components/form'
  import { ref } from 'vue'

  const formRef = ref()
  const formData = ref({
    primaryColor: '#0052d9',
    backgroundColor: '#ffffff',
    textColor: '#333333',
  })

  const handleFinish = (values: any) => {
    console.log('表单数据:', values)
  }
</script>

<template>
  <ProForm ref="formRef" @finish="handleFinish">
    <ProFormColorPicker
      name="primaryColor"
      label="主题色"
      v-model="formData.primaryColor"
      :rules="[{ required: true, message: '请选择主题色' }]"
    />

    <ProFormColorPicker
      name="backgroundColor"
      label="背景色"
      v-model="formData.backgroundColor"
    />

    <ProFormColorPicker
      name="textColor"
      label="文字颜色"
      v-model="formData.textColor"
    />
  </ProForm>
</template>
