<script setup lang="ts">
import { ProForm, ProFormCascader } from '@/components/form'
import { ref } from 'vue'

const formRef = ref()
const formData = ref({
  area: [],
  category: [],
})

const handleFinish = (values: any) => {
  console.log('表单数据:', values)
}

// 地区数据
const areaOptions = [
  {
    label: '北京',
    value: 'beijing',
    children: [
      { label: '朝阳区', value: 'chaoyang' },
      { label: '海淀区', value: 'haidian' },
      { label: '东城区', value: 'dongcheng' },
      { label: '西城区', value: 'xicheng' },
    ],
  },
  {
    label: '上海',
    value: 'shanghai',
    children: [
      { label: '浦东新区', value: 'pudong' },
      { label: '黄浦区', value: 'huangpu' },
      { label: '徐汇区', value: 'xuhui' },
    ],
  },
  {
    label: '广东',
    value: 'guangdong',
    children: [
      {
        label: '广州',
        value: 'guangzhou',
        children: [
          { label: '天河区', value: 'tianhe' },
          { label: '越秀区', value: 'yuexiu' },
        ],
      },
      {
        label: '深圳',
        value: 'shenzhen',
        children: [
          { label: '南山区', value: 'nanshan' },
          { label: '福田区', value: 'futian' },
        ],
      },
    ],
  },
]

// 分类数据
const categoryOptions = [
  {
    label: '电子产品',
    value: 'electronics',
    children: [
      { label: '手机', value: 'phone' },
      { label: '电脑', value: 'computer' },
      { label: '平板', value: 'tablet' },
    ],
  },
  {
    label: '服装',
    value: 'clothing',
    children: [
      { label: '男装', value: 'men' },
      { label: '女装', value: 'women' },
      { label: '童装', value: 'kids' },
    ],
  },
]
</script>

<template>
  <ProForm ref="formRef" @finish="handleFinish">
    <ProFormCascader
      name="area"
      label="地区"
      v-model="formData.area"
      :options="areaOptions"
      :field-props="{
        placeholder: '请选择地区',
        clearable: true,
      }"
      :rules="[{ required: true, message: '请选择地区' }]"
    />

    <ProFormCascader
      name="category"
      label="分类"
      v-model="formData.category"
      :options="categoryOptions"
      :field-props="{
        placeholder: '请选择分类',
        clearable: true,
        filterable: true,
      }"
    />
  </ProForm>
</template>
