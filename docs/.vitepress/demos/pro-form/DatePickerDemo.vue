<script setup lang="ts">
  import { ProForm, ProFormDatePicker } from '@/components/form'
  import { ref } from 'vue'

  const formRef = ref()
  const formData = ref({
    birthday: '',
    startDate: '',
    yearMonth: '',
  })

  const handleFinish = (values: any) => {
    console.log('表单数据:', values)
  }
</script>

<template>
  <ProForm ref="formRef" @finish="handleFinish">
    <ProFormDatePicker
      name="birthday"
      label="生日"
      v-model="formData.birthday"
      :field-props="{
        placeholder: '请选择日期',
        clearable: true,
      }"
      :rules="[{ required: true, message: '请选择生日' }]"
    />

    <ProFormDatePicker
      name="startDate"
      label="开始日期"
      v-model="formData.startDate"
      :field-props="{
        placeholder: '请选择开始日期',
        clearable: true,
        format: 'YYYY-MM-DD',
      }"
    />

    <ProFormDatePicker
      name="yearMonth"
      label="年月"
      v-model="formData.yearMonth"
      :field-props="{
        placeholder: '请选择年月',
        mode: 'month',
        clearable: true,
      }"
    />
  </ProForm>
</template>
