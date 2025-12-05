# QueryFilter 查询筛选

QueryFilter 是一个专门用于查询筛选的表单组件，支持展开收起、响应式布局等功能。

## 基础用法

```vue
<script setup lang="ts">
  import {
    QueryFilter,
    ProFormText,
    ProFormSelect,
    ProFormDateRangePicker,
  } from 'tdesign-pro-components'

  const handleSearch = (values: any) => {
    console.log('搜索条件:', values)
  }

  const handleReset = () => {
    console.log('重置')
  }
</script>

<template>
  <QueryFilter @finish="handleSearch" @reset="handleReset">
    <ProFormText name="keyword" label="关键词" />
    <ProFormSelect
      name="status"
      label="状态"
      :options="[
        { label: '全部', value: '' },
        { label: '启用', value: 'active' },
        { label: '禁用', value: 'inactive' },
      ]"
    />
    <ProFormDateRangePicker name="dateRange" label="日期范围" />
  </QueryFilter>
</template>
```

## 展开收起

当筛选项较多时，QueryFilter 会自动显示展开/收起按钮：

```vue
<script setup lang="ts">
  import {
    QueryFilter,
    ProFormText,
    ProFormSelect,
    ProFormDatePicker,
  } from 'tdesign-pro-components'

  const handleSearch = (values: any) => {
    console.log('搜索条件:', values)
  }
</script>

<template>
  <QueryFilter :defaultCollapsed="true" @finish="handleSearch">
    <ProFormText name="name" label="姓名" />
    <ProFormText name="phone" label="手机号" />
    <ProFormSelect
      name="status"
      label="状态"
      :options="[
        { label: '启用', value: 'active' },
        { label: '禁用', value: 'inactive' },
      ]"
    />
    <ProFormSelect
      name="department"
      label="部门"
      :options="[
        { label: '技术部', value: 'tech' },
        { label: '产品部', value: 'product' },
      ]"
    />
    <ProFormDatePicker name="startDate" label="开始日期" />
    <ProFormDatePicker name="endDate" label="结束日期" />
  </QueryFilter>
</template>
```

## 响应式布局

QueryFilter 支持响应式布局，会根据容器宽度自动调整列数：

```vue
<template>
  <QueryFilter :span="6" :labelWidth="80" @finish="handleSearch">
    <ProFormText name="name" label="姓名" />
    <ProFormText name="phone" label="手机号" />
    <ProFormSelect name="status" label="状态" :options="statusOptions" />
    <ProFormDatePicker name="date" label="日期" />
  </QueryFilter>
</template>
```

## 与 ProTable 配合

QueryFilter 通常与 ProTable 配合使用：

```vue
<script setup lang="ts">
  import { ref } from 'vue'
  import {
    ProTable,
    QueryFilter,
    ProFormText,
    ProFormSelect,
  } from 'tdesign-pro-components'

  const tableRef = ref()
  const searchParams = ref({})

  const columns = [
    { title: '姓名', colKey: 'name' },
    { title: '状态', colKey: 'status' },
    { title: '创建时间', colKey: 'createdAt' },
  ]

  const request = async (params: any) => {
    // 合并搜索参数
    const mergedParams = { ...params, ...searchParams.value }
    const response = await fetch('/api/users', {
      method: 'POST',
      body: JSON.stringify(mergedParams),
    })
    const data = await response.json()
    return { data: data.list, total: data.total, success: true }
  }

  const handleSearch = (values: any) => {
    searchParams.value = values
    tableRef.value?.reload()
  }

  const handleReset = () => {
    searchParams.value = {}
    tableRef.value?.reload()
  }
</script>

<template>
  <div>
    <QueryFilter @finish="handleSearch" @reset="handleReset">
      <ProFormText name="name" label="姓名" />
      <ProFormSelect
        name="status"
        label="状态"
        :options="[
          { label: '启用', value: 'active' },
          { label: '禁用', value: 'inactive' },
        ]"
      />
    </QueryFilter>

    <ProTable
      ref="tableRef"
      :columns="columns"
      :request="request"
      row-key="id"
      :search="false"
    />
  </div>
</template>
```

## 自定义按钮

```vue
<script setup lang="ts">
  import { QueryFilter, ProFormText } from 'tdesign-pro-components'
  import { Button } from 'tdesign-vue-next'

  const formRef = ref()

  const handleExport = () => {
    const values = formRef.value?.getFieldsValue()
    console.log('导出数据:', values)
  }
</script>

<template>
  <QueryFilter
    ref="formRef"
    :submitter="{
      submitText: '查询',
      resetText: '清空',
    }"
    @finish="handleSearch"
  >
    <ProFormText name="keyword" label="关键词" />

    <template #actions>
      <Button variant="outline" @click="handleExport">导出</Button>
    </template>
  </QueryFilter>
</template>
```

## API

### Props

| 属性             | 说明                   | 类型                           | 默认值  |
| ---------------- | ---------------------- | ------------------------------ | ------- |
| defaultCollapsed | 默认是否收起           | `boolean`                      | `true`  |
| collapsed        | 是否收起（受控）       | `boolean`                      | -       |
| span             | 每个表单项占据的栅格数 | `number`                       | `8`     |
| labelWidth       | 标签宽度               | `number \| string`             | `80`    |
| split            | 是否显示分割线         | `boolean`                      | `false` |
| submitter        | 提交按钮配置           | `false \| SubmitterProps`      | -       |
| onFinish         | 提交回调               | `(values) => void`             | -       |
| onReset          | 重置回调               | `() => void`                   | -       |
| onCollapse       | 展开/收起回调          | `(collapsed: boolean) => void` | -       |

### Slots

| 插槽名  | 说明           |
| ------- | -------------- |
| default | 表单项         |
| actions | 额外的操作按钮 |

### Events

| 事件名   | 说明      | 参数                           |
| -------- | --------- | ------------------------------ |
| finish   | 提交表单  | `(values: any) => void`        |
| reset    | 重置表单  | `() => void`                   |
| collapse | 展开/收起 | `(collapsed: boolean) => void` |
