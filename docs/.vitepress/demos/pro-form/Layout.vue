<script setup lang="ts">
  import {
    ProForm,
    ProFormGroup,
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
    <!-- 两列布局 -->
    <ProFormGroup title="基本信息" :colProps="{ span: 12 }">
      <ProFormText name="firstName" label="名" placeholder="请输入名" />
      <ProFormText name="lastName" label="姓" placeholder="请输入姓" />
    </ProFormGroup>

    <!-- 三列布局 -->
    <ProFormGroup title="地址信息" :colProps="{ span: 8 }">
      <ProFormSelect
        name="province"
        label="省"
        placeholder="请选择省"
        :options="[
          { label: '北京', value: 'beijing' },
          { label: '上海', value: 'shanghai' },
          { label: '广东', value: 'guangdong' },
        ]"
      />
      <ProFormSelect
        name="city"
        label="市"
        placeholder="请选择市"
        :options="[
          { label: '北京市', value: 'beijing' },
          { label: '上海市', value: 'shanghai' },
          { label: '广州市', value: 'guangzhou' },
        ]"
      />
      <ProFormText name="district" label="区" placeholder="请输入区" />
    </ProFormGroup>

    <!-- 详细地址 -->
    <ProFormText name="address" label="详细地址" placeholder="请输入详细地址" />
  </ProForm>
</template>
