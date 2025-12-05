# ProForm 高级表单

ProForm 是基于 TDesign Form 封装的高级表单组件，提供了更便捷的表单开发体验。

## 基础用法

ProForm 提供了一系列预设的表单项组件，可以快速构建表单：

```vue
<script setup lang="ts">
  import { ref } from 'vue'
  import {
    ProForm,
    ProFormText,
    ProFormSelect,
    ProFormDatePicker,
    ProFormSwitch,
  } from 'tdesign-pro-components'

  const formRef = ref()

  const handleSubmit = async (values: any) => {
    console.log('表单数据:', values)
    // 提交逻辑
  }
</script>

<template>
  <ProForm ref="formRef" @finish="handleSubmit">
    <ProFormText
      name="username"
      label="用户名"
      placeholder="请输入用户名"
      :rules="[{ required: true, message: '请输入用户名' }]"
    />

    <ProFormSelect
      name="role"
      label="角色"
      placeholder="请选择角色"
      :options="[
        { label: '管理员', value: 'admin' },
        { label: '普通用户', value: 'user' },
      ]"
    />

    <ProFormDatePicker name="birthday" label="生日" placeholder="请选择日期" />

    <ProFormSwitch name="enabled" label="启用状态" />
  </ProForm>
</template>
```

## 表单项组件

ProForm 提供了丰富的表单项组件：

### 文本输入

```vue
<template>
  <ProForm>
    <!-- 单行文本 -->
    <ProFormText name="name" label="姓名" />

    <!-- 多行文本 -->
    <ProFormTextArea name="description" label="描述" :rows="4" />

    <!-- 数字输入 -->
    <ProFormDigit name="age" label="年龄" :min="0" :max="150" />

    <!-- 金额输入 -->
    <ProFormMoney name="salary" label="薪资" />
  </ProForm>
</template>
```

### 选择类

```vue
<template>
  <ProForm>
    <!-- 下拉选择 -->
    <ProFormSelect
      name="city"
      label="城市"
      :options="[
        { label: '北京', value: 'beijing' },
        { label: '上海', value: 'shanghai' },
      ]"
    />

    <!-- 单选框 -->
    <ProFormRadio
      name="gender"
      label="性别"
      :options="[
        { label: '男', value: 'male' },
        { label: '女', value: 'female' },
      ]"
    />

    <!-- 多选框 -->
    <ProFormCheckbox
      name="hobbies"
      label="爱好"
      :options="[
        { label: '阅读', value: 'reading' },
        { label: '运动', value: 'sports' },
        { label: '音乐', value: 'music' },
      ]"
    />

    <!-- 级联选择 -->
    <ProFormCascader name="area" label="地区" :options="areaOptions" />

    <!-- 树选择 -->
    <ProFormTreeSelect name="department" label="部门" :data="treeData" />
  </ProForm>
</template>
```

### 日期时间

```vue
<template>
  <ProForm>
    <!-- 日期选择 -->
    <ProFormDatePicker name="date" label="日期" />

    <!-- 日期范围 -->
    <ProFormDateRangePicker name="dateRange" label="日期范围" />

    <!-- 时间选择 -->
    <ProFormTimePicker name="time" label="时间" />
  </ProForm>
</template>
```

### 其他组件

```vue
<template>
  <ProForm>
    <!-- 开关 -->
    <ProFormSwitch name="enabled" label="启用" />

    <!-- 评分 -->
    <ProFormRate name="score" label="评分" />

    <!-- 滑块 -->
    <ProFormSlider name="progress" label="进度" />

    <!-- 颜色选择 -->
    <ProFormColorPicker name="color" label="颜色" />

    <!-- 上传按钮 -->
    <ProFormUploadButton name="avatar" label="头像" action="/api/upload" />

    <!-- 拖拽上传 -->
    <ProFormUploadDragger name="files" label="附件" action="/api/upload" />
  </ProForm>
</template>
```

## 表单布局

### 栅格布局

使用 `ProFormGroup` 实现栅格布局：

```vue
<template>
  <ProForm>
    <ProFormGroup :col-props="{ span: 12 }">
      <ProFormText name="firstName" label="名" />
      <ProFormText name="lastName" label="姓" />
    </ProFormGroup>

    <ProFormGroup :col-props="{ span: 8 }">
      <ProFormText name="province" label="省" />
      <ProFormText name="city" label="市" />
      <ProFormText name="district" label="区" />
    </ProFormGroup>
  </ProForm>
</template>
```

## 表单联动

使用 `ProFormDependency` 实现字段联动：

```vue
<script setup lang="ts">
  import {
    ProForm,
    ProFormSelect,
    ProFormText,
    ProFormDependency,
  } from 'tdesign-pro-components'
</script>

<template>
  <ProForm>
    <ProFormSelect
      name="type"
      label="类型"
      :options="[
        { label: '个人', value: 'personal' },
        { label: '企业', value: 'company' },
      ]"
    />

    <ProFormDependency :name="['type']">
      <template #default="{ type }">
        <ProFormText
          v-if="type === 'personal'"
          name="idCard"
          label="身份证号"
        />
        <ProFormText
          v-else-if="type === 'company'"
          name="businessLicense"
          label="营业执照号"
        />
      </template>
    </ProFormDependency>
  </ProForm>
</template>
```

## 动态表单

使用 `ProFormList` 实现动态增减表单项：

```vue
<script setup lang="ts">
  import {
    ProForm,
    ProFormList,
    ProFormText,
    ProFormDigit,
  } from 'tdesign-pro-components'
</script>

<template>
  <ProForm>
    <ProFormList name="users" label="用户列表">
      <template #default="{ field }">
        <ProFormText :name="[field.name, 'name']" label="姓名" />
        <ProFormDigit :name="[field.name, 'age']" label="年龄" />
      </template>
    </ProFormList>
  </ProForm>
</template>
```

## 表单验证

ProForm 支持 TDesign Form 的所有验证规则：

```vue
<template>
  <ProForm>
    <ProFormText
      name="email"
      label="邮箱"
      :rules="[
        { required: true, message: '请输入邮箱' },
        { email: true, message: '请输入正确的邮箱格式' },
      ]"
    />

    <ProFormText
      name="phone"
      label="手机号"
      :rules="[
        { required: true, message: '请输入手机号' },
        { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' },
      ]"
    />

    <ProFormText
      name="password"
      label="密码"
      type="password"
      :rules="[
        { required: true, message: '请输入密码' },
        { min: 6, max: 20, message: '密码长度为6-20位' },
      ]"
    />
  </ProForm>
</template>
```

## API

### ProForm Props

| 属性           | 说明         | 类型                      | 默认值  |
| -------------- | ------------ | ------------------------- | ------- |
| initialValues  | 初始值       | `object`                  | -       |
| onFinish       | 提交成功回调 | `(values) => void`        | -       |
| onFinishFailed | 提交失败回调 | `(errors) => void`        | -       |
| submitter      | 提交按钮配置 | `false \| SubmitterProps` | -       |
| readonly       | 只读模式     | `boolean`                 | `false` |
| grid           | 开启栅格布局 | `boolean`                 | `false` |

### 通用表单项 Props

所有 ProForm 表单项组件都支持以下属性：

| 属性        | 说明                 | 类型                                     | 默认值  |
| ----------- | -------------------- | ---------------------------------------- | ------- |
| name        | 字段名               | `string \| string[]`                     | -       |
| label       | 标签                 | `string`                                 | -       |
| rules       | 验证规则             | `FormRule[]`                             | -       |
| tooltip     | 提示信息             | `string`                                 | -       |
| placeholder | 占位符               | `string`                                 | -       |
| disabled    | 禁用                 | `boolean`                                | `false` |
| readonly    | 只读                 | `boolean`                                | `false` |
| width       | 宽度                 | `number \| 'sm' \| 'md' \| 'lg' \| 'xl'` | -       |
| fieldProps  | 传递给底层组件的属性 | `object`                                 | -       |

### SubmitterProps

| 属性              | 说明         | 类型                    | 默认值   |
| ----------------- | ------------ | ----------------------- | -------- |
| submitText        | 提交按钮文字 | `string`                | `'提交'` |
| resetText         | 重置按钮文字 | `string`                | `'重置'` |
| submitButtonProps | 提交按钮属性 | `ButtonProps`           | -        |
| resetButtonProps  | 重置按钮属性 | `ButtonProps`           | -        |
| render            | 自定义渲染   | `(props, dom) => VNode` | -        |
