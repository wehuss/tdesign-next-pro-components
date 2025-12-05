<script setup lang="ts">
  import type { ProTableColumn } from '@/components/table'
  import ProTable from '@/components/table'
  import { ref } from 'vue'

  const columns: ProTableColumn[] = [
    { title: '姓名', colKey: 'name', width: 120 },
    { title: '年龄', colKey: 'age', width: 80 },
    { title: '地址', colKey: 'address' },
  ]

  const dataSource = ref([
    { id: 1, name: '张三', age: 25, address: '北京市朝阳区' },
    { id: 2, name: '李四', age: 30, address: '上海市浦东新区' },
    { id: 3, name: '王五', age: 28, address: '广州市天河区' },
  ])

  const handleAdd = () => {
    const newId = dataSource.value.length + 1
    dataSource.value.push({
      id: newId,
      name: `用户${newId}`,
      age: Math.floor(Math.random() * 20) + 20,
      address: '新增地址',
    })
  }

  const handleRemove = () => {
    if (dataSource.value.length > 0) {
      dataSource.value.pop()
    }
  }
</script>

<template>
  <t-space direction="vertical" size="large" style="width: 100%">
    <t-space>
      <t-button theme="primary" @click="handleAdd">添加数据</t-button>
      <t-button theme="danger" variant="outline" @click="handleRemove"
        >删除最后一条</t-button
      >
    </t-space>

    <ProTable
      :columns="columns"
      :dataSource="dataSource"
      row-key="id"
      header-title="静态数据"
      :toolbar="false"
      :pagination="false"
    />
  </t-space>
</template>
