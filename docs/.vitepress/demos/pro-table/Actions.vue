<script setup lang="ts">
import type { ProTableColumn } from '@/components/table'
import ProTable from '@/components/table'
import { Button, MessagePlugin, Popconfirm, Space } from 'tdesign-vue-next'
import { h } from 'vue'

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
  { title: '姓名', colKey: 'name', width: 120 },
  { title: '年龄', colKey: 'age', width: 80 },
  { title: '状态', colKey: 'status', width: 100 },
  { title: '地址', colKey: 'address' },
  {
    title: '操作',
    colKey: 'action',
    width: 200,
    fixed: 'right',
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
          () => '查看',
        ),
        h(
          Button,
          {
            theme: 'primary',
            variant: 'text',
            size: 'small',
            onClick: () => handleEdit(row),
          },
          () => '编辑',
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
              () => '删除',
            ),
        ),
      ]),
  },
]

const request = async () => {
  await new Promise((resolve) => setTimeout(resolve, 300))

  return {
    data: [
      {
        id: 1,
        name: '张三',
        age: 25,
        status: '启用',
        address: '北京市朝阳区',
      },
      {
        id: 2,
        name: '李四',
        age: 30,
        status: '禁用',
        address: '上海市浦东新区',
      },
      {
        id: 3,
        name: '王五',
        age: 28,
        status: '启用',
        address: '广州市天河区',
      },
      {
        id: 4,
        name: '赵六',
        age: 35,
        status: '启用',
        address: '深圳市南山区',
      },
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
    header-title="操作列示例"
    :pagination="false"
  />
</template>
