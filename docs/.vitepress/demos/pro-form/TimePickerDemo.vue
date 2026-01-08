<script setup lang="ts">
import { ProForm, ProFormTimePicker, ProFormTimeRangePicker } from '@/components/form'
import { ref } from 'vue'

const formRef = ref()
const formData = ref({
  workTime: '',
  meetingTime: '',
  timeRange: [],
})

const handleFinish = (values: any) => {
  console.log('表单数据:', values)
}
</script>

<template>
  <ProForm ref="formRef" @finish="handleFinish">
    <ProFormTimePicker
      name="workTime"
      label="上班时间"
      v-model="formData.workTime"
      :field-props="{
        placeholder: '请选择时间',
        clearable: true,
      }"
      :rules="[{ required: true, message: '请选择上班时间' }]"
    />

    <ProFormTimePicker
      name="meetingTime"
      label="会议时间"
      v-model="formData.meetingTime"
      :field-props="{
        placeholder: '请选择会议时间',
        clearable: true,
        format: 'HH:mm',
      }"
    />

    <ProFormTimeRangePicker
      name="timeRange"
      label="时间范围"
      v-model="formData.timeRange"
      :field-props="{
        placeholder: ['开始时间', '结束时间'],
        clearable: true,
      }"
    />
  </ProForm>
</template>
