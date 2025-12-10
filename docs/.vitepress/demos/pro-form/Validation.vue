<script setup lang="ts">
  import { ProForm, ProFormSelect, ProFormText } from '@/components/form'
import { MessagePlugin } from 'tdesign-vue-next'
import { ref } from 'vue'

  const formRef = ref()

  const handleFinish = (values: any) => {
    console.log('表单数据:', values)
    MessagePlugin.success('验证通过，提交成功')
  }

  const handleFinishFailed = (errors: any) => {
    console.log('验证失败:', errors)
    MessagePlugin.error('表单验证失败，请检查输入')
  }
</script>

<template>
  <ProForm
    ref="formRef"
    @finish="handleFinish"
    @finishFailed="handleFinishFailed"
  >
    <ProFormText
      name="email"
      label="邮箱"
      :field-props="{ placeholder: '请输入邮箱' }"
      :rules="[
        { required: true, message: '请输入邮箱' },
        { email: true, message: '请输入正确的邮箱格式' },
      ]"
    />

    <ProFormText
      name="phone"
      label="手机号"
      :field-props="{ placeholder: '请输入手机号' }"
      :rules="[
        { required: true, message: '请输入手机号' },
        { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' },
      ]"
    />

    <ProFormText
      name="password"
      label="密码"
      :field-props="{
        placeholder: '请输入密码',
        type: 'password',
      }"
      :rules="[
        { required: true, message: '请输入密码' },
        { min: 6, max: 20, message: '密码长度为6-20位' },
      ]"
    />

    <ProFormText
      name="website"
      label="网站"
      :field-props="{ placeholder: '请输入网站地址' }"
      :rules="[{ url: true, message: '请输入正确的网址' }]"
    />

    <ProFormSelect
      name="country"
      label="国家"
      :field-props="{ placeholder: '请选择国家' }"
      :options="[
        { label: '中国', value: 'china' },
        { label: '美国', value: 'usa' },
        { label: '日本', value: 'japan' },
      ]"
      :rules="[{ required: true, message: '请选择国家' }]"
    />
  </ProForm>
</template>
