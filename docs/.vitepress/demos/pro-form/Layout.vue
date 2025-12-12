<script setup lang="ts">
  import {
    ProForm,
    ProFormGroup,
    ProFormSelect,
    ProFormText,
    ProFormTextArea,
  } from '@/components/form'
  import { ref } from 'vue'

  const formRef = ref()

  const handleFinish = (values: any) => {
    console.log('表单数据:', values)
  }
</script>

<template>
  <ProForm ref="formRef" @finish="handleFinish">
    <!-- 基本信息分组 - 水平布局 -->
    <ProFormGroup title="基本信息" direction="horizontal" :wrap="true">
      <ProFormText
        name="firstName"
        label="名"
        :field-props="{ placeholder: '请输入名' }"
        :style="{ width: '200px' }"
      />
      <ProFormText
        name="lastName"
        label="姓"
        :field-props="{ placeholder: '请输入姓' }"
        :style="{ width: '200px' }"
      />
      <ProFormText
        name="nickname"
        label="昵称"
        :field-props="{ placeholder: '请输入昵称' }"
        :style="{ width: '200px' }"
      />
    </ProFormGroup>

    <!-- 地址信息分组 - 可折叠 -->
    <ProFormGroup
      title="地址信息"
      direction="horizontal"
      :wrap="true"
      :collapsible="true"
    >
      <ProFormSelect
        name="province"
        label="省"
        :field-props="{ placeholder: '请选择省' }"
        :options="[
          { label: '北京', value: 'beijing' },
          { label: '上海', value: 'shanghai' },
          { label: '广东', value: 'guangdong' },
        ]"
        :style="{ width: '200px' }"
      />
      <ProFormSelect
        name="city"
        label="市"
        :field-props="{ placeholder: '请选择市' }"
        :options="[
          { label: '北京市', value: 'beijing' },
          { label: '上海市', value: 'shanghai' },
          { label: '广州市', value: 'guangzhou' },
        ]"
        :style="{ width: '200px' }"
      />
      <ProFormText
        name="district"
        label="区"
        :field-props="{ placeholder: '请输入区' }"
        :style="{ width: '200px' }"
      />
    </ProFormGroup>

    <!-- 详细地址 - 全宽 -->
    <ProFormTextArea
      name="address"
      label="详细地址"
      :field-props="{
        placeholder: '请输入详细地址',
        autosize: { minRows: 2, maxRows: 4 },
      }"
    />

    <!-- 垂直布局分组 -->
    <ProFormGroup title="其他信息" direction="vertical" size="small">
      <ProFormText
        name="email"
        label="邮箱"
        :field-props="{ placeholder: '请输入邮箱' }"
      />
      <ProFormText
        name="phone"
        label="电话"
        :field-props="{ placeholder: '请输入电话' }"
      />
    </ProFormGroup>
  </ProForm>
</template>
