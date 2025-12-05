<script setup lang="ts">
  import {
    ProForm,
    ProFormDigit,
    ProFormList,
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
    <ProFormList
      name="users"
      label="用户列表"
      :creatorButtonProps="{
        creatorButtonText: '添加用户',
        position: 'bottom',
      }"
      :min="1"
      :max="5"
    >
      <template #default="{ field, index }">
        <div style="display: flex; gap: 16px; margin-bottom: 8px">
          <ProFormText
            :name="[field.name, 'name']"
            :label="index === 0 ? '姓名' : ''"
            placeholder="请输入姓名"
            style="flex: 1"
          />
          <ProFormDigit
            :name="[field.name, 'age']"
            :label="index === 0 ? '年龄' : ''"
            placeholder="请输入年龄"
            style="width: 120px"
            :fieldProps="{ min: 0, max: 150 }"
          />
          <ProFormText
            :name="[field.name, 'phone']"
            :label="index === 0 ? '电话' : ''"
            placeholder="请输入电话"
            style="flex: 1"
          />
        </div>
      </template>
    </ProFormList>
  </ProForm>
</template>
