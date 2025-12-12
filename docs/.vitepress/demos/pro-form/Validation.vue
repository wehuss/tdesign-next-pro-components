<script setup lang="ts">
  import {
    ProForm,
    ProFormDigit,
    ProFormSelect,
    ProFormText,
    ProFormTextArea,
  } from '@/components/form'
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

  // 自定义验证器：检查用户名是否已存在
  const checkUsername = (val: string) => {
    return new Promise<boolean>(resolve => {
      setTimeout(() => {
        // 模拟检查用户名是否已存在
        const existingUsers = ['admin', 'test', 'user']
        resolve(!existingUsers.includes(val))
      }, 500)
    })
  }

  // 自定义验证器：检查两次密码是否一致
  const validateConfirmPassword = (val: string) => {
    const password = formRef.value?.getFieldValue?.('password')
    return val === password
  }
</script>

<template>
  <ProForm
    ref="formRef"
    @finish="handleFinish"
    @finishFailed="handleFinishFailed"
  >
    <!-- 必填验证 -->
    <ProFormText
      name="username"
      label="用户名"
      :field-props="{ placeholder: '请输入用户名' }"
      :rules="[
        { required: true, message: '用户名不能为空' },
        { min: 3, max: 20, message: '用户名长度为 3-20 个字符' },
        {
          pattern: /^[a-zA-Z0-9_]+$/,
          message: '用户名只能包含字母、数字和下划线',
        },
        { validator: checkUsername, message: '用户名已存在' },
      ]"
    />

    <!-- 邮箱格式验证 -->
    <ProFormText
      name="email"
      label="邮箱"
      :field-props="{ placeholder: '请输入邮箱地址' }"
      :rules="[
        { required: true, message: '邮箱不能为空' },
        { email: true, message: '请输入有效的邮箱地址' },
      ]"
    />

    <!-- 密码验证 -->
    <ProFormText
      name="password"
      label="密码"
      :field-props="{ placeholder: '请输入密码', type: 'password' }"
      :rules="[
        { required: true, message: '密码不能为空' },
        { min: 6, max: 20, message: '密码长度为 6-20 个字符' },
        {
          pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
          message: '密码必须包含大小写字母和数字',
        },
      ]"
    />

    <!-- 确认密码 - 自定义验证 -->
    <ProFormText
      name="confirmPassword"
      label="确认密码"
      :field-props="{ placeholder: '请再次输入密码', type: 'password' }"
      :rules="[
        { required: true, message: '请确认密码' },
        { validator: validateConfirmPassword, message: '两次输入的密码不一致' },
      ]"
    />

    <!-- 数字范围验证 -->
    <ProFormDigit
      name="age"
      label="年龄"
      :field-props="{ placeholder: '请输入年龄', min: 1, max: 150 }"
      :rules="[
        { required: true, message: '年龄不能为空' },
        {
          type: 'number',
          min: 18,
          max: 100,
          message: '年龄必须在 18-100 之间',
        },
      ]"
    />

    <!-- 手机号验证 -->
    <ProFormText
      name="phone"
      label="手机号"
      :field-props="{ placeholder: '请输入手机号' }"
      :rules="[
        { required: true, message: '手机号不能为空' },
        { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号' },
      ]"
    />

    <!-- 选择验证 -->
    <ProFormSelect
      name="role"
      label="角色"
      :field-props="{ placeholder: '请选择角色' }"
      :options="[
        { label: '管理员', value: 'admin' },
        { label: '普通用户', value: 'user' },
        { label: '访客', value: 'guest' },
      ]"
      :rules="[{ required: true, message: '请选择角色' }]"
    />

    <!-- 文本域长度验证 -->
    <ProFormTextArea
      name="description"
      label="个人简介"
      :field-props="{
        placeholder: '请输入个人简介（10-200字）',
        autosize: { minRows: 3, maxRows: 6 },
        maxlength: 200,
      }"
      :rules="[{ min: 10, max: 200, message: '个人简介长度为 10-200 个字符' }]"
    />
  </ProForm>
</template>
