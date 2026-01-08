<script setup lang="ts">
import { ProField } from '@/components/field'
import { ref } from 'vue'

const status = ref('active')

const valueEnum = {
  active: { text: '启用', status: 'success' },
  inactive: { text: '禁用', status: 'error' },
  pending: { text: '待审核', status: 'warning' },
}
</script>

<template>
  <t-space direction="vertical" size="large" style="width: 100%">
    <t-space align="center">
      <span style="width: 100px; color: var(--td-text-color-secondary)">阅读模式：</span>
      <ProField :modelValue="status" valueType="select" :valueEnum="valueEnum" mode="read" />
    </t-space>

    <t-space align="center">
      <span style="width: 100px; color: var(--td-text-color-secondary)">编辑模式：</span>
      <ProField
        v-model="status"
        valueType="select"
        :valueEnum="valueEnum"
        mode="edit"
        style="width: 200px"
      />
    </t-space>

    <div style="color: var(--td-text-color-secondary); font-size: 12px">当前值：{{ status }}</div>
  </t-space>
</template>
