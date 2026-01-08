<script setup lang="ts">
import type { ProTableColumn } from '@/components/table'
import ProTable from '@/components/table'

const columns: ProTableColumn[] = [
  { title: '姓名', colKey: 'name', width: 120 },
  { title: '年龄', colKey: 'age', width: 80 },
  { title: '地址', colKey: 'address' },
]

const request = async (params: any) => {
  // 模拟请求延迟
  await new Promise((resolve) => setTimeout(resolve, 500))

  return {
    data: [
      { id: 1, name: '张三', age: 25, address: '北京市朝阳区' },
      { id: 2, name: '李四', age: 30, address: '上海市浦东新区' },
      { id: 3, name: '王五', age: 28, address: '广州市天河区' },
      { id: 4, name: '赵六', age: 35, address: '深圳市南山区' },
    ],
    total: 4,
    success: true,
  }
}
</script>

<template>
  <ProTable
    :columns="columns"
    :request="request"
    row-key="id"
    header-title="用户列表"
    :pagination="false"
  />
</template>
