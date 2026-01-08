<script setup lang="ts">
import { ProField } from '@/components/field'
import { ref } from 'vue'

const date = ref('2024-01-15 14:30:00')
const dateOnly = ref('2024-01-15')
</script>

<template>
  <t-space direction="vertical" size="large" style="width: 100%">
    <t-space align="center">
      <span style="width: 100px; color: var(--td-text-color-secondary)">日期：</span>
      <ProField :modelValue="dateOnly" valueType="date" mode="read" />
    </t-space>

    <t-space align="center">
      <span style="width: 100px; color: var(--td-text-color-secondary)">日期时间：</span>
      <ProField :modelValue="date" valueType="dateTime" mode="read" />
    </t-space>

    <t-space align="center">
      <span style="width: 100px; color: var(--td-text-color-secondary)">相对时间：</span>
      <ProField :modelValue="date" valueType="fromNow" mode="read" />
    </t-space>

    <t-space align="center">
      <span style="width: 100px; color: var(--td-text-color-secondary)">编辑模式：</span>
      <ProField v-model="dateOnly" valueType="date" mode="edit" style="width: 200px" />
    </t-space>
  </t-space>
</template>
