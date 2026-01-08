<script setup lang="ts">
import { ProField } from '@/components/field'
import { ref } from 'vue'

const amount = ref(1234567.89)
</script>

<template>
  <t-space direction="vertical" size="large" style="width: 100%">
    <t-space align="center">
      <span style="width: 120px; color: var(--td-text-color-secondary)">默认（人民币）：</span>
      <ProField :modelValue="amount" valueType="money" mode="read" />
    </t-space>

    <t-space align="center">
      <span style="width: 120px; color: var(--td-text-color-secondary)">美元：</span>
      <ProField
        :modelValue="amount"
        valueType="money"
        mode="read"
        :fieldProps="{ currency: '$' }"
      />
    </t-space>

    <t-space align="center">
      <span style="width: 120px; color: var(--td-text-color-secondary)">欧元：</span>
      <ProField
        :modelValue="amount"
        valueType="money"
        mode="read"
        :fieldProps="{ currency: '€' }"
      />
    </t-space>

    <t-space align="center">
      <span style="width: 120px; color: var(--td-text-color-secondary)">编辑模式：</span>
      <ProField v-model="amount" valueType="money" mode="edit" style="width: 200px" />
    </t-space>
  </t-space>
</template>
