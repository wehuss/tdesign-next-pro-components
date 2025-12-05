<script setup lang="ts">
  import { ProField } from '@/components/field'
  import { ref } from 'vue'

  const textValue = ref('Hello World')
  const moneyValue = ref(12345.67)
  const dateValue = ref('2024-01-15')
  const percentValue = ref(0.85)
  const digitValue = ref(100)
</script>

<template>
  <t-space direction="vertical" size="large" style="width: 100%">
    <t-space align="center">
      <span style="width: 80px; color: var(--td-text-color-secondary)"
        >文本：</span
      >
      <ProField :modelValue="textValue" valueType="text" mode="read" />
    </t-space>

    <t-space align="center">
      <span style="width: 80px; color: var(--td-text-color-secondary)"
        >金额：</span
      >
      <ProField :modelValue="moneyValue" valueType="money" mode="read" />
    </t-space>

    <t-space align="center">
      <span style="width: 80px; color: var(--td-text-color-secondary)"
        >日期：</span
      >
      <ProField :modelValue="dateValue" valueType="date" mode="read" />
    </t-space>

    <t-space align="center">
      <span style="width: 80px; color: var(--td-text-color-secondary)"
        >百分比：</span
      >
      <ProField :modelValue="percentValue" valueType="percent" mode="read" />
    </t-space>

    <t-space align="center">
      <span style="width: 80px; color: var(--td-text-color-secondary)"
        >数字：</span
      >
      <ProField :modelValue="digitValue" valueType="digit" mode="read" />
    </t-space>
  </t-space>
</template>
