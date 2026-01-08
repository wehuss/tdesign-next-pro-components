---
layout: home

hero:
  name: TDesign Pro Components
  text: 高级业务组件库
  tagline: 基于 TDesign Vue Next，为中后台应用提供开箱即用的高级组件
  image:
    src: /logo.svg
    alt: TDesign Pro Components
  actions:
    - theme: brand
      text: 快速开始
      link: /guide/getting-started
    - theme: alt
      text: 组件文档
      link: /components/pro-field

features:
  - icon: 🚀
    title: 开箱即用
    details: 提供丰富的高级组件，满足中后台常见业务场景，减少重复开发
  - icon: 🎨
    title: 统一设计
    details: 基于 TDesign 设计规范，与 TDesign Vue Next 无缝集成
  - icon: 📦
    title: TypeScript
    details: 使用 TypeScript 编写，提供完整的类型定义，开发体验更佳
  - icon: ⚡
    title: 高性能
    details: 基于 Vue 3 Composition API，充分利用响应式系统优势
---

## 快速体验

```bash
# 安装
pnpm add tdesign-pro-components

# 或使用 npm
npm install tdesign-pro-components
```

```vue
<script setup lang="ts">
import { ProTable } from 'tdesign-pro-components'
import 'tdesign-pro-components/style'

const columns = [
  { title: '姓名', colKey: 'name', valueType: 'text' },
  { title: '状态', colKey: 'status', valueType: 'select' },
  { title: '创建时间', colKey: 'createdAt', valueType: 'dateTime' },
]

const request = async (params) => {
  const data = await fetchData(params)
  return { data: data.list, total: data.total, success: true }
}
</script>

<template>
  <ProTable :columns="columns" :request="request" />
</template>
```
