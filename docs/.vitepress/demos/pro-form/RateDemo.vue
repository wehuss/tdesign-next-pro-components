<script setup lang="ts">
  import { ProForm, ProFormRate } from '@/components/form'
  import { ref } from 'vue'

  const formRef = ref()
  const formData = ref({
    score: 3,
    satisfaction: 4,
    quality: 0,
  })

  const handleFinish = (values: any) => {
    console.log('表单数据:', values)
  }
</script>

<template>
  <ProForm ref="formRef" @finish="handleFinish">
    <ProFormRate
      name="score"
      label="评分"
      v-model="formData.score"
      :rules="[{ required: true, message: '请评分' }]"
    />

    <ProFormRate
      name="satisfaction"
      label="满意度"
      v-model="formData.satisfaction"
      :field-props="{
        count: 5,
        allowHalf: true,
      }"
    />

    <ProFormRate
      name="quality"
      label="质量评价"
      v-model="formData.quality"
      :field-props="{
        count: 10,
      }"
    />
  </ProForm>
</template>
