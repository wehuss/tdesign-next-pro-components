# ProField 组件使用指南

## 概述

ProField 是一个通用的字段渲染组件，基于 Ant Design Pro 的 Field 组件进行 Vue 3 + TDesign 移植。它支持多种数据类型的展示和编辑，可以根据 `valueType` 自动选择合适的组件进行渲染。

## 特性

- 🎯 **类型安全**：完全基于 TypeScript，严格的类型检查
- 🔀 **双模式支持**：支持只读（read）和编辑（edit）模式
- 🧩 **组件化设计**：基于 valueType 映射的可插拔组件系统
- 🎨 **TDesign 集成**：深度集成 TDesign Vue Next 组件库
- ⚡ **Vue 3 优化**：使用 Composition API 和 JSX 语法

## 基本用法

```vue
<template>
  <ProField :text="value" valueType="text" mode="read" />
</template>

<script setup lang="ts">
  import { ProField } from 'tdesign-pro-components'

  const value = ref('Hello World')
</script>
```

## 支持的 ValueType

### 基础类型

| ValueType  | 描述     | 只读显示       | 编辑组件             |
| ---------- | -------- | -------------- | -------------------- |
| `text`     | 文本     | 纯文本         | Input                |
| `textarea` | 多行文本 | 保留换行的文本 | Textarea             |
| `password` | 密码     | 掩码显示       | Input[type=password] |

### 数值类型

| ValueType | 描述   | 只读显示   | 编辑组件    |
| --------- | ------ | ---------- | ----------- |
| `digit`   | 数字   | 格式化数字 | InputNumber |
| `money`   | 金额   | 货币格式   | InputNumber |
| `percent` | 百分比 | 百分比显示 | InputNumber |

### 日期时间类型

| ValueType   | 描述     | 只读显示     | 编辑组件        |
| ----------- | -------- | ------------ | --------------- |
| `date`      | 日期     | 格式化日期   | DatePicker      |
| `dateRange` | 日期范围 | 日期范围文本 | DateRangePicker |
| `time`      | 时间     | 格式化时间   | TimePicker      |

### 选择类型

| ValueType     | 描述       | 只读显示   | 编辑组件                   |
| ------------- | ---------- | ---------- | -------------------------- |
| `select`      | 下拉选择   | 选项文本   | Select                     |
| `radio`       | 单选框     | 选项文本   | RadioGroup                 |
| `radioButton` | 按钮式单选 | 选项文本   | RadioGroup[variant=filled] |
| `checkbox`    | 复选框     | 选中项文本 | CheckboxGroup              |

### 交互类型

| ValueType | 描述 | 只读显示 | 编辑组件 |
| --------- | ---- | -------- | -------- |
| `switch`  | 开关 | 是/否    | Switch   |
| `rate`    | 评分 | 星级显示 | Rate     |
| `slider`  | 滑块 | 数值     | Slider   |

## Props 配置

### 基础 Props

| 属性          | 类型                           | 默认值   | 说明             |
| ------------- | ------------------------------ | -------- | ---------------- |
| `text`        | `ProFieldTextType`             | -        | 显示的文本或值   |
| `valueType`   | `ProFieldValueType`            | `'text'` | 值的类型         |
| `mode`        | `'read' \| 'edit' \| 'update'` | `'read'` | 渲染模式         |
| `readonly`    | `boolean`                      | `false`  | 是否只读         |
| `disabled`    | `boolean`                      | `false`  | 是否禁用         |
| `placeholder` | `string \| string[]`           | -        | 占位符           |
| `emptyText`   | `string \| false`              | `'-'`    | 空值时显示的文本 |

### 高级 Props

| 属性             | 类型                                           | 默认值 | 说明                 |
| ---------------- | ---------------------------------------------- | ------ | -------------------- |
| `valueEnum`      | `ProFieldValueEnumObj \| ProFieldValueEnumMap` | -      | 值枚举配置           |
| `fieldProps`     | `Record<string, unknown>`                      | `{}`   | 透传给具体组件的属性 |
| `render`         | `ProFieldRenderFunction`                       | -      | 自定义只读渲染函数   |
| `formItemRender` | `ProFieldRenderFunction`                       | -      | 自定义编辑渲染函数   |

### 事件

| 事件           | 类型                       | 说明         |
| -------------- | -------------------------- | ------------ |
| `change`       | `(value: unknown) => void` | 值改变时触发 |
| `update:value` | `(value: unknown) => void` | v-model 支持 |

## ValueEnum 配置

对于选择类型的组件（select, radio, checkbox），可以通过 `valueEnum` 配置选项：

```typescript
// 对象形式
const valueEnum = {
  option1: { text: '选项一', color: 'blue' },
  option2: { text: '选项二', color: 'green' },
  option3: { text: '选项三', color: 'red' },
}

// Map 形式
const valueEnum = new Map([
  ['option1', { text: '选项一', disabled: false }],
  ['option2', { text: '选项二', disabled: true }],
])
```

## 使用示例

### 1. 基础文本字段

```vue
<ProField text="Hello World" valueType="text" mode="read" />

<ProField
  v-model:value="textValue"
  valueType="text"
  mode="edit"
  placeholder="请输入文本"
/>
```

### 2. 金额字段

```vue
<ProField :text="12345.67" valueType="money" mode="read" />

<ProField
  v-model:value="moneyValue"
  valueType="money"
  mode="edit"
  :fieldProps="{ precision: 2 }"
/>
```

### 3. 选择字段

```vue
<ProField
  text="option1"
  valueType="select"
  mode="read"
  :valueEnum="{
    option1: { text: '选项一' },
    option2: { text: '选项二' },
  }"
/>
```

### 4. 日期字段

```vue
<ProField text="2023-12-25" valueType="date" mode="read" />

<ProField
  v-model:value="dateValue"
  valueType="date"
  mode="edit"
  :fieldProps="{ format: 'YYYY-MM-DD' }"
/>
```

### 5. 自定义渲染

```vue
<ProField
  text="custom"
  valueType="text"
  mode="read"
  :render="
    (text, props, dom) => <span style={{ color: 'red' }}>自定义: {text}</span>
  "
/>
```

## 类型定义

```typescript
export interface ProFieldProps {
  text?: ProFieldTextType
  valueType?: ProFieldValueType
  mode?: ProFieldMode
  readonly?: boolean
  disabled?: boolean
  placeholder?: string | string[]
  emptyText?: ProFieldEmptyText
  valueEnum?: ProFieldValueEnumObj | ProFieldValueEnumMap
  fieldProps?: Record<string, unknown>
  render?: ProFieldRenderFunction
  formItemRender?: ProFieldRenderFunction
  onChange?: (value: unknown) => void
}
```

## 扩展新组件

要添加新的 valueType 支持，请按以下步骤：

1. 在 `types.ts` 中添加新的 valueType
2. 创建对应的 Field 组件
3. 在 `value-type-map.tsx` 中注册组件
4. 更新 `field-exports.ts` 导出新组件

```typescript
// 1. 添加类型
export type ProFieldValueType =
  | 'text'
  | 'newType' // 新增

// 2. 创建组件 FieldNewType.tsx
export const FieldNewType = defineComponent({
  // 组件实现
})

// 3. 注册到映射表
export const valueTypeToComponentMap = {
  newType: {
    render: (text, props) => <FieldNewType text={text} {...props} />,
    formItemRender: (text, props) => <FieldNewType text={text} mode="edit" {...props} />,
  },
}
```

## 注意事项

1. **类型安全**：确保传入的 `text` 值类型与 `valueType` 匹配
2. **性能优化**：对于大量 Field 组件的场景，建议使用 `v-memo` 或 `keep-alive`
3. **样式定制**：通过 `fieldProps` 传递样式相关属性
4. **表单集成**：可与 TDesign 的 Form 组件无缝集成使用

## 更新日志

### v0.1.0

- ✅ 完成基础 ProField 组件
- ✅ 支持 15+ 种 valueType
- ✅ 实现只读/编辑模式切换
- ✅ 集成 TDesign Vue Next
- ✅ 完整的 TypeScript 支持
