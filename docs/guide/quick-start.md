# Quick Start

This guide will help you quickly get started with TDesign Pro Components in your Vue 3 project.

## Full Import

If you don't care about bundle size, you can import all components:

```typescript
import { createApp } from 'vue'
import TDesignProComponents from 'tdesign-pro-components'
import 'tdesign-vue-next/es/style/index.css'

const app = createApp(App)
app.use(TDesignProComponents)
app.mount('#app')
```

## On-demand Import

For better tree-shaking and smaller bundle size, import only the components you need:

```typescript
import { createApp } from 'vue'
// Import specific components
// import { ProTable, ProForm, ProSelect } from 'tdesign-pro-components'
import 'tdesign-vue-next/es/style/index.css'

const app = createApp(App)
// app.use(ProTable)
// app.use(ProForm)
// app.use(ProSelect)
app.mount('#app')
```

## Auto Import

We recommend using [unplugin-vue-components](https://github.com/antfu/unplugin-vue-components) for automatic component importing:

### Install Plugin

::: code-group

```bash [pnpm]
pnpm add -D unplugin-vue-components
```

```bash [npm]
npm install -D unplugin-vue-components
```

```bash [yarn]
yarn add -D unplugin-vue-components
```

:::

### Configure Vite

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'

export default defineConfig({
  plugins: [
    vue(),
    Components({
      resolvers: [
        // Add resolver for TDesign Pro Components
        componentName => {
          if (componentName.startsWith('TDPro')) {
            return {
              name: componentName,
              from: 'tdesign-pro-components',
            }
          }
        },
      ],
    }),
  ],
})
```

## TypeScript Support

TDesign Pro Components provides full TypeScript support. Add the following to your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "types": ["tdesign-pro-components/global"]
  }
}
```

## Usage Example

Here's a basic example of using TDesign Pro Components:

```vue
<template>
  <div>
    <!-- Example component usage will be added here -->
    <h1>TDesign Pro Components</h1>
    <!-- <t-pro-table /> -->
    <!-- <t-pro-form /> -->
    <!-- <t-pro-select /> -->
  </div>
</template>

<script setup lang="ts">
  // Component imports and logic will be added here
</script>
```

## Theming

TDesign Pro Components inherits the theming system from TDesign Vue Next. You can customize the theme by following the [TDesign theming guide](https://tdesign.tencent.com/vue-next/custom-theme).

## Next Steps

Now that you have TDesign Pro Components set up, explore the [Components](/components/) documentation to see what's available and learn how to use them in your project.
