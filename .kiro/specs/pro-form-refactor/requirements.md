# Requirements Document

## Introduction

本规范文档描述了对 TDesign Pro Components 中 ProForm 组件库的重构和文档完善工作。主要包括三个方面：修复组件类型错误、重命名文件夹为 kebab-case 格式、以及完全重写 ProForm 文档。

## Glossary

- **ProForm**: 基于 TDesign Form 封装的高级表单组件库
- **ProFormItem**: 表单项包装组件，用于统一处理表单字段的布局和验证
- **kebab-case**: 使用连字符分隔单词的命名方式，如 `date-picker`
- **PascalCase**: 使用大写字母分隔单词的命名方式，如 `DatePicker`
- **VNode**: Vue 虚拟节点类型
- **FormItemProps**: TDesign FormItem 组件的属性类型
- **label**: 表单项标签，支持字符串或 VNode
- **help**: 表单项帮助信息，支持字符串、VNode 或函数

## Requirements

### Requirement 1

**User Story:** As a developer, I want the ProForm components to have correct TypeScript types, so that I can use them without type errors in my IDE.

#### Acceptance Criteria

1. WHEN a developer uses the `label` prop on any ProFormXXX component THEN the system SHALL accept both `string` and `() => VNode` types without TypeScript errors
2. WHEN a developer uses the `help` prop on any ProFormXXX component THEN the system SHALL accept `string`, `VNode`, and `(params: { errors: VNode[]; warnings: VNode[] }) => VNode` types without TypeScript errors
3. WHEN the ProFormItem component passes `label` to TDesign FormItem THEN the system SHALL convert the function type to the expected TDesign FormItem label type
4. WHEN the ProFormItem component passes `help` to TDesign FormItem THEN the system SHALL convert the function type to the expected TDesign FormItem help type

### Requirement 2

**User Story:** As a developer, I want the form component folders to follow kebab-case naming convention, so that the codebase follows consistent naming standards.

#### Acceptance Criteria

1. WHEN a developer navigates to `src/components/form/components/` THEN the system SHALL display all component folders in kebab-case format (e.g., `date-picker` instead of `DatePicker`)
2. WHEN the folder names are changed THEN the system SHALL update all import statements in `src/components/form/components/index.ts` to reflect the new paths
3. WHEN the folder names are changed THEN the system SHALL preserve all existing component functionality without breaking changes

### Requirement 3

**User Story:** As a developer, I want comprehensive ProForm documentation with detailed demos and type annotations, so that I can understand and use all ProForm components effectively.

#### Acceptance Criteria

1. WHEN a developer reads the ProForm documentation THEN the system SHALL display an introduction section explaining the purpose and features of ProForm
2. WHEN a developer reads the ProForm documentation THEN the system SHALL display working demo examples for each major feature (basic usage, form items, layout, validation, dependency, dynamic forms)
3. WHEN a developer reads the ProForm documentation THEN the system SHALL display complete API documentation for ProForm and all ProFormXXX components with TypeScript type annotations
4. WHEN a developer reads the ProForm documentation THEN the system SHALL display usage examples for each ProFormXXX component (Text, Select, DatePicker, etc.)
5. WHEN a developer views a demo THEN the system SHALL display both the rendered component and the source code
6. WHEN a developer reads the API section THEN the system SHALL display all props with their types, default values, and descriptions in a table format

### Requirement 4

**User Story:** As a developer, I want the documentation demos to be interactive Vue components, so that I can see the components in action.

#### Acceptance Criteria

1. WHEN a demo component is created THEN the system SHALL place it in `docs/.vitepress/demos/pro-form/` directory
2. WHEN a demo component is created THEN the system SHALL use the `<script setup>` syntax for Vue 3 composition API
3. WHEN a demo component is created THEN the system SHALL import components from `tdesign-next-pro-components`
4. WHEN the documentation references a demo THEN the system SHALL use the `<DemoContainer>` component to display it
