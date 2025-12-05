# ModalForm 弹窗表单

ModalForm 是结合了 Modal 和 ProForm 的组件，用于在弹窗中展示表单。

## 基础用法

```vue
<script setup lang="ts">
  import { ref } from 'vue'
  import { Button } from 'tdesign-vue-next'
  import { ModalForm, ProFormText, ProFormSelect } from 'tdesign-pro-components'

  const visible = ref(false)

  const handleSubmit = async (values: any) => {
    console.log('表单数据:', values)
    // 模拟提交
    await new Promise(resolve => setTimeout(resolve, 1000))
    return true // 返回 true 关闭弹窗
  }
</script>

<template>
  <Button @click="visible = true">新建用户</Button>

  <ModalForm v-model:visible="visible" title="新建用户" @finish="handleSubmit">
    <ProFormText
      name="username"
      label="用户名"
      :rules="[{ required: true, message: '请输入用户名' }]"
    />
    <ProFormSelect
      name="role"
      label="角色"
      :options="[
        { label: '管理员', value: 'admin' },
        { label: '普通用户', value: 'user' },
      ]"
    />
  </ModalForm>
</template>
```

## 触发器

可以使用 `trigger` 插槽自定义触发按钮：

```vue
<script setup lang="ts">
  import { ModalForm, ProFormText } from 'tdesign-pro-components'
  import { Button } from 'tdesign-vue-next'

  const handleSubmit = async (values: any) => {
    console.log('表单数据:', values)
    return true
  }
</script>

<template>
  <ModalForm title="编辑信息" @finish="handleSubmit">
    <template #trigger>
      <Button theme="primary">编辑</Button>
    </template>

    <ProFormText name="name" label="名称" />
  </ModalForm>
</template>
```

## 编辑模式

传入 `initialValues` 可以设置表单初始值，适用于编辑场景：

```vue
<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { ModalForm, ProFormText, ProFormSelect } from 'tdesign-pro-components'

  const visible = ref(false)
  const currentRecord = ref<any>(null)

  const initialValues = computed(() => currentRecord.value || {})

  const handleEdit = (record: any) => {
    currentRecord.value = record
    visible.value = true
  }

  const handleSubmit = async (values: any) => {
    console.log('更新数据:', values)
    return true
  }
</script>

<template>
  <ModalForm
    v-model:visible="visible"
    title="编辑用户"
    :initialValues="initialValues"
    @finish="handleSubmit"
  >
    <ProFormText name="username" label="用户名" />
    <ProFormSelect
      name="status"
      label="状态"
      :options="[
        { label: '启用', value: 'active' },
        { label: '禁用', value: 'inactive' },
      ]"
    />
  </ModalForm>
</template>
```

## 自定义宽度

```vue
<template>
  <ModalForm title="大表单" width="800px" @finish="handleSubmit">
    <template #trigger>
      <Button>打开大表单</Button>
    </template>

    <ProFormGroup :col-props="{ span: 12 }">
      <ProFormText name="firstName" label="名" />
      <ProFormText name="lastName" label="姓" />
    </ProFormGroup>
  </ModalForm>
</template>
```

## 自定义底部按钮

```vue
<script setup lang="ts">
  import { ref } from 'vue'
  import { ModalForm, ProFormText } from 'tdesign-pro-components'

  const formRef = ref()

  const handleCustomSubmit = () => {
    formRef.value?.submit()
  }
</script>

<template>
  <ModalForm
    ref="formRef"
    title="自定义按钮"
    :submitter="false"
    @finish="handleSubmit"
  >
    <template #trigger>
      <Button>打开</Button>
    </template>

    <ProFormText name="name" label="名称" />

    <template #footer>
      <Button variant="outline" @click="visible = false">取消</Button>
      <Button theme="primary" @click="handleCustomSubmit">自定义提交</Button>
    </template>
  </ModalForm>
</template>
```

## API

### Props

| 属性                      | 说明                | 类型                           | 默认值  |
| ------------------------- | ------------------- | ------------------------------ | ------- |
| visible / v-model:visible | 弹窗显示状态        | `boolean`                      | `false` |
| title                     | 弹窗标题            | `string`                       | -       |
| width                     | 弹窗宽度            | `string \| number`             | `520`   |
| initialValues             | 表单初始值          | `object`                       | -       |
| onFinish                  | 提交成功回调        | `(values) => Promise<boolean>` | -       |
| submitter                 | 提交按钮配置        | `false \| SubmitterProps`      | -       |
| modalProps                | 传递给 Modal 的属性 | `ModalProps`                   | -       |

### Slots

| 插槽名  | 说明       |
| ------- | ---------- |
| default | 表单内容   |
| trigger | 触发按钮   |
| footer  | 自定义底部 |

### Events

| 事件名        | 说明             | 参数                         |
| ------------- | ---------------- | ---------------------------- |
| finish        | 表单提交成功     | `(values: any) => void`      |
| finishFailed  | 表单提交失败     | `(errors: any) => void`      |
| visibleChange | 弹窗显示状态变化 | `(visible: boolean) => void` |
