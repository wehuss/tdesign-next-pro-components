<script setup lang="ts">
  import {
  ProForm,
  ProFormDatePicker,
  ProFormSelect,
  ProFormSwitch,
  ProFormText,
} from '@/components/form'
import { MessagePlugin } from 'tdesign-vue-next'
import { ref } from 'vue'

  const formData = ref({
    username: '',
    role: '',
    birthday: '',
    enabled: false,
  })
  const formRef = ref()

  const handleFinish = async (values: any) => {
    console.log('表单数据:', values)
    MessagePlugin.success('提交成功')
  }

  const handleFinishFailed = (errors: any) => {
    console.log('验证失败:', errors)
  }
</script>

<template>
  <ProForm
    ref="formRef"
    @finish="handleFinish"
    @finishFailed="handleFinishFailed"
  >
    <ProFormText
      name="username"
      label="用户名"
      :field-props="{ placeholder: '请输入用户名' }"
      :rules="[{ required: true, message: '请输入用户名' }]"
      v-model="formData.username"
    />

    <ProFormSelect
      name="role"
      label="角色"
      :field-props="{ placeholder: '请选择角色' }"
      :options="[
        { label: '管理员', value: 'admin' },
        { label: '普通用户', value: 'user' },
        { label: '访客', value: 'guest' },
      ]"
      v-model="formData.role"
    />

    <ProFormDatePicker
      name="birthday"
      label="生日"
      :field-props="{ placeholder: '请选择日期' }"
      v-model="formData.birthday"
    />

    <ProFormSwitch name="enabled" label="启用状态" v-model="formData.enabled" />
  </ProForm>
</template>
