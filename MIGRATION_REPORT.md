# TDesign Pro Table - Utils 移植说明

## 概述

本次移植将 ant-design pro-components 中 `src/table/utils` 目录下的核心功能移植到了 TDesign Vue Next + Vue 3 环境中，适配了 TDesign 组件库和 Vue 3 的特性。

## 移植的核心文件

### 1. `src/components/table/utils/index.ts`

核心工具函数集合：

- `genColumnKey()` - 生成列的唯一标识
- `parseColKey()` - 解析列的 colKey
- `isMergeCell()` - 检查是否为合并单元格
- `transformColumns()` - 转换表单项到列配置
- `getFieldsValueObject()` - 获取表单字段值对象
- `conversionSubmitValue()` - 转换提交值格式

### 2. `src/components/table/utils/column-utils.ts`

列配置相关工具：

- `shouldShowColumn()` - 判断列是否显示
- `getColumnTitle()` - 获取列标题
- `hasFormConfig()` - 判断列是否有表单配置
- `getColumnFormConfig()` - 获取列的表单配置
- `getVisibleColumns()` - 筛选可见列
- `getFormColumns()` - 筛选有表单配置的列
- `columnToFormField()` - 将列配置转换为表单字段

### 3. `src/components/table/utils/form-utils.ts`

表单工具函数：

- `transformSubmitValues()` - 转换表单提交值
- `validateFormValues()` - 验证表单值
- `getFormDefaultValues()` - 获取表单默认值
- `filterFormFields()` - 过滤表单字段

### 4. `src/components/table/utils/form-item-render.tsx`

表单项渲染工具：

- `renderFormItem()` - 根据 valueType 渲染表单项
- `createFormItemRenderer()` - 创建完整表单项渲染器

### 5. `src/components/table/utils/conversion-submit-value.ts`

提交值转换工具（重点移植）：

- `conversionSubmitValue()` - 核心转换函数，支持：
  - 列配置中的 transform 函数
  - 自定义转换函数映射
  - 日期格式化
  - 空值处理
- `getFieldsValueObject()` - 获取指定字段的值对象

## 主要适配差异

### 1. Vue vs React 差异

- **组件创建**：使用 `createVNode` 替代 JSX 创建
- **响应式数据**：适配 Vue 3 的响应式系统
- **组件属性**：使用 TDesign 的 props 命名规范

### 2. TDesign vs Ant Design 差异

- **列标识**：使用 `colKey` 替代 `dataIndex`
- **组件命名**：`t-input` vs `a-input`
- **属性命名**：适配 TDesign 的属性命名规范
- **日期组件**：适配 TDesign 的日期选择器 API

### 3. 类型系统适配

- 使用 TypeScript 严格类型检查
- 适配 Vue 3 + TDesign 的类型定义
- 避免 `any` 类型，使用更精确的类型定义

## 现有表单项渲染逻辑的改进

### 原始逻辑

```typescript
// 之前：在 form-item.tsx 中重复的 switch 逻辑
const renderFormComponent = () => {
  switch (valueType) {
    case 'text': return <Input />
    case 'select': return <Select />
    // ... 更多重复代码
  }
}
```

### 改进后的逻辑

```typescript
// 现在：使用工具函数统一处理
import { renderFormItem } from '../../utils/form-item-render'

const formComponent = renderFormItem({
  column,
  value: props.modelValue,
  onChange: handleChange,
  mode: 'search',
})
```

## 核心功能示例

### 1. 表单提交值转换

```typescript
import { conversionSubmitValue } from '@/components/table/utils'

// 转换表单值
const submitValues = conversionSubmitValue(formValues, columns, {
  omitNil: true, // 忽略空值
  dateFormatter: 'YYYY-MM-DD', // 日期格式化
  dataFormatMap: {
    // 自定义转换
    dateRange: value => ({
      startDate: value[0],
      endDate: value[1],
    }),
  },
})
```

### 2. 列配置处理

```typescript
import { getFormColumns, columnToFormField } from '@/components/table/utils'

// 获取搜索表单的列
const searchColumns = getFormColumns(columns, 'searchForm')

// 转换为表单字段配置
const formFields = searchColumns.map(col =>
  columnToFormField(col, 'searchForm')
)
```

### 3. 表单项渲染

```typescript
import { renderFormItem } from '@/components/table/utils/form-item-render'

// 渲染表单项
const formItem = renderFormItem({
  column: {
    title: '用户名',
    colKey: 'username',
    valueType: 'text',
    form: { required: true },
  },
  value: username,
  onChange: setUsername,
  mode: 'search',
})
```

## 移植要点总结

1. **保持核心功能不变**：移植过程中保持了 ant-design pro-components 的核心逻辑和 API 设计
2. **适配组件库差异**：将 Ant Design 的组件调用适配为 TDesign 的组件调用
3. **Vue 3 优化**：利用 Vue 3 的组合式 API 和类型系统
4. **模块化设计**：将功能拆分到不同的工具文件中，提高可维护性
5. **类型安全**：使用 TypeScript 确保类型安全，减少运行时错误

这次移植成功将 ant-design pro-components 的表单渲染核心逻辑引入到 TDesign 生态中，为后续开发提供了强大的工具基础。
