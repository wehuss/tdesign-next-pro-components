# ProForm 高级表单

ProForm 是基于 TDesign Form 封装的高级表单组件，提供了更便捷的表单开发体验。

## 基础用法

ProForm 提供了一系列预设的表单项组件，可以快速构建表单：

<DemoContainer title="基础用法">
  <ProFormBasic />
</DemoContainer>

::: details 查看代码

```vue
<script setup lang="ts">
  import {
    ProForm,
    ProFormText,
    ProFormSelect,
    ProFormDatePicker,
    ProFormSwitch,
  } from 'tdesign-pro-components'
  import { ref } from 'vue'
  import { MessagePlugin } from 'tdesign-vue-next'

  const formRef = ref()

  const handleFinish = async (values: any) => {
    console.log('表单数据:', values)
    MessagePlugin.success('提交成功')
  }

  const handleFinishFailed = (errors: any) => {
    console.log('验证失败:', errors)
  }
</script>

<template>
  <ProForm
    ref="formRef"
    @finish="handleFinish"
    @finishFailed="handleFinishFailed"
  >
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
        { label: '访客', value: 'guest' },
      ]"
    />

    <ProFormDatePicker name="birthday" label="生日" placeholder="请选择日期" />

    <ProFormSwitch name="enabled" label="启用状态" />
  </ProForm>
</template>
```

:::

## 表单项组件

ProForm 提供了丰富的表单项组件：

<DemoContainer title="表单项组件">
  <ProFormFormItems />
</DemoContainer>

::: details 查看代码

```vue
<script setup lang="ts">
  import {
    ProForm,
    ProFormText,
    ProFormTextArea,
    ProFormDigit,
    ProFormMoney,
    ProFormSelect,
    ProFormRadio,
    ProFormCheckbox,
    ProFormSwitch,
    ProFormDatePicker,
    ProFormTimePicker,
    ProFormRate,
    ProFormSlider,
    ProFormColorPicker,
  } from 'tdesign-pro-components'
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
```

:::

## 表单布局

使用 `ProFormGroup` 实现栅格布局：

<DemoContainer title="表单布局">
  <ProFormLayout />
</DemoContainer>

::: details 查看代码

```vue
<script setup lang="ts">
  import {
    ProForm,
    ProFormText,
    ProFormSelect,
    ProFormGroup,
  } from 'tdesign-pro-components'
  import { ref } from 'vue'

  const formRef = ref()

  const handleFinish = (values: any) => {
    console.log('表单数据:', values)
  }
</script>

<template>
  <ProForm ref="formRef" @finish="handleFinish">
    <!-- 两列布局 -->
    <ProFormGroup title="基本信息" :colProps="{ span: 12 }">
      <ProFormText name="firstName" label="名" placeholder="请输入名" />
      <ProFormText name="lastName" label="姓" placeholder="请输入姓" />
    </ProFormGroup>

    <!-- 三列布局 -->
    <ProFormGroup title="地址信息" :colProps="{ span: 8 }">
      <ProFormSelect
        name="province"
        label="省"
        placeholder="请选择省"
        :options="[
          { label: '北京', value: 'beijing' },
          { label: '上海', value: 'shanghai' },
          { label: '广东', value: 'guangdong' },
        ]"
      />
      <ProFormSelect
        name="city"
        label="市"
        placeholder="请选择市"
        :options="[
          { label: '北京市', value: 'beijing' },
          { label: '上海市', value: 'shanghai' },
          { label: '广州市', value: 'guangzhou' },
        ]"
      />
      <ProFormText name="district" label="区" placeholder="请输入区" />
    </ProFormGroup>

    <!-- 详细地址 -->
    <ProFormText name="address" label="详细地址" placeholder="请输入详细地址" />
  </ProForm>
</template>
```

:::

## 表单联动

使用 `ProFormDependency` 实现字段联动：

<DemoContainer title="表单联动">
  <ProFormDependency />
</DemoContainer>

::: details 查看代码

```vue
<script setup lang="ts">
  import {
    ProForm,
    ProFormText,
    ProFormSelect,
    ProFormDependency,
  } from 'tdesign-pro-components'
  import { ref } from 'vue'

  const formRef = ref()

  const handleFinish = (values: any) => {
    console.log('表单数据:', values)
  }
</script>

<template>
  <ProForm ref="formRef" @finish="handleFinish">
    <ProFormSelect
      name="type"
      label="类型"
      placeholder="请选择类型"
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
          placeholder="请输入身份证号"
          :rules="[{ required: true, message: '请输入身份证号' }]"
        />
        <ProFormText
          v-else-if="type === 'company'"
          name="businessLicense"
          label="营业执照号"
          placeholder="请输入营业执照号"
          :rules="[{ required: true, message: '请输入营业执照号' }]"
        />
      </template>
    </ProFormDependency>

    <ProFormText name="contact" label="联系人" placeholder="请输入联系人" />
  </ProForm>
</template>
```

:::

## 动态表单

使用 `ProFormList` 实现动态增减表单项：

<DemoContainer title="动态表单">
  <ProFormList />
</DemoContainer>

::: details 查看代码

```vue
<script setup lang="ts">
  import {
    ProForm,
    ProFormText,
    ProFormDigit,
    ProFormList,
  } from 'tdesign-pro-components'
  import { ref } from 'vue'

  const formRef = ref()

  const handleFinish = (values: any) => {
    console.log('表单数据:', values)
  }
</script>

<template>
  <ProForm ref="formRef" @finish="handleFinish">
    <ProFormList
      name="users"
      label="用户列表"
      :creatorButtonProps="{
        creatorButtonText: '添加用户',
        position: 'bottom',
      }"
      :min="1"
      :max="5"
    >
      <template #default="{ field, index }">
        <div style="display: flex; gap: 16px; margin-bottom: 8px">
          <ProFormText
            :name="[field.name, 'name']"
            :label="index === 0 ? '姓名' : ''"
            placeholder="请输入姓名"
            style="flex: 1"
          />
          <ProFormDigit
            :name="[field.name, 'age']"
            :label="index === 0 ? '年龄' : ''"
            placeholder="请输入年龄"
            style="width: 120px"
            :fieldProps="{ min: 0, max: 150 }"
          />
          <ProFormText
            :name="[field.name, 'phone']"
            :label="index === 0 ? '电话' : ''"
            placeholder="请输入电话"
            style="flex: 1"
          />
        </div>
      </template>
    </ProFormList>
  </ProForm>
</template>
```

:::

## 表单验证

ProForm 支持 TDesign Form 的所有验证规则：

<DemoContainer title="表单验证">
  <ProFormValidation />
</DemoContainer>

::: details 查看代码

```vue
<script setup lang="ts">
  import { ProForm, ProFormText, ProFormSelect } from 'tdesign-pro-components'
  import { ref } from 'vue'
  import { MessagePlugin } from 'tdesign-vue-next'

  const formRef = ref()

  const handleFinish = (values: any) => {
    console.log('表单数据:', values)
    MessagePlugin.success('验证通过，提交成功')
  }

  const handleFinishFailed = (errors: any) => {
    console.log('验证失败:', errors)
    MessagePlugin.error('表单验证失败，请检查输入')
  }
</script>

<template>
  <ProForm
    ref="formRef"
    @finish="handleFinish"
    @finishFailed="handleFinishFailed"
  >
    <ProFormText
      name="email"
      label="邮箱"
      placeholder="请输入邮箱"
      :rules="[
        { required: true, message: '请输入邮箱' },
        { email: true, message: '请输入正确的邮箱格式' },
      ]"
    />

    <ProFormText
      name="phone"
      label="手机号"
      placeholder="请输入手机号"
      :rules="[
        { required: true, message: '请输入手机号' },
        { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' },
      ]"
    />

    <ProFormText
      name="password"
      label="密码"
      placeholder="请输入密码"
      :fieldProps="{ type: 'password' }"
      :rules="[
        { required: true, message: '请输入密码' },
        { min: 6, max: 20, message: '密码长度为6-20位' },
      ]"
    />

    <ProFormText
      name="website"
      label="网站"
      placeholder="请输入网站地址"
      :rules="[{ url: true, message: '请输入正确的网址' }]"
    />

    <ProFormSelect
      name="country"
      label="国家"
      placeholder="请选择国家"
      :options="[
        { label: '中国', value: 'china' },
        { label: '美国', value: 'usa' },
        { label: '日本', value: 'japan' },
      ]"
      :rules="[{ required: true, message: '请选择国家' }]"
    />
  </ProForm>
</template>
```

:::

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

### ProFormGroup Props

| 属性     | 说明       | 类型     | 默认值 |
| -------- | ---------- | -------- | ------ |
| title    | 分组标题   | `string` | -      |
| colProps | 栅格列配置 | `object` | -      |
| rowProps | 栅格行配置 | `object` | -      |

### ProFormList Props

| 属性               | 说明           | 类型                 | 默认值     |
| ------------------ | -------------- | -------------------- | ---------- |
| name               | 字段名         | `string \| string[]` | -          |
| label              | 标签           | `string`             | -          |
| min                | 最小行数       | `number`             | `0`        |
| max                | 最大行数       | `number`             | `Infinity` |
| creatorButtonProps | 新增按钮配置   | `object \| false`    | -          |
| creatorRecord      | 新增行默认数据 | `object \| function` | -          |

### ProFormDependency Props

| 属性 | 说明         | 类型       | 默认值 |
| ---- | ------------ | ---------- | ------ |
| name | 依赖的字段名 | `string[]` | -      |
