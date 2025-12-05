# Design Document: ProForm Component Type Inference Fix

## Overview

本设计文档描述了修复 ProForm 组件类型推断问题的技术方案。当前实现使用通用的 `createField` 工厂函数，导致 TypeScript 无法推断底层 TDesign 组件的类型信息。

### 问题分析

Vue 3 的 `defineComponent` 不支持像 React 那样将泛型作为 props 传递。当前的 `createField` 函数返回的组件丢失了 TDesign 组件的类型信息，导致：

1. `fieldProps` 没有类型提示
2. IDE 无法提供自动补全
3. TypeScript 无法检测无效的 props

### 解决方案

采用**显式类型定义 + 组件工厂模式**：

1. 为每个 ProFormXXX 组件定义显式的 Props 类型，继承 TDesign 组件的 Props
2. 重构 `createField` 为类型安全的工厂函数
3. 每个组件使用 `defineComponent` 并显式声明 props 类型

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    ProFormXXX Components                     │
├─────────────────────────────────────────────────────────────┤
│  ProFormText    ProFormSelect    ProFormColorPicker  ...    │
│       │              │                  │                    │
│       ▼              ▼                  ▼                    │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              types.ts (Type Definitions)             │    │
│  │  ProFormTextProps = ProFormFieldItemProps<InputProps>│    │
│  │  ProFormSelectProps = ProFormFieldItemProps<SelectProps>│ │
│  └─────────────────────────────────────────────────────┘    │
│                          │                                   │
│                          ▼                                   │
│  ┌─────────────────────────────────────────────────────┐    │
│  │           createField (Factory Function)             │    │
│  │  - Accepts component config with typed props         │    │
│  │  - Returns typed Vue component                       │    │
│  │  - Handles form context integration                  │    │
│  └─────────────────────────────────────────────────────┘    │
│                          │                                   │
│                          ▼                                   │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              ProFormItem (Wrapper)                   │    │
│  │  - Label, validation, layout                         │    │
│  │  - Form context integration                          │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

## Components and Interfaces

### 1. 类型定义 (types.ts)

```typescript
import type {
  ColorPickerProps,
  InputProps,
  SelectProps,
  // ... other TDesign props
} from 'tdesign-vue-next'

// 基础 ProForm 字段属性
export interface ProFormFieldBaseProps {
  name?: string | string[]
  label?: string
  rules?: any[]
  required?: boolean
  help?: string
  extra?: string
  width?: string | number
  ignoreFormItem?: boolean
  valueType?: string
  valueEnum?: Record<string, any> | Map<string | number, any>
  transform?: (value: any, namePath: string | string[], allValues: any) => any
  convertValue?: (value: any, namePath: string | string[]) => any
  dataFormat?: string
  disabled?: boolean
  readonly?: boolean
  placeholder?: string | string[]
  emptyText?: string
  fieldProps?: Record<string, any>
  formItemProps?: Record<string, any>
  // ... other common props
}

// 泛型 ProForm 字段属性，T 为 TDesign 组件的 Props 类型
export type ProFormFieldItemProps<T = Record<string, any>> =
  ProFormFieldBaseProps & {
    fieldProps?: Partial<T>
  }

// 具体组件的 Props 类型
export type ProFormColorPickerProps = ProFormFieldItemProps<ColorPickerProps>
export type ProFormSelectProps = ProFormFieldItemProps<SelectProps>
export type ProFormTextProps = ProFormFieldItemProps<InputProps>
// ... other component props
```

### 2. createField 工厂函数重构

```typescript
import type { DefineComponent, PropType } from 'vue'
import { defineComponent } from 'vue'

export interface CreateFieldConfig<T> {
  name: string
  valueType?: string
  // 显式声明 fieldProps 的类型
  fieldPropsType?: T
  renderFormItem: (props: any, context: any) => any
}

// 返回类型化的组件
export function createField<T extends Record<string, any>>(
  config: CreateFieldConfig<T>
): DefineComponent<ProFormFieldItemProps<T>>
```

### 3. 组件实现模式

每个 ProFormXXX 组件采用以下模式：

```typescript
// ProFormColorPicker/index.tsx
import type { ColorPickerProps } from 'tdesign-vue-next'
import { ColorPicker } from 'tdesign-vue-next'
import type { ProFormColorPickerProps } from '../types'

export const ProFormColorPicker = defineComponent<ProFormColorPickerProps>({
  name: 'ProFormColorPicker',
  props: {
    // 显式声明所有 props
    name: [String, Array],
    label: String,
    fieldProps: {
      type: Object as PropType<Partial<ColorPickerProps>>,
      default: () => ({}),
    },
    // ... other props
  },
  setup(props, { slots, emit }) {
    // 实现逻辑
  },
})
```

## Data Models

### ProFormFieldBaseProps

| 属性           | 类型               | 说明                   |
| -------------- | ------------------ | ---------------------- |
| name           | string \| string[] | 字段名称               |
| label          | string             | 标签文本               |
| rules          | any[]              | 验证规则               |
| required       | boolean            | 是否必填               |
| help           | string             | 帮助文本               |
| extra          | string             | 额外信息               |
| width          | string \| number   | 宽度                   |
| ignoreFormItem | boolean            | 是否忽略 FormItem 包装 |
| valueType      | string             | 值类型                 |
| valueEnum      | Record \| Map      | 枚举值映射             |
| transform      | Function           | 提交时值转换           |
| convertValue   | Function           | 获取时值转换           |
| dataFormat     | string             | 数据格式               |
| disabled       | boolean            | 是否禁用               |
| readonly       | boolean            | 是否只读               |
| placeholder    | string \| string[] | 占位符                 |
| emptyText      | string             | 空值显示文本           |
| fieldProps     | object             | 传递给底层组件的属性   |
| formItemProps  | object             | 传递给 FormItem 的属性 |

## Correctness Properties

_A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees._

### Property 1: Component Export Validity

_For any_ ProFormXXX component exported from the library, the component SHALL be a valid Vue component that can be mounted without runtime errors.

**Validates: Requirements 2.3**

### Property 2: Common Props Acceptance

_For any_ ProFormXXX component and any valid combination of common ProForm props (name, label, rules, disabled, readonly, placeholder), the component SHALL accept these props without type errors and render correctly.

**Validates: Requirements 3.2, 6.4**

### Property 3: FieldProps Passthrough and v-model Binding

_For any_ ProFormXXX component, when fieldProps are provided, they SHALL be passed to the underlying TDesign component, and v-model binding SHALL correctly synchronize values between the component and its parent.

**Validates: Requirements 3.3, 3.4**

### Property 4: Form Context Integration

_For any_ ProFormXXX component used within a ProForm, the component SHALL integrate with the form context such that form.getFieldsValue() returns the component's current value.

**Validates: Requirements 4.1**

### Property 5: Validation Error Display

_For any_ ProFormXXX component with validation rules, when the value violates a rule, the component SHALL display the appropriate validation error message.

**Validates: Requirements 4.2**

### Property 6: IgnoreFormItem Behavior

_For any_ ProFormXXX component with ignoreFormItem set to true, the component SHALL render without the ProFormItem wrapper, resulting in a DOM structure that does not contain FormItem elements.

**Validates: Requirements 4.3**

### Property 7: Readonly Mode Display

_For any_ ProFormXXX component with readonly set to true, the component SHALL display the value in a read-only format (text display) rather than an editable input.

**Validates: Requirements 4.4**

### Property 8: Transform Function Application

_For any_ ProFormXXX component with a transform function, when the form is submitted, the submitted value SHALL be the result of applying the transform function to the original value.

**Validates: Requirements 4.5**

### Property 9: ProFormItem Integration

_For any_ ProFormXXX component created using the standard pattern (without ignoreFormItem), the component SHALL render with a ProFormItem wrapper that provides label and validation UI.

**Validates: Requirements 6.3**

## Error Handling

### Type Errors

- 当 `fieldProps` 包含无效属性时，TypeScript 编译器应报告类型错误
- 当必需的 props 缺失时，TypeScript 应提供明确的错误信息

### Runtime Errors

- 当组件在 ProForm 外部使用时，应优雅降级而不是抛出错误
- 当 valueEnum 格式无效时，应使用空选项列表并在控制台警告

### Validation Errors

- 验证错误应通过 ProFormItem 显示
- 错误消息应支持国际化

## Testing Strategy

### Dual Testing Approach

本项目采用单元测试和属性测试相结合的方式：

- **单元测试**: 验证特定示例和边界情况
- **属性测试**: 验证应在所有输入上成立的通用属性

### Property-Based Testing Library

使用 **fast-check** 作为属性测试库，配置每个属性测试运行至少 100 次迭代。

### Test File Structure

```
src/components/form/__tests__/
├── createField.test.ts          # 单元测试
├── createField.property.test.ts # 属性测试
├── components/
│   ├── ColorPicker.test.ts
│   ├── Select.test.ts
│   └── ...
```

### Property Test Annotation Format

每个属性测试必须使用以下格式标注：

```typescript
/**
 * **Feature: form-component-fixes, Property 1: Component Export Validity**
 */
it.prop([...], (input) => {
  // test implementation
})
```

### Unit Test Coverage

单元测试应覆盖：

1. 组件基本渲染
2. Props 传递
3. 事件处理
4. 边界情况（空值、无效输入等）

### Property Test Coverage

属性测试应覆盖：

1. 所有 ProFormXXX 组件的通用行为
2. fieldProps 传递的正确性
3. v-model 双向绑定
4. 表单上下文集成
5. 验证规则应用
