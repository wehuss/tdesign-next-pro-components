# 快速上手

TDesign Pro Components 是一套基于 TDesign Vue Next 的高级业务组件库，旨在为中后台应用提供开箱即用的解决方案。

## 特性

- 🚀 基于 TDesign Vue Next，与现有项目无缝集成
- 📦 提供 ProTable、ProForm、ProField 等高级组件
- 🎨 统一的设计语言和交互规范
- 💪 使用 TypeScript 编写，类型安全
- ⚡ 基于 Vue 3 Composition API

## 环境要求

- Vue >= 3.3
- TDesign Vue Next >= 1.9

## 安装

::: code-group

```bash [pnpm]
pnpm add tdesign-pro-components tdesign-vue-next
```

```bash [npm]
npm install tdesign-pro-components tdesign-vue-next
```

```bash [yarn]
yarn add tdesign-pro-components tdesign-vue-next
```

:::

## 基础使用

### 全局注册

```ts
// main.ts
import { createApp } from 'vue'
import TDesign from 'tdesign-vue-next'
import TDesignProComponents from 'tdesign-pro-components'

import 'tdesign-vue-next/es/style/index.css'
import 'tdesign-pro-components/style'

import App from './App.vue'

const app = createApp(App)

app.use(TDesign)
app.use(TDesignProComponents)
app.mount('#app')
```

### 按需引入

```vue
<script setup lang="ts">
import { ProTable, ProField } from 'tdesign-pro-components'
import 'tdesign-pro-components/style'
</script>

<template>
  <ProTable :columns="columns" :request="request" />
</template>
```

## 第一个示例

下面是一个简单的 ProTable 示例：

```vue
<script setup lang="ts">
import { ProTable } from 'tdesign-pro-components'
import type { ProTableColumn } from 'tdesign-pro-components'

// 定义列配置
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
    title: '状态',
    colKey: 'status',
    valueType: 'select',
    valueEnum: {
      active: { text: '启用', status: 'success' },
      inactive: { text: '禁用', status: 'error' },
    },
  },
  {
    title: '创建时间',
    colKey: 'createdAt',
    valueType: 'dateTime',
  },
]

// 数据请求函数
const request = async (params: any) => {
  // 模拟 API 请求
  const response = await fetch('/api/users', {
    method: 'POST',
    body: JSON.stringify(params),
  })
  const result = await response.json()

  return {
    data: result.list,
    total: result.total,
    success: true,
  }
}
</script>

<template>
  <ProTable :columns="columns" :request="request" row-key="id" header-title="用户列表" />
</template>
```

## 下一步

- 查看 [ProField 高级字段](/components/pro-field) 了解字段渲染
- 查看 [ProTable 高级表格](/components/pro-table) 了解表格功能
- 查看 [ProForm 高级表单](/components/pro-form) 了解表单组件
