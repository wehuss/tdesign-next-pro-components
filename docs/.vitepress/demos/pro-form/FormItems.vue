<script setup lang="ts">
import {
  ProForm,
  ProFormCascader,
  ProFormCheckbox,
  ProFormColorPicker,
  ProFormDatePicker,
  ProFormDateRangePicker,
  ProFormDigit,
  ProFormMoney,
  ProFormRadio,
  ProFormRate,
  ProFormSegmented,
  ProFormSelect,
  ProFormSlider,
  ProFormSwitch,
  ProFormText,
  ProFormTextArea,
  ProFormTimePicker,
  ProFormTreeSelect,
} from '@/components/form'
import { ref } from 'vue'

const formRef = ref()

const handleFinish = (values: any) => {
  console.log('表单数据:', values)
}

// 级联选择数据
const cascaderOptions = [
  {
    label: '北京',
    value: 'beijing',
    children: [
      { label: '朝阳区', value: 'chaoyang' },
      { label: '海淀区', value: 'haidian' },
    ],
  },
  {
    label: '上海',
    value: 'shanghai',
    children: [
      { label: '浦东新区', value: 'pudong' },
      { label: '黄浦区', value: 'huangpu' },
    ],
  },
]

// 树选择数据
const treeSelectOptions = [
  {
    label: '技术部',
    value: 'tech',
    children: [
      { label: '前端组', value: 'frontend' },
      { label: '后端组', value: 'backend' },
    ],
  },
  {
    label: '产品部',
    value: 'product',
    children: [
      { label: '产品设计', value: 'design' },
      { label: '产品运营', value: 'operation' },
    ],
  },
]
</script>

<template>
  <ProForm ref="formRef" @finish="handleFinish">
    <!-- 文本输入 -->
    <ProFormText name="name" label="姓名" :field-props="{ placeholder: '请输入姓名' }" />

    <ProFormTextArea
      name="description"
      label="描述"
      :field-props="{
        placeholder: '请输入描述',
        autosize: { minRows: 2, maxRows: 4 },
      }"
    />

    <!-- 数字输入 -->
    <ProFormDigit
      name="age"
      label="年龄"
      :field-props="{
        placeholder: '请输入年龄',
        min: 0,
        max: 150,
      }"
    />

    <ProFormMoney name="salary" label="薪资" :field-props="{ placeholder: '请输入薪资' }" />

    <!-- 选择类 -->
    <ProFormSelect
      name="city"
      label="城市"
      :field-props="{ placeholder: '请选择城市' }"
      :options="[
        { label: '北京', value: 'beijing' },
        { label: '上海', value: 'shanghai' },
        { label: '广州', value: 'guangzhou' },
      ]"
    />

    <ProFormRadio
      name="gender"
      label="性别"
      :options="[
        { label: '男', value: 'male' },
        { label: '女', value: 'female' },
      ]"
    />

    <ProFormCheckbox
      name="hobbies"
      label="爱好"
      :options="[
        { label: '阅读', value: 'reading' },
        { label: '运动', value: 'sports' },
        { label: '音乐', value: 'music' },
      ]"
    />

    <ProFormSegmented
      name="status"
      label="状态"
      :options="[
        { label: '待处理', value: 'pending' },
        { label: '进行中', value: 'processing' },
        { label: '已完成', value: 'completed' },
      ]"
    />

    <!-- 级联和树选择 -->
    <ProFormCascader
      name="area"
      label="地区"
      :field-props="{ placeholder: '请选择地区' }"
      :options="cascaderOptions"
    />

    <ProFormTreeSelect
      name="department"
      label="部门"
      :field-props="{ placeholder: '请选择部门' }"
      :options="treeSelectOptions"
    />

    <!-- 日期时间 -->
    <ProFormDatePicker name="birthday" label="生日" :field-props="{ placeholder: '请选择日期' }" />

    <ProFormDateRangePicker
      name="dateRange"
      label="日期范围"
      :field-props="{ placeholder: ['开始日期', '结束日期'] }"
    />

    <ProFormTimePicker
      name="workTime"
      label="上班时间"
      :field-props="{ placeholder: '请选择时间' }"
    />

    <!-- 其他组件 -->
    <ProFormSwitch name="enabled" label="启用" />

    <ProFormRate name="score" label="评分" />

    <ProFormSlider name="progress" label="进度" />

    <ProFormColorPicker name="color" label="颜色" />
  </ProForm>
</template>
