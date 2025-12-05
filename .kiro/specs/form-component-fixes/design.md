# Design Document: ProForm Component Fixes

## Overview

本设计文档描述修复 Vue 3 ProForm 组件迁移问题的技术方案。主要解决三个核心问题：

1. **TDesign Form 事件签名不匹配**: TDesign Form 的 `onSubmit` 事件接收 `SubmitContext` 对象，而非直接的表单值
2. **Vue 泛型限制**: Vue 组件不支持将泛型作为 props 传递，需要重新设计类型系统
3. **属性继承问题**: 组件渲染 fragment 时无法自动继承属性，需要显式处理

### 修复策略

1. **适配 TDesign Form 事件**: 在 BaseForm 中正确解析 SubmitContext，提取表单值
2. **简化类型系统**: 移除无效的泛型参数，使用运行时类型检查
3. **显式属性处理**: 使用 `inheritAttrs: false` 并手动处理 attrs

## Architecture

```
src/components/form/
├── BaseForm/
│   ├── BaseForm.tsx          # 修复 onSubmit 事件处理
│   ├── Submitter/            # 提交按钮组件
│   └── ...
├── components/
│   ├── FormItem/             # 修复属性过滤
│   ├── Select/               # 修复 Select 组件
│   └── ...
└── utils/
    └── createField.tsx       # 修复工厂函数
```

## Components and Interfaces

### 1. BaseForm 修复方案

```typescript
// TDesign Form 的 SubmitContext 类型
interface SubmitContext<T = any> {
  e?: FormSubmitEvent
  validateResult: FormValidateResult<T>
  firstError?: string
  fields?: any
}

// 修复后的 handleFinish
const handleFinish = async (context: SubmitContext) => {
  const { validateResult, firstError } = context

  // 验证失败
  if (validateResult !== true) {
    handleFinishFailed({ validateResult, firstError })
    return
  }

  // 获取表单值 - 使用 TDesign Form 的 data prop 或收集字段值
  const values = props.data || collectFormValues()

  // 调用用户的 onFinish
  await props.onFinish?.(values)
  emit('finish', values)
}
```

### 2. createField 修复方案

```typescript
// 移除无效的泛型参数
export function createField(config: CreateFieldConfig) {
  return defineComponent({
    name: config.name,
    inheritAttrs: false,  // 关键：禁用自动属性继承
    props: {
      // 定义所有需要的 props
    },
    setup(props, { slots, emit, attrs }) {
      // 过滤不需要传递的 attrs
      const filteredAttrs = computed(() => {
        const { title, description, dataIndex, ...rest } = attrs
        return rest
      })

      return () => {
        // 使用 filteredAttrs 而非 attrs
        return (
          <ProFormItem {...filteredAttrs.value}>
            {config.renderFormItem(props, { slots, emit })}
          </ProFormItem>
        )
      }
    }
  })
}
```

### 3. ProFormItem 属性过滤

```typescript
// 需要过滤的属性列表（来自 ProTable columns 等）
const FILTERED_ATTRS = [
  'title',
  'description',
  'dataIndex',
  'key',
  'hideInTable',
  'hideInSearch',
  'hideInForm',
  'sorter',
  'filters',
  'ellipsis',
  'copyable',
  'order',
]

// 在 ProFormItem 中过滤
const filterAttrs = (attrs: Record<string, any>) => {
  return Object.fromEntries(
    Object.entries(attrs).filter(([key]) => !FILTERED_ATTRS.includes(key))
  )
}
```

## Data Models

### 1. 表单提交上下文

```typescript
// TDesign Form SubmitContext
interface SubmitContext<T = any> {
  e?: FormSubmitEvent
  validateResult: FormValidateResult<T>
  firstError?: string
  fields?: any
}

// 验证结果类型
type FormValidateResult<T> = boolean | ValidateResultObj<T>
type ValidateResultObj<T> = {
  [key in keyof T]: boolean | ValidateResultList
}
```

### 2. 表单值收集

```typescript
// 表单值类型
type FormValues = Record<string, any>

// 字段注册信息
interface FieldRegistration {
  name: string | string[]
  getValue: () => any
  setValue: (value: any) => void
}
```

## Correctness Properties

_A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees._

### Property 1: Form Submit Triggers onFinish

_For any_ valid form with fields and an onFinish handler, when the form is submitted and validation passes, onFinish SHALL be called with the collected form values.
**Validates: Requirements 1.1, 1.3**

### Property 2: Form Validation Failure Triggers onFinishFailed

_For any_ form with validation rules and invalid field values, when the form is submitted, onFinishFailed SHALL be called with the validation errors.
**Validates: Requirements 1.2**

### Property 3: Field v-model Bidirectional Binding

_For any_ field component with v-model binding, changing the model value SHALL update the field display, and changing the field input SHALL update the model value.
**Validates: Requirements 2.3, 5.3**

### Property 4: createField Returns Valid Component

_For any_ valid CreateFieldConfig, calling createField SHALL return a Vue component that can be rendered without errors.
**Validates: Requirements 2.1**

### Property 5: Attribute Filtering Prevents Warnings

_For any_ ProFormItem with extra attributes from ProTable columns, the component SHALL filter out non-applicable attributes and render without console warnings.
**Validates: Requirements 3.3, 3.4**

### Property 6: Select Options Rendering

_For any_ ProFormSelect with options array, all options SHALL be rendered in the dropdown and selectable.
**Validates: Requirements 4.1, 4.2**

### Property 7: Form Reset Restores Initial Values

_For any_ form with initial values, calling reset SHALL restore all field values to their initial state.
**Validates: Requirements 5.4**

## Error Handling

### 1. 表单提交错误处理

```typescript
const handleFinish = async (context: SubmitContext) => {
  const { validateResult, firstError } = context

  // 验证失败 - 调用 onFinishFailed
  if (validateResult !== true) {
    const errorInfo = {
      validateResult,
      firstError,
      errorFields: extractErrorFields(validateResult),
    }

    if (props.onFinishFailed) {
      const handlers = Array.isArray(props.onFinishFailed)
        ? props.onFinishFailed
        : [props.onFinishFailed]
      handlers.forEach(handler => handler?.(errorInfo))
    }
    emit('finishFailed', errorInfo)
    return
  }

  // 验证成功 - 调用 onFinish
  try {
    const values = getFormValues()
    if (props.onFinish) {
      const handlers = Array.isArray(props.onFinish)
        ? props.onFinish
        : [props.onFinish]
      for (const handler of handlers) {
        await handler?.(values)
      }
    }
    emit('finish', values)
  } catch (error) {
    console.error('Form submit error:', error)
    throw error
  }
}
```

### 2. 属性过滤错误处理

```typescript
const filterAttrs = (attrs: Record<string, any>) => {
  try {
    return Object.fromEntries(
      Object.entries(attrs).filter(([key]) => !FILTERED_ATTRS.includes(key))
    )
  } catch (error) {
    console.warn('Error filtering attrs:', error)
    return {}
  }
}
```

## Testing Strategy

### 测试框架选择

- **单元测试**: Vitest
- **属性测试**: fast-check (Property-Based Testing)
- **组件测试**: @vue/test-utils

### 测试目录结构

```
src/components/form/
├── __tests__/
│   ├── BaseForm.test.ts           # BaseForm 单元测试
│   ├── BaseForm.property.test.ts  # BaseForm 属性测试
│   ├── createField.test.ts        # createField 单元测试
│   └── ProFormSelect.test.ts      # Select 组件测试
```

### 属性测试示例

```typescript
// BaseForm.property.test.ts
import { fc } from 'fast-check'
import { mount } from '@vue/test-utils'
import { BaseForm } from '../BaseForm'
import { ProFormText } from '../components/Text'

describe('BaseForm Property Tests', () => {
  // **Feature: form-component-fixes, Property 1: Form Submit Triggers onFinish**
  it('should call onFinish with form values when validation passes', () => {
    fc.assert(
      fc.property(
        fc.record({
          username: fc.string({ minLength: 1 }),
          email: fc.emailAddress(),
        }),
        async formData => {
          const onFinish = vi.fn()
          const wrapper = mount(BaseForm, {
            props: {
              data: formData,
              onFinish,
            },
            slots: {
              default: () => [
                h(ProFormText, { name: 'username' }),
                h(ProFormText, { name: 'email' }),
              ],
            },
          })

          // Simulate successful submit
          await wrapper.vm.handleFinish({
            validateResult: true,
            firstError: undefined,
          })

          expect(onFinish).toHaveBeenCalledWith(formData)
        }
      ),
      { numRuns: 100 }
    )
  })

  // **Feature: form-component-fixes, Property 2: Form Validation Failure Triggers onFinishFailed**
  it('should call onFinishFailed when validation fails', () => {
    fc.assert(
      fc.property(fc.string({ minLength: 1 }), async errorMessage => {
        const onFinishFailed = vi.fn()
        const wrapper = mount(BaseForm, {
          props: { onFinishFailed },
        })

        // Simulate failed validation
        await wrapper.vm.handleFinish({
          validateResult: {
            username: [{ result: false, message: errorMessage }],
          },
          firstError: errorMessage,
        })

        expect(onFinishFailed).toHaveBeenCalled()
      }),
      { numRuns: 100 }
    )
  })
})
```

### 单元测试示例

```typescript
// createField.test.ts
import { mount } from '@vue/test-utils'
import { createField } from '../utils/createField'
import { Input } from 'tdesign-vue-next'

describe('createField', () => {
  it('should create a valid Vue component', () => {
    const TestField = createField({
      name: 'TestField',
      renderFormItem: (props) => <Input v-model={props.modelValue.value} />
    })

    expect(TestField.name).toBe('TestField')
    expect(TestField.inheritAttrs).toBe(false)
  })

  it('should filter out table column attributes', () => {
    const TestField = createField({
      name: 'TestField',
      renderFormItem: (props) => <Input v-model={props.modelValue.value} />
    })

    const wrapper = mount(TestField, {
      props: { name: 'test' },
      attrs: {
        title: 'Column Title',
        dataIndex: 'test',
        hideInTable: true,
        class: 'custom-class'  // This should pass through
      }
    })

    // title, dataIndex, hideInTable should be filtered
    // class should pass through
    expect(wrapper.classes()).toContain('custom-class')
  })
})
```

### 测试覆盖要求

1. **属性测试**: 每个 Correctness Property 必须有对应的属性测试
2. **单元测试**: 核心组件和工具函数需要单元测试覆盖
3. **测试运行**: 每个属性测试至少运行 100 次迭代
4. **测试标注**: 每个属性测试必须使用格式 `**Feature: form-component-fixes, Property {number}: {property_text}**`
