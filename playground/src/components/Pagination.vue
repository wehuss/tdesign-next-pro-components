<script setup lang="ts">
import type { ProTableColumn } from '@/components/table'
import ProTable from '@/components/table'

const columns: ProTableColumn[] = [
  { title: '姓名', colKey: 'name', width: 120,form:{valueType:'text'} },
  { title: '年龄', colKey: 'age', width: 80,form:{valueType:'text'} },
  { title: '邮箱', colKey: 'email', width: 200 },
  { title: '地址', colKey: 'address' },
]

// 模拟生成数据
const generateData = (page: number, pageSize: number) => {
  const data = []
  const start = (page - 1) * pageSize
  for (let i = 0; i < pageSize; i++) {
    const index = start + i + 1
    data.push({
      id: index,
      name: `用户${index}`,
      age: 20 + (index % 30),
      email: `user${index}@example.com`,
      address: `地址${index}`,
    })
  }
  return data
}

const request = async (params: { current: number; pageSize: number }) => {
  // console.log('请求参数:', params)
  // 模拟请求延迟
  await new Promise((resolve) => setTimeout(resolve, 300))

  console.log('请求参数:', params)

  return {
    data: generateData(params.current, params.pageSize),
    total: 100, // 总共100条数据
    success: true,
  }
}
</script>

<template>
  <ProTable
  auto-fill
    :columns="columns"
    :request="request"
    row-key="id"
    header-title="分页示例"
    :pagination="{
      pageSize: 10,
      pageSizeOptions: [5, 10, 20, 50],
      showJumper: true,
    }"
  />
</template>
