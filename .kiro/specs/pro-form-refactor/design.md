# Design Document: ProForm Refactor

## Overview

本设计文档描述了 ProForm 组件库的重构方案，包括三个主要部分：

1. **类型修复** - 修复 `label` 和 `help` 属性的 TypeScript 类型定义
2. **文件夹重命名** - 将组件文件夹从 PascalCase 改为 kebab-case
3. **文档重写** - 完全重写 ProForm 文档，添加详细的 demo 和 API 文档

## Architecture

### 当前架构

```
src/components/form/
├── BaseForm/           # 基础表单组件
├── components/         # 表单字段组件 (PascalCase)
│   ├── Captcha/
│   ├── Cascader/
│   ├── Checkbox/
│   ├── ColorPicker/
│   ├── DatePicker/
│   ├── DateRangePicker/
│   ├── Dependency/
│   ├── Digit/
│   ├── Field/
│   ├── FieldSet/
│   ├── FormItem/
│   ├── Group/
│   ├── List/
│   ├── Money/
│   ├── Password/
│   ├── Radio/
│   ├── Rate/
│   ├── Segmented/
│   ├── Select/
│   ├── Slider/
│   ├── Switch/
│   ├── Text/
│   ├── TextArea/
│   ├── TimePicker/
│   ├── TimeRangePicker/
│   ├── TreeSelect/
│   ├── UploadButton/
│   ├── UploadDragger/
│   ├── index.ts
│   └── types.ts
├── DrawerForm/
├── LightFilter/
├── ModalForm/
├── ProForm/
├── QueryFilter/
├── StepsForm/
├── utils/
└── index.ts
```

### 目标架构

```
src/components/form/
├── BaseForm/
├── components/         # 表单字段组件 (kebab-case)
│   ├── captcha/
│   ├── cascader/
│   ├── checkbox/
│   ├── color-picker/
│   ├── date-picker/
│   ├── date-range-picker/
│   ├── dependency/
│   ├── digit/
│   ├── field/
│   ├── field-set/
│   ├── form-item/
│   ├── group/
│   ├── list/
│   ├── money/
│   ├── password/
│   ├── radio/
│   ├── rate/
│   ├── segmented/
│   ├── select/
│   ├── slider/
│   ├── switch/
│   ├── text/
│   ├── text-area/
│   ├── time-picker/
│   ├── time-range-picker/
│   ├── tree-select/
│   ├── upload-button/
│   ├── upload-dragger/
│   ├── index.ts
│   └── types.ts
├── ...
└── index.ts
```

## Components and Interfaces

### 1. 类型修复方案

#### 问题分析

当前 `proFormFieldProps` 中的 `label` 和 `help` 类型定义为：

```typescript
label: [String, Function] as PropType<string | (() => VNode)>
help: [String, Function] as PropType<string | (() => VNode)>
```

但 TDesign FormItem 期望的类型是：

```typescript
// label 类型
label?: string | (() => VNode)

// help 类型
help?: string | VNode | ((params: { errors: VNode[]; warnings: VNode[] }) => VNode)
```

问题在于 Vue 的 `PropType` 推断与 TDesign 的类型定义不完全兼容，导致传递给 FormItem 时出现类型错误。

#### 解决方案

1. 修改 `proFormFieldProps.ts` 中的类型定义，使用更精确的类型
2. 在 `ProFormItem` 组件中添加类型转换逻辑

```typescript
// proFormFieldProps.ts
import type { FormItemProps } from 'tdesign-vue-next'

export const proFormFieldProps = {
  // ...
  /** 标签文本 - 与 TDesign FormItem label 类型兼容 */
  label: [String, Function] as PropType<FormItemProps['label']>,
  /** 帮助提示信息 - 与 TDesign FormItem help 类型兼容 */
  help: [String, Object, Function] as PropType<FormItemProps['help']>,
  // ...
}
```

### 2. 文件夹重命名映射

| 原名称          | 新名称            |
| --------------- | ----------------- |
| Captcha         | captcha           |
| Cascader        | cascader          |
| Checkbox        | checkbox          |
| ColorPicker     | color-picker      |
| DatePicker      | date-picker       |
| DateRangePicker | date-range-picker |
| Dependency      | dependency        |
| Digit           | digit             |
| Field           | field             |
| FieldSet        | field-set         |
| FormItem        | form-item         |
| Group           | group             |
| List            | list              |
| Money           | money             |
| Password        | password          |
| Radio           | radio             |
| Rate            | rate              |
| Segmented       | segmented         |
| Select          | select            |
| Slider          | slider            |
| Switch          | switch            |
| Text            | text              |
| TextArea        | text-area         |
| TimePicker      | time-picker       |
| TimeRangePicker | time-range-picker |
| TreeSelect      | tree-select       |
| UploadButton    | upload-button     |
| UploadDragger   | upload-dragger    |

### 3. 文档结构设计

```
docs/
├── .vitepress/
│   └── demos/
│       └── pro-form/
│           ├── Basic.vue           # 基础用法
│           ├── FormItems.vue       # 表单项组件
│           ├── Layout.vue          # 表单布局
│           ├── Validation.vue      # 表单验证
│           ├── Dependency.vue      # 表单联动
│           ├── DynamicForm.vue     # 动态表单
│           ├── Readonly.vue        # 只读模式
│           ├── LightFilter.vue     # 轻量筛选
│           ├── TextDemo.vue        # 文本输入
│           ├── SelectDemo.vue      # 选择器
│           ├── DatePickerDemo.vue  # 日期选择
│           ├── DigitDemo.vue       # 数字输入
│           ├── SwitchDemo.vue      # 开关
│           ├── RadioDemo.vue       # 单选
│           ├── CheckboxDemo.vue    # 复选
│           └── ...
└── components/
    └── pro-form.md                 # 主文档
```

## Data Models

### ProFormFieldProps 类型定义

```typescript
import type { FormItemProps } from 'tdesign-vue-next'
import type { VNode } from 'vue'

/**
 * ProForm 通用字段属性
 */
export interface ProFormFieldItemProps {
  /** 字段名称 */
  name?: string | string[]
  /** v-model 值 */
  modelValue?: any
  /** 标签 - 兼容 TDesign FormItem */
  label?: FormItemProps['label']
  /** 验证规则 */
  rules?: FormItemProps['rules']
  /** 是否必填 */
  required?: boolean
  /** 帮助信息 - 兼容 TDesign FormItem */
  help?: FormItemProps['help']
  /** 额外信息 */
  extra?: string | VNode | (() => VNode)
  /** 字段宽度 */
  width?: string | number
  /** 是否忽略 FormItem 包装 */
  ignoreFormItem?: boolean
  /** 值类型 */
  valueType?: string
  /** 值枚举 */
  valueEnum?: Record<string, any> | Map<string | number, any>
  /** 值转换函数 */
  transform?: SearchTransformKeyFn
  /** 数据格式 */
  dataFormat?: string
  /** 轻量模式属性 */
  lightProps?: LightProps
  /** 前置装饰 */
  addonBefore?: string | VNode | (() => VNode)
  /** 后置装饰 */
  addonAfter?: string | VNode | (() => VNode)
  /** 装饰容器样式 */
  addonWarpStyle?: Record<string, any>
  /** 是否次要 */
  secondary?: boolean
  /** 栅格列配置 */
  colProps?: Record<string, any>
  /** FormItem 额外属性 */
  formItemProps?: Partial<FormItemProps>
  /** 是否只读 */
  readonly?: boolean
  /** 空值文本 */
  emptyText?: string
}
```

## Correctness Properties

_A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees._

Based on the prework analysis, the following properties can be tested:

### Property 1: Label type conversion preserves value

_For any_ label value (string or function returning VNode), when passed to ProFormItem and converted for TDesign FormItem, the resulting label should be equivalent to the original value or its evaluated result.

**Validates: Requirements 1.3**

### Property 2: Help type conversion preserves value

_For any_ help value (string, VNode, or function), when passed to ProFormItem and converted for TDesign FormItem, the resulting help should be equivalent to the original value or its evaluated result.

**Validates: Requirements 1.4**

## Error Handling

### 类型错误处理

1. **label 类型不匹配**: 如果 label 是函数类型，在传递给 FormItem 前调用函数获取 VNode
2. **help 类型不匹配**: 如果 help 是函数类型，根据 TDesign FormItem 的期望格式进行适配

### 文件重命名错误处理

1. **导入路径错误**: 确保所有导入语句同步更新
2. **循环依赖**: 检查重命名后是否产生新的循环依赖

## Testing Strategy

### 双重测试方法

本项目采用单元测试和属性测试相结合的方式：

- **单元测试**: 验证具体示例和边界情况
- **属性测试**: 验证类型转换的通用正确性

### 属性测试框架

使用 **fast-check** 作为属性测试库，配合 Vitest 测试框架。

### 测试用例

#### 1. 类型转换测试

```typescript
import * as fc from 'fast-check'
import { describe, it, expect } from 'vitest'

describe('ProFormItem type conversion', () => {
  /**
   * Feature: pro-form-refactor, Property 1: Label type conversion preserves value
   * Validates: Requirements 1.3
   */
  it('should convert label correctly for any valid input', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          fc.string(),
          fc.constant(() => h('span', 'test')),
        ),
        (label) => {
          const result = convertLabel(label)
          // 验证转换结果有效
          return result !== undefined
        },
      ),
      { numRuns: 100 },
    )
  })

  /**
   * Feature: pro-form-refactor, Property 2: Help type conversion preserves value
   * Validates: Requirements 1.4
   */
  it('should convert help correctly for any valid input', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          fc.string(),
          fc.constant(() => h('span', 'help')),
        ),
        (help) => {
          const result = convertHelp(help)
          return result !== undefined
        },
      ),
      { numRuns: 100 },
    )
  })
})
```

#### 2. 文件结构测试

```typescript
describe('Folder naming convention', () => {
  it('should have all component folders in kebab-case', () => {
    const folders = fs.readdirSync('src/components/form/components')
    const kebabCaseRegex = /^[a-z]+(-[a-z]+)*$/

    folders
      .filter((f) => fs.statSync(path.join('src/components/form/components', f)).isDirectory())
      .forEach((folder) => {
        expect(folder).toMatch(kebabCaseRegex)
      })
  })
})
```

#### 3. 导入路径测试

```typescript
describe('Import paths', () => {
  it('should resolve all imports in index.ts', async () => {
    // 验证所有导入路径都能正确解析
    const indexContent = fs.readFileSync('src/components/form/components/index.ts', 'utf-8')
    const importPaths = extractImportPaths(indexContent)

    importPaths.forEach((importPath) => {
      const fullPath = path.resolve('src/components/form/components', importPath)
      expect(
        fs.existsSync(fullPath) ||
          fs.existsSync(fullPath + '.ts') ||
          fs.existsSync(fullPath + '/index.tsx'),
      ).toBe(true)
    })
  })
})
```

### 测试配置

每个属性测试配置运行至少 100 次迭代：

```typescript
fc.assert(property, { numRuns: 100 })
```
