<script setup lang="ts">
  import { ProForm, ProFormDigit } from '@/components/form'
  import { ref } from 'vue'

  const formRef = ref()
  const formData = ref({
    age: undefined,
    quantity: 1,
    price: undefined,
  })

  const handleFinish = (values: any) => {
    console.log('表单数据:', values)
  }
</script>

<template>
  <ProForm ref="formRef" @finish="handleFinish">
    <ProFormDigit
      name="age"
      label="年龄"
      v-model="formData.age"
      :field-props="{
        placeholder: '请输入年龄',
        min: 0,
        max: 150,
      }"
      :rules="[{ required: true, message: '请输入年龄' }]"
    />

    <ProFormDigit
      name="quantity"
      label="数量"
      v-model="formData.quantity"
      :field-props="{
        placeholder: '请输入数量',
        min: 1,
        max: 999,
        step: 1,
      }"
    />

    <ProFormDigit
      name="price"
      label="价格"
      v-model="formData.price"
      :field-props="{
        placeholder: '请输入价格',
        min: 0,
        step: 0.01,
        decimalPlaces: 2,
      }"
    />
  </ProForm>
</template>
