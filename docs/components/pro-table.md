# ProTable 高级表格

ProTable 是基于 TDesign Table 封装的高级表格组件，在原有功能基础上增加了数据请求、列配置、工具栏等功能。

## 基础用法

最简单的用法，只需要配置 `columns` 和 `request` 即可：

<DemoContainer title="基础用法">
  <ProTableBasic />
</DemoContainer>

::: details 查看代码

```vue
<script setup lang="ts">
  import { ProTable } from 'tdesign-pro-components'
  import type { ProTableColumn } from 'tdesign-pro-components'

  const columns: ProTableColumn[] = [
    { title: '姓名', colKey: 'name' },
    { title: '年龄', colKey: 'age' },
    { title: '地址', colKey: 'address' },
  ]

  const request = async (params: any) => {
    const response = await fetch('/api/users', {
      method: 'POST',
      body: JSON.stringify(params),
    })
    const data = await response.json()

    return {
      data: data.list,
      total: data.total,
      success: true,
    }
  }
</script>

<template>
  <ProTable :columns="columns" :request="request" row-key="id" />
</template>
```

:::

## valueType 自动渲染

通过 `valueType` 可以让表格自动渲染对应的字段类型：

<DemoContainer title="valueType 自动渲染">
  <ProTableValueType />
</DemoContainer>

::: details 查看代码

```vue
<script setup lang="ts">
  import { ProTable } from 'tdesign-pro-components'
  import type { ProTableColumn } from 'tdesign-pro-components'

  const columns: ProTableColumn[] = [
    {
      title: '序号',
      colKey: 'index',
      valueType: 'indexBorder',
      width: 80,
    },
    {
      title: '用户名',
      colKey: 'username',
      valueType: 'text',
    },
    {
      title: '金额',
      colKey: 'amount',
      valueType: 'money',
    },
    {
      title: '状态',
      colKey: 'status',
      valueType: 'select',
      valueEnum: {
        active: { text: '启用', status: 'success' },
        inactive: { text: '禁用', status: 'error' },
      },
    },
    {
      title: '进度',
      colKey: 'progress',
      valueType: 'progress',
    },
    {
      title: '创建时间',
      colKey: 'createdAt',
      valueType: 'dateTime',
    },
  ]

  const request = async () => {
    return {
      data: [
        {
          id: 1,
          username: '张三',
          amount: 12345.67,
          status: 'active',
          progress: 75,
          createdAt: '2024-01-15 10:30:00',
        },
      ],
      total: 1,
      success: true,
    }
  }
</script>

<template>
  <ProTable :columns="columns" :request="request" row-key="id" />
</template>
```

:::

## 工具栏

ProTable 内置了工具栏，支持标题、刷新、列设置等功能：

<DemoContainer title="工具栏">
  <ProTableToolbar />
</DemoContainer>

::: details 查看代码

```vue
<script setup lang="ts">
  import { ref } from 'vue'
  import { ProTable } from 'tdesign-pro-components'

  const tableRef = ref()

  const columns = [
    { title: '姓名', colKey: 'name' },
    { title: '年龄', colKey: 'age' },
  ]

  const request = async () => ({
    data: [
      { id: 1, name: '张三', age: 25 },
      { id: 2, name: '李四', age: 30 },
    ],
    total: 2,
    success: true,
  })

  const handleRefresh = () => {
    tableRef.value?.reload()
  }
</script>

<template>
  <t-space direction="vertical" style="width: 100%">
    <t-button @click="handleRefresh">手动刷新</t-button>
    <ProTable
      ref="tableRef"
      :columns="columns"
      :request="request"
      row-key="id"
      header-title="用户管理"
      :toolbar="true"
    />
  </t-space>
</template>
```

:::

## 静态数据

如果不需要请求数据，可以直接传入 `dataSource`：

<DemoContainer title="静态数据">
  <ProTableStatic />
</DemoContainer>

::: details 查看代码

```vue
<script setup lang="ts">
  import { ref } from 'vue'
  import { ProTable } from 'tdesign-pro-components'

  const columns = [
    { title: '姓名', colKey: 'name' },
    { title: '年龄', colKey: 'age' },
  ]

  const dataSource = ref([
    { id: 1, name: '张三', age: 25 },
    { id: 2, name: '李四', age: 30 },
    { id: 3, name: '王五', age: 28 },
  ])
</script>

<template>
  <ProTable :columns="columns" :dataSource="dataSource" row-key="id" />
</template>
```

:::

## 分页配置

ProTable 内置了分页功能，会自动处理分页参数：

<DemoContainer title="分页配置">
  <ProTablePagination />
</DemoContainer>

::: details 查看代码

```vue
<script setup lang="ts">
  import { ProTable } from 'tdesign-pro-components'

  const columns = [
    { title: '姓名', colKey: 'name' },
    { title: '年龄', colKey: 'age' },
    { title: '邮箱', colKey: 'email' },
    { title: '地址', colKey: 'address' },
  ]

  // request 会自动接收分页参数
  const request = async (params: { current: number; pageSize: number }) => {
    console.log('当前页:', params.current)
    console.log('每页条数:', params.pageSize)

    // 模拟生成数据
    const data = []
    const start = (params.current - 1) * params.pageSize
    for (let i = 0; i < params.pageSize; i++) {
      const index = start + i + 1
      data.push({
        id: index,
        name: `用户${index}`,
        age: 20 + (index % 30),
        email: `user${index}@example.com`,
        address: `地址${index}`,
      })
    }

    return {
      data,
      total: 100,
      success: true,
    }
  }
</script>

<template>
  <ProTable
    :columns="columns"
    :request="request"
    row-key="id"
    :pagination="{
      pageSize: 10,
      pageSizeOptions: [5, 10, 20, 50],
      showJumper: true,
    }"
  />
</template>
```

:::

## 操作列

可以通过 `render` 自定义操作列：

<DemoContainer title="操作列">
  <ProTableActions />
</DemoContainer>

::: details 查看代码

```vue
<script setup lang="ts">
  import { h } from 'vue'
  import { Button, Space, MessagePlugin, Popconfirm } from 'tdesign-vue-next'
  import { ProTable } from 'tdesign-pro-components'
  import type { ProTableColumn } from 'tdesign-pro-components'

  const handleView = (row: any) => {
    MessagePlugin.info(`查看用户: ${row.name}`)
  }

  const handleEdit = (row: any) => {
    MessagePlugin.info(`编辑用户: ${row.name}`)
  }

  const handleDelete = (row: any) => {
    MessagePlugin.success(`删除用户: ${row.name}`)
  }

  const columns: ProTableColumn[] = [
    { title: '姓名', colKey: 'name' },
    { title: '年龄', colKey: 'age' },
    {
      title: '操作',
      colKey: 'action',
      width: 200,
      render: ({ row }) =>
        h(Space, { size: 'small' }, () => [
          h(
            Button,
            {
              theme: 'primary',
              variant: 'text',
              size: 'small',
              onClick: () => handleView(row),
            },
            () => '查看'
          ),
          h(
            Button,
            {
              theme: 'primary',
              variant: 'text',
              size: 'small',
              onClick: () => handleEdit(row),
            },
            () => '编辑'
          ),
          h(
            Popconfirm,
            {
              content: '确定删除该用户吗？',
              onConfirm: () => handleDelete(row),
            },
            () =>
              h(
                Button,
                {
                  theme: 'danger',
                  variant: 'text',
                  size: 'small',
                },
                () => '删除'
              )
          ),
        ]),
    },
  ]
</script>

<template>
  <ProTable :columns="columns" :request="request" row-key="id" />
</template>
```

:::

## ActionRef

通过 ref 可以获取表格实例，调用内置方法：

<DemoContainer title="ActionRef">
  <ProTableActionRef />
</DemoContainer>

::: details 查看代码

```vue
<script setup lang="ts">
  import { ref } from 'vue'
  import { ProTable } from 'tdesign-pro-components'
  import type { ActionRef } from 'tdesign-pro-components'

  const tableRef = ref<ActionRef>()

  // 手动刷新表格
  const handleRefresh = () => {
    tableRef.value?.reload()
  }

  // 重置并刷新
  const handleReset = () => {
    tableRef.value?.reloadAndRest()
  }
</script>

<template>
  <t-space direction="vertical" style="width: 100%">
    <t-space>
      <t-button @click="handleRefresh">刷新</t-button>
      <t-button @click="handleReset">重置</t-button>
    </t-space>

    <ProTable
      ref="tableRef"
      :columns="columns"
      :request="request"
      row-key="id"
    />
  </t-space>
</template>
```

:::

## API

### Props

| 属性         | 说明               | 类型                                 | 默认值  |
| ------------ | ------------------ | ------------------------------------ | ------- |
| columns      | 列配置             | `ProTableColumn[]`                   | `[]`    |
| request      | 数据请求函数       | `(params) => Promise<RequestResult>` | -       |
| dataSource   | 静态数据           | `any[]`                              | -       |
| params       | 额外请求参数       | `object`                             | -       |
| rowKey       | 行唯一标识         | `string`                             | `'id'`  |
| headerTitle  | 表格标题           | `string \| VNode`                    | -       |
| toolbar      | 工具栏配置         | `boolean \| ToolbarConfig`           | `true`  |
| pagination   | 分页配置           | `false \| PaginationProps`           | -       |
| loading      | 加载状态           | `boolean`                            | -       |
| cardBordered | 卡片边框           | `boolean`                            | `true`  |
| ghost        | 幽灵模式（无卡片） | `boolean`                            | `false` |
| manual       | 手动触发请求       | `boolean`                            | `false` |
| polling      | 轮询间隔（毫秒）   | `number \| boolean`                  | -       |

### ProTableColumn

继承 TDesign Table 的 Column 配置，额外支持：

| 属性         | 说明             | 类型                            |
| ------------ | ---------------- | ------------------------------- |
| valueType    | 字段类型         | `string`                        |
| valueEnum    | 枚举值映射       | `Record<string, ValueEnumItem>` |
| hideInTable  | 在表格中隐藏     | `boolean`                       |
| hideInSearch | 在搜索表单中隐藏 | `boolean`                       |
| search       | 搜索配置         | `boolean \| SearchConfig`       |

### ActionRef

| 方法          | 说明         | 类型         |
| ------------- | ------------ | ------------ |
| reload        | 刷新表格     | `() => void` |
| reloadAndRest | 重置并刷新   | `() => void` |
| reset         | 重置表格状态 | `() => void` |
| clearSelected | 清空选中项   | `() => void` |

### RequestResult

```ts
interface RequestResult<T = any> {
  data: T[]
  total: number
  success: boolean
}
```
