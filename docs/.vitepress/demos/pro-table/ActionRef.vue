<script setup lang="ts">
  import type { ProTableColumn } from '@/components/table'
  import ProTable from '@/components/table'
  import { Button, MessagePlugin, Space } from 'tdesign-vue-next'
  import { ref } from 'vue'

  const tableRef = ref()
  let requestCount = 0

  const columns: ProTableColumn[] = [
    { title: '姓名', colKey: 'name', width: 120 },
    { title: '年龄', colKey: 'age', width: 80 },
    { title: '请求次数', colKey: 'requestCount', width: 100 },
    { title: '地址', colKey: 'address' },
  ]

  const request = async () => {
    await new Promise(resolve => setTimeout(resolve, 300))
    requestCount++

    return {
      data: [
        {
          id: 1,
          name: '张三',
          age: 25,
          requestCount,
          address: '北京市朝阳区',
        },
        {
          id: 2,
          name: '李四',
          age: 30,
          requestCount,
          address: '上海市浦东新区',
        },
        {
          id: 3,
          name: '王五',
          age: 28,
          requestCount,
          address: '广州市天河区',
        },
      ],
      total: 3,
      success: true,
    }
  }

  // 刷新表格
  const handleReload = () => {
    tableRef.value?.reload()
    MessagePlugin.success('表格已刷新')
  }

  // 重置并刷新
  const handleReloadAndRest = () => {
    tableRef.value?.reloadAndRest()
    MessagePlugin.success('表格已重置并刷新')
  }

  // 重置表格状态
  const handleReset = () => {
    tableRef.value?.reset()
    MessagePlugin.success('表格状态已重置')
  }

  // 清空选中
  const handleClearSelected = () => {
    tableRef.value?.clearSelected()
    MessagePlugin.success('已清空选中项')
  }
</script>

<template>
  <Space direction="vertical" style="width: 100%">
    <Space>
      <Button theme="primary" @click="handleReload">刷新表格</Button>
      <Button @click="handleReloadAndRest">重置并刷新</Button>
      <Button @click="handleReset">重置状态</Button>
      <Button @click="handleClearSelected">清空选中</Button>
    </Space>

    <ProTable
      ref="tableRef"
      :columns="columns"
      :request="request"
      row-key="id"
      header-title="ActionRef 示例"
      :pagination="false"
      :row-selection-type="'multiple'"
    />
  </Space>
</template>
