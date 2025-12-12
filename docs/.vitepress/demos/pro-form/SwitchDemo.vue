<script setup lang="ts">
  import { ProForm, ProFormSwitch } from '@/components/form'
  import { ref } from 'vue'

  const formRef = ref()
  const formData = ref({
    enabled: false,
    notification: true,
    darkMode: false,
  })

  const handleFinish = (values: any) => {
    console.log('表单数据:', values)
  }
</script>

<template>
  <ProForm ref="formRef" @finish="handleFinish">
    <ProFormSwitch name="enabled" label="启用状态" v-model="formData.enabled" />

    <ProFormSwitch
      name="notification"
      label="消息通知"
      v-model="formData.notification"
      :field-props="{
        label: ['开', '关'],
      }"
    />

    <ProFormSwitch
      name="darkMode"
      label="深色模式"
      v-model="formData.darkMode"
    />
  </ProForm>
</template>
