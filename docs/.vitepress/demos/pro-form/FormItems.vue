<script setup lang="ts">
  import {
    ProForm,
    ProFormCheckbox,
    ProFormColorPicker,
    ProFormDatePicker,
    ProFormDigit,
    ProFormMoney,
    ProFormRadio,
    ProFormRate,
    ProFormSelect,
    ProFormSlider,
    ProFormSwitch,
    ProFormText,
    ProFormTextArea,
    ProFormTimePicker,
  } from '@/components/form'
  import { ref } from 'vue'

  const formRef = ref()

  const handleFinish = (values: any) => {
    console.log('表单数据:', values)
  }
</script>

<template>
  <ProForm ref="formRef" @finish="handleFinish">
    <!-- 文本输入 -->
    <ProFormText name="name" label="姓名" placeholder="请输入姓名" />

    <ProFormTextArea
      name="description"
      label="描述"
      placeholder="请输入描述"
      :fieldProps="{ autosize: { minRows: 2, maxRows: 4 } }"
    />

    <!-- 数字输入 -->
    <ProFormDigit
      name="age"
      label="年龄"
      placeholder="请输入年龄"
      :fieldProps="{ min: 0, max: 150 }"
    />

    <ProFormMoney name="salary" label="薪资" placeholder="请输入薪资" />

    <!-- 选择类 -->
    <ProFormSelect
      name="city"
      label="城市"
      placeholder="请选择城市"
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

    <!-- 日期时间 -->
    <ProFormDatePicker name="birthday" label="生日" placeholder="请选择日期" />

    <ProFormTimePicker
      name="workTime"
      label="上班时间"
      placeholder="请选择时间"
    />

    <!-- 其他组件 -->
    <ProFormSwitch name="enabled" label="启用" />

    <ProFormRate name="score" label="评分" />

    <ProFormSlider name="progress" label="进度" />

    <ProFormColorPicker name="color" label="颜色" />
  </ProForm>
</template>
