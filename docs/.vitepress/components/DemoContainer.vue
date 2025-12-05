<script setup lang="ts">
  import { ref } from 'vue'

  defineProps<{
    title?: string
    description?: string
  }>()

  const showCode = ref(false)
</script>

<template>
  <div class="demo-container">
    <div v-if="title" class="demo-title">{{ title }}</div>
    <div v-if="description" class="demo-description">{{ description }}</div>

    <div class="demo-preview">
      <slot />
    </div>

    <div v-if="$slots.code" class="demo-actions">
      <button class="demo-toggle-btn" @click="showCode = !showCode">
        {{ showCode ? '隐藏代码' : '查看代码' }}
      </button>
    </div>

    <div v-if="showCode && $slots.code" class="demo-code">
      <slot name="code" />
    </div>
  </div>
</template>

<style scoped>
  .demo-container {
    border: 1px solid var(--vp-c-divider);
    border-radius: 8px;
    margin: 16px 0;
    overflow: hidden;
  }

  .demo-title {
    padding: 12px 16px;
    font-weight: 600;
    font-size: 14px;
    border-bottom: 1px solid var(--vp-c-divider);
    background: var(--vp-c-bg-soft);
  }

  .demo-description {
    padding: 12px 16px;
    font-size: 14px;
    color: var(--vp-c-text-2);
    border-bottom: 1px solid var(--vp-c-divider);
  }

  .demo-preview {
    padding: 24px;
    background: var(--vp-c-bg);
  }

  .demo-actions {
    padding: 8px 16px;
    border-top: 1px solid var(--vp-c-divider);
    background: var(--vp-c-bg-soft);
  }

  .demo-toggle-btn {
    padding: 4px 12px;
    font-size: 12px;
    color: var(--vp-c-brand-1);
    background: transparent;
    border: 1px solid var(--vp-c-brand-1);
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .demo-toggle-btn:hover {
    background: var(--vp-c-brand-soft);
  }

  .demo-code {
    border-top: 1px solid var(--vp-c-divider);
  }

  .demo-code :deep(div[class*='language-']) {
    margin: 0;
    border-radius: 0;
  }
</style>
