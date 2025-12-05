# TDesign Pro Table

基于 TDesign Vue Next 的高级表格组件，提供企业级数据表格解决方案。

## 🎯 项目目标

参考 Ant Design Pro Components Table，为 TDesign Vue Next 生态系统创建功能丰富的 ProTable 组件。

Enhanced components based on TDesign Vue Next for enterprise applications.

## Features

- 🚀 **Vue 3 & TypeScript**: Modern development experience with full type safety
- 🎨 **TDesign Integration**: Seamless integration with TDesign design system
- 📦 **Tree Shakable**: Optimized bundle size with ES modules
- 🔧 **Customizable**: Flexible theming and configuration options
- 📖 **Well Documented**: Comprehensive documentation with examples
- ⚡ **Performance**: Optimized for production use

## Installation

```bash
# Using pnpm (recommended)
pnpm add tdesign-pro-components

# Using npm
npm install tdesign-pro-components

# Using yarn
yarn add tdesign-pro-components
```

## Quick Start

```typescript
import { createApp } from 'vue'
import TDesignProComponents from 'tdesign-pro-components'
import 'tdesign-vue-next/es/style/index.css'

const app = createApp(App)
app.use(TDesignProComponents)
app.mount('#app')
```

## Documentation

Visit our [documentation site](https://wehuss.github.io/tdesign-pro-components) for detailed usage instructions and examples.

## Development

### Prerequisites

- Node.js >= 16
- pnpm >= 8

### Setup

```bash
# Clone the repository
git clone https://github.com/wehuss/tdesign-pro-components.git
cd tdesign-pro-components

# Install dependencies
pnpm install

# Start development server
pnpm dev

# Start documentation server
pnpm dev:docs
```

### Build

```bash
# Build library
pnpm build

# Build documentation
pnpm build:docs
```

## Browser Support

| IE / Edge | Firefox | Chrome | Safari |
| --------- | ------- | ------ | ------ |
| Edge 14+  | 78+     | 70+    | 12+    |

## Contributing

We welcome contributions! Please read our [Contributing Guide](./CONTRIBUTING.md) before submitting a pull request.

## Changelog

Detailed changes for each release are documented in the [release notes](https://github.com/wehuss/tdesign-pro-components/releases).

## License

[MIT](./LICENSE) License © 2024 TDesign Pro Components Team

## Acknowledgments

This project is built on top of [TDesign Vue Next](https://github.com/Tencent/tdesign-vue-next). Thanks to the TDesign team for their excellent work.
