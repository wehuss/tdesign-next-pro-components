<script setup lang="ts">
import { ProForm, ProFormText } from '@/components/form'
import { ref } from 'vue'

const formRef = ref()
const formData = ref({
  username: '',
  email: '',
  nickname: '',
})

const handleFinish = (values: any) => {
  console.log('表单数据:', values)
}
</script>

<template>
  <ProForm ref="formRef" @finish="handleFinish">
    <ProFormText
      name="username"
      label="用户名"
      v-model="formData.username"
      :field-props="{ placeholder: '请输入用户名' }"
      :rules="[{ required: true, message: '请输入用户名' }]"
    />

    <ProFormText
      name="email"
      label="邮箱"
      v-model="formData.email"
      :field-props="{
        placeholder: '请输入邮箱',
        prefixIcon: () => '📧',
      }"
      :rules="[
        { required: true, message: '请输入邮箱' },
        { email: true, message: '请输入有效的邮箱地址' },
      ]"
    />

    <ProFormText
      name="nickname"
      label="昵称"
      v-model="formData.nickname"
      :field-props="{
        placeholder: '请输入昵称',
        maxlength: 20,
        showLimitNumber: true,
      }"
    />
  </ProForm>
</template>
