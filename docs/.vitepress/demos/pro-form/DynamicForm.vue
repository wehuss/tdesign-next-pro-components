<script setup lang="ts">
  import {
    ProForm,
    ProFormDigit,
    ProFormList,
    ProFormSelect,
    ProFormText,
  } from '@/components/form'
  import { MessagePlugin } from 'tdesign-vue-next'
  import { h, ref } from 'vue'

  const formRef = ref()

  const handleFinish = (values: any) => {
    console.log('表单数据:', values)
    MessagePlugin.success('提交成功')
  }

  // 技能等级选项
  const skillLevelOptions = [
    { label: '入门', value: 'beginner' },
    { label: '熟练', value: 'intermediate' },
    { label: '精通', value: 'expert' },
  ]

  // 联系方式类型选项
  const contactTypeOptions = [
    { label: '手机', value: 'phone' },
    { label: '邮箱', value: 'email' },
    { label: '微信', value: 'wechat' },
    { label: 'QQ', value: 'qq' },
  ]
</script>

<template>
  <ProForm ref="formRef" @finish="handleFinish">
    <!-- 基本信息 -->
    <ProFormText
      name="name"
      label="姓名"
      :field-props="{ placeholder: '请输入姓名' }"
      :rules="[{ required: true, message: '请输入姓名' }]"
    />

    <!-- 动态表单：联系方式列表 -->
    <ProFormList
      name="contacts"
      label="联系方式"
      :min="1"
      :max="5"
      :creator-button-props="{
        creatorButtonText: '添加联系方式',
        position: 'bottom',
      }"
      :creator-record="{ type: 'phone', value: '' }"
      :children="
        (field: { name: number; key: number }, index: number) => {
          return h(
            'div',
            {
              style: {
                display: 'flex',
                gap: '12px',
                alignItems: 'flex-start',
                marginBottom: '8px',
              },
            },
            [
              h(ProFormSelect, {
                name: [field.name, 'type'],
                label: index === 0 ? '类型' : '',
                fieldProps: {
                  placeholder: '选择类型',
                  style: { width: '120px' },
                },
                options: contactTypeOptions,
                style: { width: '140px' },
              }),
              h(ProFormText, {
                name: [field.name, 'value'],
                label: index === 0 ? '联系方式' : '',
                fieldProps: { placeholder: '请输入联系方式' },
                style: { flex: 1 },
              }),
            ]
          )
        }
      "
    />

    <!-- 动态表单：技能列表（带排序） -->
    <ProFormList
      name="skills"
      label="技能列表"
      :min="0"
      :max="10"
      :arrow-sort="true"
      :creator-button-props="{
        creatorButtonText: '添加技能',
        position: 'bottom',
      }"
      :creator-record="{ name: '', level: 'beginner', years: 1 }"
      :children="
        (field: { name: number; key: number }, index: number) => {
          return h(
            'div',
            {
              style: {
                display: 'flex',
                gap: '12px',
                alignItems: 'flex-start',
                marginBottom: '8px',
              },
            },
            [
              h(ProFormText, {
                name: [field.name, 'name'],
                label: index === 0 ? '技能名称' : '',
                fieldProps: { placeholder: '如：Vue.js' },
                style: { flex: 1 },
              }),
              h(ProFormSelect, {
                name: [field.name, 'level'],
                label: index === 0 ? '熟练程度' : '',
                fieldProps: { placeholder: '选择等级' },
                options: skillLevelOptions,
                style: { width: '120px' },
              }),
              h(ProFormDigit, {
                name: [field.name, 'years'],
                label: index === 0 ? '使用年限' : '',
                fieldProps: { placeholder: '年', min: 0, max: 50 },
                style: { width: '100px' },
              }),
            ]
          )
        }
      "
    />

    <!-- 动态表单：工作经历（复杂结构） -->
    <ProFormList
      name="workExperience"
      label="工作经历"
      :min="0"
      :max="5"
      :creator-button-props="{
        creatorButtonText: '添加工作经历',
        position: 'bottom',
      }"
      :creator-record="{
        company: '',
        position: '',
        startYear: new Date().getFullYear() - 1,
        endYear: new Date().getFullYear(),
        description: '',
      }"
      :always-show-item-label="true"
      :children="
        (field: { name: number; key: number }) => {
          return h(
            'div',
            {
              style: {
                padding: '16px',
                background: '#fafafa',
                borderRadius: '8px',
                marginBottom: '12px',
              },
            },
            [
              h(
                'div',
                {
                  style: { display: 'flex', gap: '12px', marginBottom: '12px' },
                },
                [
                  h(ProFormText, {
                    name: [field.name, 'company'],
                    label: '公司名称',
                    fieldProps: { placeholder: '请输入公司名称' },
                    style: { flex: 1 },
                    rules: [{ required: true, message: '请输入公司名称' }],
                  }),
                  h(ProFormText, {
                    name: [field.name, 'position'],
                    label: '职位',
                    fieldProps: { placeholder: '请输入职位' },
                    style: { flex: 1 },
                  }),
                ]
              ),
              h(
                'div',
                {
                  style: { display: 'flex', gap: '12px', marginBottom: '12px' },
                },
                [
                  h(ProFormDigit, {
                    name: [field.name, 'startYear'],
                    label: '入职年份',
                    fieldProps: { placeholder: '年份', min: 1990, max: 2030 },
                    style: { width: '150px' },
                  }),
                  h(ProFormDigit, {
                    name: [field.name, 'endYear'],
                    label: '离职年份',
                    fieldProps: {
                      placeholder: '年份（在职留空）',
                      min: 1990,
                      max: 2030,
                    },
                    style: { width: '150px' },
                  }),
                ]
              ),
              h(ProFormText, {
                name: [field.name, 'description'],
                label: '工作描述',
                fieldProps: { placeholder: '简要描述工作内容' },
              }),
            ]
          )
        }
      "
    />

    <!-- 动态表单：简单列表（只有一个字段） -->
    <ProFormList
      name="tags"
      label="标签"
      :min="0"
      :max="8"
      :copy-icon-props="false"
      :creator-button-props="{
        creatorButtonText: '添加标签',
        position: 'bottom',
      }"
      :creator-record="{ value: '' }"
      :children="
        (field: { name: number; key: number }) => {
          return h(ProFormText, {
            name: [field.name, 'value'],
            fieldProps: { placeholder: '输入标签', style: { width: '200px' } },
          })
        }
      "
    />
  </ProForm>
</template>

<style scoped>
  :deep(.pro-form-list-item) {
    margin-bottom: 8px;
  }

  :deep(.pro-form-list-action) {
    display: flex;
    gap: 8px;
    margin-left: 8px;
    padding-top: 4px;
  }

  :deep(.pro-form-list-action-icon) {
    cursor: pointer;
    color: #666;
    transition: color 0.2s;
  }

  :deep(.pro-form-list-action-icon:hover) {
    color: #0052d9;
  }

  :deep(.action-remove:hover) {
    color: #e34d59;
  }
</style>
