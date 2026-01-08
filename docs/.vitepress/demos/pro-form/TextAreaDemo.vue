<script setup lang="ts">
import { ProForm, ProFormTextArea } from '@/components/form'
import { ref } from 'vue'

const formRef = ref()
const formData = ref({
  description: '',
  remark: '',
})

const handleFinish = (values: any) => {
  console.log('表单数据:', values)
}
</script>

<template>
  <ProForm ref="formRef" @finish="handleFinish">
    <ProFormTextArea
      name="description"
      label="描述"
      v-model="formData.description"
      :field-props="{
        placeholder: '请输入描述',
        autosize: { minRows: 2, maxRows: 4 },
      }"
      :rules="[{ required: true, message: '请输入描述' }]"
    />

    <ProFormTextArea
      name="remark"
      label="备注"
      v-model="formData.remark"
      :field-props="{
        placeholder: '请输入备注信息',
        maxlength: 200,
        autosize: { minRows: 3, maxRows: 6 },
      }"
    />
  </ProForm>
</template>
