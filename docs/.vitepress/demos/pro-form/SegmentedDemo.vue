<script setup lang="ts">
import { ProForm, ProFormSegmented } from '@/components/form'
import { ref } from 'vue'

const formRef = ref()
const formData = ref({
  status: 'pending',
  size: 'medium',
  view: 'list',
})

const handleFinish = (values: any) => {
  console.log('表单数据:', values)
}
</script>

<template>
  <ProForm ref="formRef" @finish="handleFinish">
    <ProFormSegmented
      name="status"
      label="状态"
      v-model="formData.status"
      :options="[
        { label: '待处理', value: 'pending' },
        { label: '进行中', value: 'processing' },
        { label: '已完成', value: 'completed' },
      ]"
      :rules="[{ required: true, message: '请选择状态' }]"
    />

    <ProFormSegmented
      name="size"
      label="尺寸"
      v-model="formData.size"
      :options="[
        { label: '小', value: 'small' },
        { label: '中', value: 'medium' },
        { label: '大', value: 'large' },
      ]"
    />

    <ProFormSegmented
      name="view"
      label="视图"
      v-model="formData.view"
      :options="[
        { label: '列表', value: 'list' },
        { label: '卡片', value: 'card' },
        { label: '表格', value: 'table' },
      ]"
    />
  </ProForm>
</template>
