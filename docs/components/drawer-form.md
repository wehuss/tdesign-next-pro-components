# DrawerForm 抽屉表单

DrawerForm 是结合了 Drawer 和 ProForm 的组件，用于在抽屉中展示表单，适合需要更大空间的表单场景。

## 基础用法

```vue
<script setup lang="ts">
  import { ref } from 'vue'
  import { Button } from 'tdesign-vue-next'
  import {
    DrawerForm,
    ProFormText,
    ProFormTextArea,
    ProFormSelect,
  } from 'tdesign-pro-components'

  const visible = ref(false)

  const handleSubmit = async (values: any) => {
    console.log('表单数据:', values)
    await new Promise(resolve => setTimeout(resolve, 1000))
    return true
  }
</script>

<template>
  <Button @click="visible = true">新建</Button>

  <DrawerForm v-model:visible="visible" title="新建记录" @finish="handleSubmit">
    <ProFormText
      name="title"
      label="标题"
      :rules="[{ required: true, message: '请输入标题' }]"
    />
    <ProFormTextArea name="content" label="内容" :rows="6" />
    <ProFormSelect
      name="category"
      label="分类"
      :options="[
        { label: '技术', value: 'tech' },
        { label: '生活', value: 'life' },
      ]"
    />
  </DrawerForm>
</template>
```

## 触发器

使用 `trigger` 插槽自定义触发按钮：

```vue
<template>
  <DrawerForm title="详情编辑" @finish="handleSubmit">
    <template #trigger>
      <Button theme="primary" variant="text">编辑详情</Button>
    </template>

    <ProFormText name="name" label="名称" />
    <ProFormTextArea name="description" label="描述" />
  </DrawerForm>
</template>
```

## 抽屉位置

通过 `placement` 设置抽屉弹出位置：

```vue
<template>
  <t-space>
    <DrawerForm title="右侧抽屉" placement="right" @finish="handleSubmit">
      <template #trigger>
        <Button>右侧</Button>
      </template>
      <ProFormText name="name" label="名称" />
    </DrawerForm>

    <DrawerForm title="左侧抽屉" placement="left" @finish="handleSubmit">
      <template #trigger>
        <Button>左侧</Button>
      </template>
      <ProFormText name="name" label="名称" />
    </DrawerForm>

    <DrawerForm title="顶部抽屉" placement="top" @finish="handleSubmit">
      <template #trigger>
        <Button>顶部</Button>
      </template>
      <ProFormText name="name" label="名称" />
    </DrawerForm>

    <DrawerForm title="底部抽屉" placement="bottom" @finish="handleSubmit">
      <template #trigger>
        <Button>底部</Button>
      </template>
      <ProFormText name="name" label="名称" />
    </DrawerForm>
  </t-space>
</template>
```

## 自定义宽度

```vue
<template>
  <DrawerForm title="宽抽屉" width="600px" @finish="handleSubmit">
    <template #trigger>
      <Button>打开宽抽屉</Button>
    </template>

    <ProFormGroup :col-props="{ span: 12 }">
      <ProFormText name="firstName" label="名" />
      <ProFormText name="lastName" label="姓" />
    </ProFormGroup>

    <ProFormTextArea name="bio" label="简介" :rows="4" />
  </DrawerForm>
</template>
```

## 复杂表单

DrawerForm 适合展示复杂的多步骤或多分组表单：

```vue
<script setup lang="ts">
  import {
    DrawerForm,
    ProFormText,
    ProFormSelect,
    ProFormDatePicker,
    ProFormGroup,
  } from 'tdesign-pro-components'
  import { Divider } from 'tdesign-vue-next'

  const handleSubmit = async (values: any) => {
    console.log('表单数据:', values)
    return true
  }
</script>

<template>
  <DrawerForm title="用户详情" width="500px" @finish="handleSubmit">
    <template #trigger>
      <Button theme="primary">新建用户</Button>
    </template>

    <Divider>基本信息</Divider>
    <ProFormText name="username" label="用户名" />
    <ProFormText name="email" label="邮箱" />
    <ProFormText name="phone" label="手机号" />

    <Divider>工作信息</Divider>
    <ProFormSelect
      name="department"
      label="部门"
      :options="[
        { label: '技术部', value: 'tech' },
        { label: '产品部', value: 'product' },
        { label: '运营部', value: 'operation' },
      ]"
    />
    <ProFormText name="position" label="职位" />
    <ProFormDatePicker name="entryDate" label="入职日期" />

    <Divider>其他信息</Divider>
    <ProFormTextArea name="remark" label="备注" :rows="3" />
  </DrawerForm>
</template>
```

## API

### Props

| 属性                      | 说明                 | 类型                                     | 默认值    |
| ------------------------- | -------------------- | ---------------------------------------- | --------- |
| visible / v-model:visible | 抽屉显示状态         | `boolean`                                | `false`   |
| title                     | 抽屉标题             | `string`                                 | -         |
| width                     | 抽屉宽度（左右方向） | `string \| number`                       | `378`     |
| height                    | 抽屉高度（上下方向） | `string \| number`                       | -         |
| placement                 | 抽屉位置             | `'left' \| 'right' \| 'top' \| 'bottom'` | `'right'` |
| initialValues             | 表单初始值           | `object`                                 | -         |
| onFinish                  | 提交成功回调         | `(values) => Promise<boolean>`           | -         |
| submitter                 | 提交按钮配置         | `false \| SubmitterProps`                | -         |
| drawerProps               | 传递给 Drawer 的属性 | `DrawerProps`                            | -         |

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
| visibleChange | 抽屉显示状态变化 | `(visible: boolean) => void` |
