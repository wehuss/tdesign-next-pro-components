<script setup lang="ts">
  import { ProForm, ProFormDateRangePicker } from '@/components/form'
  import { ref } from 'vue'

  const formRef = ref()
  const formData = ref({
    dateRange: [],
    vacationRange: [],
    monthRange: [],
  })

  const handleFinish = (values: any) => {
    console.log('表单数据:', values)
  }
</script>

<template>
  <ProForm ref="formRef" @finish="handleFinish">
    <ProFormDateRangePicker
      name="dateRange"
      label="日期范围"
      v-model="formData.dateRange"
      :field-props="{
        placeholder: ['开始日期', '结束日期'],
        clearable: true,
      }"
      :rules="[{ required: true, message: '请选择日期范围' }]"
    />

    <ProFormDateRangePicker
      name="vacationRange"
      label="休假时间"
      v-model="formData.vacationRange"
      :field-props="{
        placeholder: ['休假开始', '休假结束'],
        clearable: true,
        format: 'YYYY-MM-DD',
      }"
    />

    <ProFormDateRangePicker
      name="monthRange"
      label="月份范围"
      v-model="formData.monthRange"
      :field-props="{
        placeholder: ['开始月份', '结束月份'],
        mode: 'month',
        clearable: true,
      }"
    />
  </ProForm>
</template>
