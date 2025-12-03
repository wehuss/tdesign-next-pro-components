<template>
  <div id="app">
    <h1>TDesign Pro Components 演示</h1>

    <div class="demo-tabs">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        :class="['tab-button', { active: activeTab === tab.key }]"
        @click="activeTab = tab.key"
      >
        {{ tab.label }}
      </button>
    </div>

    <div class="demo-content">
      <component :is="currentComponent" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'
  import AdvancedForm from '../../src/components/form/demo/AdvancedForm'
  import BasicForm from '../../src/components/form/demo/BasicForm'
  // import FunctionTest from '../../src/components/form/demo/FunctionTest'
  import TestForm from '../../src/components/form/demo/TestForm'

  const activeTab = ref('basic')

  const tabs = [
    { key: 'basic', label: '基础表单', component: BasicForm },
    { key: 'advanced', label: '高级表单', component: AdvancedForm },
    { key: 'test', label: '组件测试', component: TestForm },
    // { key: 'function', label: '功能验证', component: FunctionTest },
  ]

  const currentComponent = computed(() => {
    return tabs.find(tab => tab.key === activeTab.value)?.component
  })
</script>

<style scoped>
  #app {
    padding: 20px;
    font-family:
      -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }

  .demo-tabs {
    display: flex;
    gap: 8px;
    margin-bottom: 24px;
    border-bottom: 1px solid #e8e8e8;
    padding-bottom: 16px;
  }

  .tab-button {
    padding: 8px 16px;
    border: 1px solid #d9d9d9;
    background: #fff;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .tab-button:hover {
    border-color: #40a9ff;
    color: #40a9ff;
  }

  .tab-button.active {
    background: #1890ff;
    border-color: #1890ff;
    color: #fff;
  }

  .demo-content {
    min-height: 500px;
  }
</style>
