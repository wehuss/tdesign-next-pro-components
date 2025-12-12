<script setup lang="ts">
  import { ProForm, ProFormSlider } from '@/components/form'
  import { ref } from 'vue'

  const formRef = ref()
  const formData = ref({
    progress: 50,
    volume: 30,
    range: [20, 80],
  })

  const handleFinish = (values: any) => {
    console.log('表单数据:', values)
  }
</script>

<template>
  <ProForm ref="formRef" @finish="handleFinish">
    <ProFormSlider
      name="progress"
      label="进度"
      v-model="formData.progress"
      :field-props="{
        min: 0,
        max: 100,
      }"
    />

    <ProFormSlider
      name="volume"
      label="音量"
      v-model="formData.volume"
      :field-props="{
        min: 0,
        max: 100,
        step: 10,
      }"
    />

    <ProFormSlider
      name="range"
      label="范围"
      v-model="formData.range"
      :field-props="{
        min: 0,
        max: 100,
        range: true,
      }"
    />
  </ProForm>
</template>
