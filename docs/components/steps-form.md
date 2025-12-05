# StepsForm 分步表单

StepsForm 是一个分步表单组件，适用于需要分步骤填写的复杂表单场景。

## 基础用法

```vue
<script setup lang="ts">
  import {
    StepsForm,
    StepForm,
    ProFormText,
    ProFormSelect,
    ProFormTextArea,
  } from 'tdesign-pro-components'

  const handleFinish = async (values: any) => {
    console.log('所有表单数据:', values)
    // 提交逻辑
    return true
  }
</script>

<template>
  <StepsForm @finish="handleFinish">
    <StepForm name="base" title="基本信息">
      <ProFormText
        name="username"
        label="用户名"
        :rules="[{ required: true, message: '请输入用户名' }]"
      />
      <ProFormText
        name="email"
        label="邮箱"
        :rules="[{ required: true, message: '请输入邮箱' }]"
      />
    </StepForm>

    <StepForm name="detail" title="详细信息">
      <ProFormSelect
        name="department"
        label="部门"
        :options="[
          { label: '技术部', value: 'tech' },
          { label: '产品部', value: 'product' },
        ]"
      />
      <ProFormText name="position" label="职位" />
    </StepForm>

    <StepForm name="confirm" title="确认提交">
      <ProFormTextArea name="remark" label="备注" :rows="4" />
    </StepForm>
  </StepsForm>
</template>
```

## 步骤验证

每个步骤可以独立验证，只有验证通过才能进入下一步：

```vue
<script setup lang="ts">
  import {
    StepsForm,
    StepForm,
    ProFormText,
    ProFormDigit,
  } from 'tdesign-pro-components'

  const handleStepChange = (current: number, values: any) => {
    console.log('当前步骤:', current)
    console.log('当前数据:', values)
  }
</script>

<template>
  <StepsForm @stepChange="handleStepChange" @finish="handleFinish">
    <StepForm name="account" title="账号信息">
      <ProFormText
        name="username"
        label="用户名"
        :rules="[
          { required: true, message: '请输入用户名' },
          { min: 3, max: 20, message: '用户名长度为3-20位' },
        ]"
      />
      <ProFormText
        name="password"
        label="密码"
        type="password"
        :rules="[
          { required: true, message: '请输入密码' },
          { min: 6, message: '密码至少6位' },
        ]"
      />
    </StepForm>

    <StepForm name="profile" title="个人资料">
      <ProFormText
        name="realName"
        label="真实姓名"
        :rules="[{ required: true, message: '请输入真实姓名' }]"
      />
      <ProFormDigit
        name="age"
        label="年龄"
        :min="1"
        :max="150"
        :rules="[{ required: true, message: '请输入年龄' }]"
      />
    </StepForm>

    <StepForm name="complete" title="完成">
      <div class="success-message">
        <t-icon
          name="check-circle"
          size="48px"
          color="var(--td-success-color)"
        />
        <p>信息填写完成，请确认提交</p>
      </div>
    </StepForm>
  </StepsForm>
</template>
```

## 垂直步骤条

```vue
<template>
  <StepsForm layout="vertical" @finish="handleFinish">
    <StepForm name="step1" title="第一步">
      <ProFormText name="field1" label="字段1" />
    </StepForm>

    <StepForm name="step2" title="第二步">
      <ProFormText name="field2" label="字段2" />
    </StepForm>

    <StepForm name="step3" title="第三步">
      <ProFormText name="field3" label="字段3" />
    </StepForm>
  </StepsForm>
</template>
```

## 自定义步骤图标

```vue
<template>
  <StepsForm @finish="handleFinish">
    <StepForm name="info" title="填写信息" icon="edit">
      <ProFormText name="name" label="名称" />
    </StepForm>

    <StepForm name="verify" title="验证" icon="secured">
      <ProFormText name="code" label="验证码" />
    </StepForm>

    <StepForm name="done" title="完成" icon="check">
      <div>提交成功</div>
    </StepForm>
  </StepsForm>
</template>
```

## 异步提交

每个步骤可以有独立的异步提交逻辑：

```vue
<script setup lang="ts">
  import { StepsForm, StepForm, ProFormText } from 'tdesign-pro-components'

  // 第一步提交
  const handleStep1Submit = async (values: any) => {
    console.log('第一步数据:', values)
    // 可以在这里做异步验证
    await validateUsername(values.username)
    return true // 返回 true 进入下一步
  }

  // 第二步提交
  const handleStep2Submit = async (values: any) => {
    console.log('第二步数据:', values)
    return true
  }

  // 最终提交
  const handleFinish = async (values: any) => {
    console.log('所有数据:', values)
    await submitForm(values)
    return true
  }
</script>

<template>
  <StepsForm @finish="handleFinish">
    <StepForm name="step1" title="第一步" @finish="handleStep1Submit">
      <ProFormText name="username" label="用户名" />
    </StepForm>

    <StepForm name="step2" title="第二步" @finish="handleStep2Submit">
      <ProFormText name="email" label="邮箱" />
    </StepForm>

    <StepForm name="step3" title="完成">
      <div>确认提交</div>
    </StepForm>
  </StepsForm>
</template>
```

## 受控模式

```vue
<script setup lang="ts">
  import { ref } from 'vue'
  import { StepsForm, StepForm, ProFormText } from 'tdesign-pro-components'
  import { Button } from 'tdesign-vue-next'

  const current = ref(0)

  const goToStep = (step: number) => {
    current.value = step
  }
</script>

<template>
  <div>
    <t-space>
      <Button @click="goToStep(0)">第一步</Button>
      <Button @click="goToStep(1)">第二步</Button>
      <Button @click="goToStep(2)">第三步</Button>
    </t-space>

    <StepsForm v-model:current="current" @finish="handleFinish">
      <StepForm name="step1" title="第一步">
        <ProFormText name="field1" label="字段1" />
      </StepForm>

      <StepForm name="step2" title="第二步">
        <ProFormText name="field2" label="字段2" />
      </StepForm>

      <StepForm name="step3" title="第三步">
        <ProFormText name="field3" label="字段3" />
      </StepForm>
    </StepsForm>
  </div>
</template>
```

## API

### StepsForm Props

| 属性                      | 说明                | 类型                           | 默认值         |
| ------------------------- | ------------------- | ------------------------------ | -------------- |
| current / v-model:current | 当前步骤            | `number`                       | `0`            |
| layout                    | 步骤条方向          | `'horizontal' \| 'vertical'`   | `'horizontal'` |
| onFinish                  | 最终提交回调        | `(values) => Promise<boolean>` | -              |
| onStepChange              | 步骤变化回调        | `(current, values) => void`    | -              |
| stepsProps                | 传递给 Steps 的属性 | `StepsProps`                   | -              |

### StepForm Props

| 属性        | 说明             | 类型                           | 默认值 |
| ----------- | ---------------- | ------------------------------ | ------ |
| name        | 步骤名称         | `string`                       | -      |
| title       | 步骤标题         | `string`                       | -      |
| description | 步骤描述         | `string`                       | -      |
| icon        | 步骤图标         | `string`                       | -      |
| onFinish    | 当前步骤提交回调 | `(values) => Promise<boolean>` | -      |

### Events

| 事件名     | 说明     | 参数                                     |
| ---------- | -------- | ---------------------------------------- |
| finish     | 最终提交 | `(values: any) => void`                  |
| stepChange | 步骤变化 | `(current: number, values: any) => void` |
