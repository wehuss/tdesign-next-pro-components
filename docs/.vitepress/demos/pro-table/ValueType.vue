<script setup lang="ts">
  import type { ProTableColumn } from '@/components/table'
import ProTable from '@/components/table'

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
      width: 100,
    },
    {
      title: '金额',
      colKey: 'amount',
      valueType: 'money',
      width: 120,
    },
    {
      title: '状态',
      colKey: 'status',
      valueType: 'select',
      width: 100,
      valueEnum: {
        active: { text: '启用', theme: 'success' },
        inactive: { text: '禁用', theme: 'danger' },
      },
      form:{
        valueType:'text'
      },
    },
    {
      title: '进度',
      colKey: 'progress',
      valueType: 'progress',
      width: 150,
    },
    {
      title: '创建时间',
      colKey: 'createdAt',
      valueType: 'dateTime',
      width: 180,
    },
  ]

  const request = async () => {
    await new Promise(resolve => setTimeout(resolve, 500))

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
        {
          id: 2,
          username: '李四',
          amount: 8888.88,
          status: 'inactive',
          progress: 30,
          createdAt: '2024-01-14 09:20:00',
        },
        {
          id: 3,
          username: '王五',
          amount: 56789.12,
          status: 'active',
          progress: 100,
          createdAt: '2024-01-13 14:45:00',
        },
      ],
      total: 3,
      success: true,
    }
  }
</script>

<template>
  <ProTable
    :columns="columns"
    :request="request"
    row-key="id"
    header-title="valueType 自动渲染"
    :pagination="false"
  />
</template>
