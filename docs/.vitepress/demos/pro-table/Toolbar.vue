<script setup lang="ts">
import type { ProTableColumn } from '@/components/table'
import ProTable from '@/components/table'
import { ref } from 'vue'

const tableRef = ref()

const columns: ProTableColumn[] = [
  { title: '姓名', colKey: 'name', width: 120 },
  { title: '年龄', colKey: 'age', width: 80 },
  { title: '邮箱', colKey: 'email', width: 200 },
  { title: '部门', colKey: 'department', width: 120 },
]

const request = async () => {
  await new Promise((resolve) => setTimeout(resolve, 500))

  return {
    data: [
      {
        id: 1,
        name: '张三',
        age: 25,
        email: 'zhangsan@example.com',
        department: '技术部',
      },
      {
        id: 2,
        name: '李四',
        age: 30,
        email: 'lisi@example.com',
        department: '产品部',
      },
      {
        id: 3,
        name: '王五',
        age: 28,
        email: 'wangwu@example.com',
        department: '运营部',
      },
    ],
    total: 3,
    success: true,
  }
}

const handleRefresh = () => {
  tableRef.value?.reload()
}
</script>

<template>
  <t-space direction="vertical" size="large" style="width: 100%">
    <t-space>
      <t-button @click="handleRefresh">手动刷新</t-button>
    </t-space>

    <ProTable
      ref="tableRef"
      :columns="columns"
      :request="request"
      row-key="id"
      header-title="用户管理"
      :toolbar="true"
      :pagination="false"
    />
  </t-space>
</template>
