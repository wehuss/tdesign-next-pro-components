<script setup lang="ts">
  import {
    ProForm,
    ProFormDependency,
    ProFormSelect,
    ProFormText,
  } from '@/components/form'
  import { ref } from 'vue'

  const formRef = ref()

  const handleFinish = (values: any) => {
    console.log('表单数据:', values)
  }
</script>

<template>
  <ProForm ref="formRef" @finish="handleFinish">
    <ProFormSelect
      name="type"
      label="类型"
      placeholder="请选择类型"
      :options="[
        { label: '个人', value: 'personal' },
        { label: '企业', value: 'company' },
      ]"
    />

    <ProFormDependency :name="['type']">
      <template #default="{ type }">
        <ProFormText
          v-if="type === 'personal'"
          name="idCard"
          label="身份证号"
          placeholder="请输入身份证号"
          :rules="[{ required: true, message: '请输入身份证号' }]"
        />
        <ProFormText
          v-else-if="type === 'company'"
          name="businessLicense"
          label="营业执照号"
          placeholder="请输入营业执照号"
          :rules="[{ required: true, message: '请输入营业执照号' }]"
        />
      </template>
    </ProFormDependency>

    <ProFormText name="contact" label="联系人" placeholder="请输入联系人" />
  </ProForm>
</template>
