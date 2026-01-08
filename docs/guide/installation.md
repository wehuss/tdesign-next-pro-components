# 安装

## 包管理器安装

::: code-group

```bash [pnpm]
pnpm add tdesign-pro-components tdesign-vue-next
```

```bash [npm]
npm install tdesign-pro-components tdesign-vue-next
```

```bash [yarn]
yarn add tdesign-pro-components tdesign-vue-next
```

:::

## 引入样式

TDesign Pro Components 依赖 TDesign Vue Next 的样式，需要同时引入两者的样式文件：

```ts
// main.ts
import 'tdesign-vue-next/es/style/index.css'
import 'tdesign-pro-components/style'
```

## 全局注册

如果你希望全局使用所有组件，可以在入口文件中进行全局注册：

```ts
// main.ts
import { createApp } from 'vue'
import TDesign from 'tdesign-vue-next'
import TDesignProComponents from 'tdesign-pro-components'

import 'tdesign-vue-next/es/style/index.css'
import 'tdesign-pro-components/style'

import App from './App.vue'

const app = createApp(App)

app.use(TDesign)
app.use(TDesignProComponents)
app.mount('#app')
```

## 按需引入

推荐使用按需引入的方式，可以减少打包体积：

```vue
<script setup lang="ts">
import { ProTable, ProField, ProForm } from 'tdesign-pro-components'
</script>
```

## TypeScript 支持

TDesign Pro Components 使用 TypeScript 编写，提供完整的类型定义。

在 `tsconfig.json` 中确保包含以下配置：

```json
{
  "compilerOptions": {
    "types": ["tdesign-pro-components/dist/index.d.ts"]
  }
}
```

## 浏览器兼容性

| 浏览器  | 版本  |
| ------- | ----- |
| Chrome  | >= 87 |
| Firefox | >= 78 |
| Safari  | >= 14 |
| Edge    | >= 88 |

## 常见问题

### 样式未生效

确保正确引入了样式文件：

```ts
import 'tdesign-vue-next/es/style/index.css'
import 'tdesign-pro-components/style'
```

### TypeScript 类型报错

确保安装了正确版本的依赖，并且 `tsconfig.json` 配置正确。
