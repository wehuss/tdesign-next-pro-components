<script setup lang="ts">
  import { ProField } from '@/components/field'
  import { ref } from 'vue'

  const value = ref('示例文本')
  const mode = ref<'read' | 'edit'>('read')
</script>

<template>
  <t-space direction="vertical" size="large" style="width: 100%">
    <t-radio-group v-model="mode">
      <t-radio-button value="read">阅读模式</t-radio-button>
      <t-radio-button value="edit">编辑模式</t-radio-button>
    </t-radio-group>

    <t-space align="center">
      <span style="width: 80px; color: var(--td-text-color-secondary)"
        >文本：</span
      >
      <ProField
        v-model="value"
        valueType="text"
        :mode="mode"
        placeholder="请输入文本"
      />
    </t-space>

    <div style="color: var(--td-text-color-secondary); font-size: 12px">
      当前值：{{ value }}
    </div>
  </t-space>
</template>
