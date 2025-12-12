<script setup lang="ts">
  import { ProForm, ProFormSelect } from '@/components/form'
  import { ref } from 'vue'

  const formRef = ref()
  const formData = ref({
    city: '',
    cities: [],
    country: '',
  })

  const handleFinish = (values: any) => {
    console.log('表单数据:', values)
  }

  const cityOptions = [
    { label: '北京', value: 'beijing' },
    { label: '上海', value: 'shanghai' },
    { label: '广州', value: 'guangzhou' },
    { label: '深圳', value: 'shenzhen' },
    { label: '杭州', value: 'hangzhou' },
  ]

  const countryOptions = [
    { label: '中国', value: 'china' },
    { label: '美国', value: 'usa' },
    { label: '日本', value: 'japan' },
    { label: '韩国', value: 'korea' },
  ]
</script>

<template>
  <ProForm ref="formRef" @finish="handleFinish">
    <ProFormSelect
      name="city"
      label="城市（单选）"
      v-model="formData.city"
      :options="cityOptions"
      :field-props="{
        placeholder: '请选择城市',
        clearable: true,
      }"
      :rules="[{ required: true, message: '请选择城市' }]"
    />

    <ProFormSelect
      name="cities"
      label="城市（多选）"
      v-model="formData.cities"
      :options="cityOptions"
      :field-props="{
        placeholder: '请选择城市',
        multiple: true,
        clearable: true,
      }"
    />

    <ProFormSelect
      name="country"
      label="国家（可搜索）"
      v-model="formData.country"
      :options="countryOptions"
      :field-props="{
        placeholder: '请选择或搜索国家',
        filterable: true,
        clearable: true,
      }"
    />
  </ProForm>
</template>
