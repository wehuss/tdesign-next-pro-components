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
yarn add tdesign-next-pro-components tdesign-vue-next
```

:::

## 完整引入

在 `main.ts` 中引入全部组件：

```typescript
import { createApp } from "vue";
import TDesign from "tdesign-vue-next";
// 引入组件库
import TDesignProComponents from "tdesign-next-pro-components";
// 引入样式
import "tdesign-vue-next/es/style/index.css";
import "tdesign-next-pro-components/style";
import App from "./App.vue";

const app = createApp(App);

app.use(TDesign);
app.use(TDesignProComponents);
app.mount("#app");
```

## 按需引入

如果你只需要使用部分组件，可以采用按需引入的方式。

```typescript
import { createApp } from "vue";
import TDesign from "tdesign-vue-next";
import { ProTable, ProField, ProForm } from "tdesign-next-pro-components";
// 引入样式
import "tdesign-vue-next/es/style/index.css";
import "tdesign-next-pro-components/style"; // 按需引入时也需要引入全量样式
import App from "./App.vue";

const app = createApp(App);

app.use(TDesign);
app.use(ProTable);
app.use(ProField);
app.use(ProForm);
app.mount("#app");
```

## Volar 支持

如果你使用 Volar，请在 `tsconfig.json` 中配置 `types`：

```json
{
  "compilerOptions": {
    "types": ["tdesign-next-pro-components/dist/index.d.ts"]
  }
}
```

## 浏览器引入

目前暂不推荐通过浏览器直接引入使用，建议使用打包工具集成。

## 浏览器兼容性

| 浏览器  | 版本  |
| ------- | ----- |
| Chrome  | >= 87 |
| Firefox | >= 78 |
| Safari  | >= 14 |
| Edge    | >= 88 |

## 注意事项

1. 确保已正确安装并引入 `tdesign-vue-next` 及其样式。
2. `tdesign-next-pro-components` 依赖 TDesign 基础组件库，请确保版本兼容。
3. 如果出现样式丢失，请检查是否正确引入了 CSS 文件：
   ```typescript
   // 引入组件库样式
   import "tdesign-next-pro-components/style";
   ```

### TypeScript 类型报错

确保安装了正确版本的依赖，并且 `tsconfig.json` 配置正确。
