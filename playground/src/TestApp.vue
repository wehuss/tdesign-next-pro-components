<template>
  <div id="app">
    <div class="header">
      <h1>🧪 ProForm Vue3 功能测试</h1>
      <p>全面测试迁移后的表单组件功能</p>
    </div>
    
    <div class="container">
      <FunctionTest />
    </div>
  </div>
</template>

<script setup lang="ts">
import FunctionTest from '../../src/components/form/demo/FunctionTest';
</script>

<style scoped>
.header {
  text-align: center;
  padding: 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  margin-bottom: 24px;
}

.header h1 {
  margin: 0 0 8px 0;
  font-size: 28px;
}

.header p {
  margin: 0;
  opacity: 0.9;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

#app {
  min-height: 100vh;
  background-color: #f5f5f5;
}
</style>