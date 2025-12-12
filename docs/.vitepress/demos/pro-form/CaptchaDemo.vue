<script setup lang="ts">
  import { ProForm, ProFormCaptcha, ProFormText } from '@/components/form'
  import { MessagePlugin } from 'tdesign-vue-next'
  import { ref } from 'vue'

  const formRef = ref()
  const formData = ref({
    phone: '',
    captcha: '',
  })

  const handleFinish = (values: any) => {
    console.log('表单数据:', values)
  }

  // 模拟获取验证码
  const handleGetCaptcha = async (phone: string) => {
    if (!formData.value.phone) {
      MessagePlugin.warning('请先输入手机号')
      return
    }
    // 模拟发送验证码
    console.log('发送验证码到:', phone || formData.value.phone)
    MessagePlugin.success('验证码已发送')
  }
</script>

<template>
  <ProForm ref="formRef" @finish="handleFinish">
    <ProFormText
      name="phone"
      label="手机号"
      v-model="formData.phone"
      :field-props="{ placeholder: '请输入手机号' }"
      :rules="[
        { required: true, message: '请输入手机号' },
        { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号' },
      ]"
    />

    <ProFormCaptcha
      name="captcha"
      label="验证码"
      v-model="formData.captcha"
      :field-props="{ placeholder: '请输入验证码' }"
      :rules="[
        { required: true, message: '请输入验证码' },
        { len: 6, message: '验证码为6位数字' },
      ]"
      :captcha-props="{
        onGetCaptcha: handleGetCaptcha,
      }"
    />
  </ProForm>
</template>
