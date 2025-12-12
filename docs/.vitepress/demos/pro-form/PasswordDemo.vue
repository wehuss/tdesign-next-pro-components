<script setup lang="ts">
  import { ProForm, ProFormPassword } from '@/components/form'
  import { ref } from 'vue'

  const formRef = ref()
  const formData = ref({
    password: '',
    confirmPassword: '',
  })

  const handleFinish = (values: any) => {
    console.log('表单数据:', values)
  }

  // 确认密码验证
  const confirmPasswordValidator = (val: string) => {
    if (val !== formData.value.password) {
      return { result: false, message: '两次输入的密码不一致' }
    }
    return { result: true }
  }
</script>

<template>
  <ProForm ref="formRef" @finish="handleFinish">
    <ProFormPassword
      name="password"
      label="密码"
      v-model="formData.password"
      :field-props="{ placeholder: '请输入密码' }"
      :rules="[
        { required: true, message: '请输入密码' },
        { min: 6, message: '密码长度不能少于6位' },
      ]"
    />

    <ProFormPassword
      name="confirmPassword"
      label="确认密码"
      v-model="formData.confirmPassword"
      :field-props="{ placeholder: '请再次输入密码' }"
      :rules="[
        { required: true, message: '请确认密码' },
        { validator: confirmPasswordValidator },
      ]"
    />
  </ProForm>
</template>
