<script setup lang="ts">
import { ProForm, ProFormMoney } from '@/components/form'
import { ref } from 'vue'

const formRef = ref()
const formData = ref({
  salary: undefined,
  bonus: undefined,
  budget: undefined,
})

const handleFinish = (values: any) => {
  console.log('表单数据:', values)
}
</script>

<template>
  <ProForm ref="formRef" @finish="handleFinish">
    <ProFormMoney
      name="salary"
      label="薪资"
      v-model="formData.salary"
      :field-props="{
        placeholder: '请输入薪资',
      }"
      :rules="[{ required: true, message: '请输入薪资' }]"
    />

    <ProFormMoney
      name="bonus"
      label="奖金"
      v-model="formData.bonus"
      :field-props="{
        placeholder: '请输入奖金',
      }"
    />

    <ProFormMoney
      name="budget"
      label="预算"
      v-model="formData.budget"
      :field-props="{
        placeholder: '请输入预算',
      }"
    />
  </ProForm>
</template>
