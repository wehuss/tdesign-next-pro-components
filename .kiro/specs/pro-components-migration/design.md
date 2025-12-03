# Design Document: Pro-Components Vue 3 Migration

## Overview

本设计文档描述将 ant-design/pro-components (React) 迁移到 Vue 3 + TDesign 的技术方案。迁移目标是保持 API 兼容性的同时，充分利用 Vue 3 的响应式系统和 Composition API。

### 迁移策略

1. **渐进式迁移**: 按模块优先级逐步迁移，确保每个模块独立可用
2. **API 兼容**: 尽量保持与原版相似的 API 设计
3. **Vue 3 最佳实践**: 使用 Composition API、TypeScript、响应式系统
4. **TDesign 集成**: 基于 TDesign Vue Next 组件库构建

### 优先级排序

1. **P0 (核心)**: ProField、ProForm 基础、ProTable 核心
2. **P1 (重要)**: ProForm 布局、ProTable 高级功能、工具函数
3. **P2 (增强)**: ProProvider、工具 Hooks、工具组件
4. **P3 (扩展)**: ProCard、ProDescriptions、ProList、ProLayout

## Architecture

```
src/
├── components/
│   ├── field/                    # ProField 组件
│   │   ├── components/           # 各 valueType 组件
│   │   ├── composables/          # 组合式函数
│   │   ├── utils/                # 工具函数
│   │   ├── component.tsx         # 主组件
│   │   ├── types.ts              # 类型定义
│   │   └── value-type-map.tsx    # valueType 映射
│   │
│   ├── form/                     # ProForm 组件
│   │   ├── BaseForm/             # 基础表单
│   │   │   ├── LightWrapper/     # 轻量包装器
│   │   │   └── Submitter/        # 提交按钮
│   │   ├── components/           # 表单项组件
│   │   ├── layouts/              # 布局组件 (待创建)
│   │   │   ├── ProForm/
│   │   │   ├── ModalForm/
│   │   │   ├── DrawerForm/
│   │   │   ├── QueryFilter/
│   │   │   ├── LightFilter/
│   │   │   ├── StepsForm/
│   │   │   ├── LoginForm/        # 待迁移
│   │   │   ├── LoginFormPage/    # 待迁移
│   │   │   └── SchemaForm/       # 待迁移
│   │   ├── helpers/              # 辅助函数
│   │   └── utils/                # 工具函数
│   │
│   ├── table/                    # ProTable 组件
│   │   ├── components/           # 子组件
│   │   │   ├── alert/            # 选择提示
│   │   │   ├── toolbar/          # 工具栏
│   │   │   ├── column-setting/   # 列设置 (待迁移)
│   │   │   ├── form/             # 搜索表单 (待迁移)
│   │   │   ├── editable/         # 可编辑表格 (待迁移)
│   │   │   └── drag-sort/        # 拖拽排序 (待迁移)
│   │   ├── hooks/                # 组合式函数
│   │   ├── utils/                # 工具函数
│   │   └── store/                # 状态管理 (待迁移)
│   │
│   ├── provider/                 # 全局配置 (待迁移)
│   │   ├── locale/               # 国际化
│   │   └── context/              # 上下文
│   │
│   └── index.ts                  # 统一导出
│
├── utils/                        # 公共工具 (待迁移)
│   ├── hooks/                    # 通用 hooks
│   ├── components/               # 通用组件
│   └── helpers/                  # 辅助函数
│
└── types/                        # 全局类型定义
```

## Components and Interfaces

### 1. ProField 组件接口

```typescript
// src/components/field/types.ts
export type ProFieldValueType =
  | 'text'
  | 'password'
  | 'money'
  | 'textarea'
  | 'date'
  | 'dateTime'
  | 'dateWeek'
  | 'dateMonth'
  | 'dateQuarter'
  | 'dateYear'
  | 'dateRange'
  | 'dateTimeRange'
  | 'time'
  | 'timeRange'
  | 'select'
  | 'checkbox'
  | 'radio'
  | 'switch'
  | 'rate'
  | 'slider'
  | 'digit'
  | 'percent'
  | 'progress'
  | 'second'
  | 'code'
  | 'jsonCode'
  | 'avatar'
  | 'image'
  | 'cascader'
  | 'treeSelect'
  | 'color'
  | 'segmented'
  | 'digitRange'
  | 'fromNow'
  | 'index'
  | 'indexBorder'
  | 'option'

export type ProFieldMode = 'read' | 'edit' | 'update'

export interface ProFieldProps {
  value?: any
  onChange?: (value: any) => void
  valueType?: ProFieldValueType
  mode?: ProFieldMode
  valueEnum?: ProFieldValueEnumType
  fieldProps?: Record<string, any>
  renderFormItem?: (text: any, props: any) => VNode
  render?: (text: any, props: any) => VNode
  text?: any
  emptyText?: string
  request?: () => Promise<any>
}
```

### 2. ProForm 组件接口

```typescript
// src/components/form/typing.ts
export interface BaseFormProps {
  layout?: 'horizontal' | 'vertical' | 'inline'
  labelCol?: { span?: number; offset?: number }
  wrapperCol?: { span?: number; offset?: number }
  submitter?: SubmitterProps | false
  onFinish?: (values: any) => Promise<boolean | void>
  onReset?: () => void
  dateFormatter?: 'string' | 'number' | false
  omitNil?: boolean
  syncToUrl?: boolean | ((values: any, type: 'get' | 'set') => any)
  grid?: boolean
  rowProps?: Record<string, any>
  colProps?: Record<string, any>
}

export interface SubmitterProps {
  submitButtonProps?: ButtonProps | false
  resetButtonProps?: ButtonProps | false
  searchConfig?: {
    submitText?: string
    resetText?: string
  }
  render?: (props: any, dom: VNode[]) => VNode[] | VNode | false
  onSubmit?: () => void
  onReset?: () => void
}

export interface ProFormItemProps {
  name?: string | string[]
  label?: string | VNode
  tooltip?: string
  rules?: any[]
  required?: boolean
  valueType?: ProFieldValueType
  valueEnum?: ProFieldValueEnumType
  fieldProps?: Record<string, any>
  formItemProps?: Record<string, any>
  transform?: (value: any) => any
  convertValue?: (value: any) => any
  readonly?: boolean
  width?: number | 'sm' | 'md' | 'lg' | 'xl' | 'xs'
  colProps?: Record<string, any>
}
```

### 3. ProTable 组件接口

```typescript
// src/components/table/types.ts
export interface ProTableProps<T = any> {
  columns: ProTableColumn<T>[]
  request?: (
    params: RequestParams,
    sort?: SortInfo,
    filter?: FilterInfo
  ) => Promise<RequestData<T>>
  dataSource?: T[]
  params?: Record<string, any>
  pagination?: false | PaginationProps
  search?: false | SearchConfig
  toolbar?: false | ToolbarConfig
  toolbarRender?: (actionRef: ActionRef) => VNode
  headerTitle?: string | VNode
  tooltip?: string
  rowKey: string
  rowSelection?: RowSelectionConfig | false
  loading?: boolean
  cardBordered?: boolean
  ghost?: boolean
  polling?: number | boolean
  manual?: boolean
  onLoad?: (dataSource: T[]) => void
  onRequestError?: (error: Error) => void
  postData?: (data: T[]) => T[]
  actionRef?: Ref<ActionRef>
  formRef?: Ref<any>
  editable?: EditableConfig<T>
  onDataSourceChange?: (dataSource: T[]) => void
}

export interface ActionRef {
  reload: (resetPageIndex?: boolean) => Promise<void>
  reloadAndReset: () => Promise<void>
  reset: () => void
  clearSelected?: () => void
  setPageInfo: (pageInfo: Partial<PaginationParams>) => void
  startEditable?: (rowKey: string | number) => void
  cancelEditable?: (rowKey: string | number) => void
}

export interface ProTableColumn<T = any> {
  title?: string | VNode
  dataIndex?: string | string[]
  key?: string
  valueType?: ProFieldValueType | ((record: T) => ProFieldValueType)
  valueEnum?: ProFieldValueEnumType
  render?: (dom: VNode, record: T, index: number) => VNode
  renderText?: (text: any, record: T, index: number) => any
  renderFormItem?: (schema: any, config: any) => VNode
  hideInTable?: boolean
  hideInSearch?: boolean
  hideInForm?: boolean
  search?: boolean | SearchColumnConfig
  editable?: boolean | ((text: any, record: T, index: number) => boolean)
  sorter?: boolean | CompareFn<T>
  filters?: FilterItem[]
  width?: number | string
  fixed?: 'left' | 'right'
  ellipsis?: boolean
  copyable?: boolean
  order?: number
  formItemProps?: Record<string, any>
  fieldProps?: Record<string, any>
}
```

### 4. ProProvider 接口 (待迁移)

```typescript
// src/components/provider/types.ts
export interface ProConfigProviderProps {
  locale?: ProLocale
  valueTypeMap?: Record<string, ProFieldValueTypeConfig>
  token?: ProToken
  hashed?: boolean
  dark?: boolean
  prefixCls?: string
}

export interface ProLocale {
  locale: string
  tableForm: {
    search: string
    reset: string
    submit: string
    collapsed: string
    expand: string
    inputPlaceholder: string
    selectPlaceholder: string
  }
  alert: {
    clear: string
    selected: string
    item: string
  }
  pagination: {
    total: {
      range: string
      total: string
      item: string
    }
  }
  // ... more locale keys
}
```

## Data Models

### 1. 表单数据模型

```typescript
// 表单值类型
export type FormValues = Record<string, any>

// 表单状态
export interface FormState {
  values: FormValues
  errors: Record<string, string[]>
  touched: Record<string, boolean>
  submitting: boolean
  validating: boolean
}

// 表单项状态
export interface FormItemState {
  value: any
  error: string[]
  touched: boolean
  validating: boolean
}
```

### 2. 表格数据模型

```typescript
// 分页信息
export interface PageInfo {
  current: number
  pageSize: number
  total: number
}

// 请求响应
export interface RequestData<T> {
  data: T[]
  success: boolean
  total: number
  errorMessage?: string
}

// 列状态
export interface ColumnsState {
  show?: boolean
  fixed?: 'left' | 'right'
  order?: number
  disable?: boolean
}

// 可编辑行状态
export interface EditableRowState {
  editableKeys: (string | number)[]
  editableRows: Record<string | number, any>
}
```

### 3. ValueEnum 数据模型

```typescript
// 枚举值配置
export type ProFieldValueEnumType =
  | Record<string, string | ProFieldValueEnumItem>
  | Map<string | number, string | ProFieldValueEnumItem>

export interface ProFieldValueEnumItem {
  text: string
  status?: 'success' | 'error' | 'processing' | 'warning' | 'default'
  color?: string
  disabled?: boolean
}
```

## Correctness Properties

_A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees._

### Property 1: ValueType Rendering Consistency

_For any_ valid valueType and value combination, ProField SHALL render the appropriate component and display the value correctly in both read and edit modes.
**Validates: Requirements 1.1-1.17**

### Property 2: Mode Switching Preservation

_For any_ ProField with a value, switching between mode="read" and mode="edit" SHALL preserve the underlying value without data loss.
**Validates: Requirements 1.16, 1.17**

### Property 3: Form Value Binding

_For any_ ProForm field component with a name prop, the field value SHALL be correctly bound to the form state, and changes SHALL propagate bidirectionally.
**Validates: Requirements 3.1-3.18**

### Property 4: Form List Operations

_For any_ ProFormList, adding an item SHALL increase the list length by 1, and removing an item SHALL decrease the list length by 1, while preserving other items.
**Validates: Requirements 4.2**

### Property 5: Table Request Pagination

_For any_ ProTable with request prop, changing pagination parameters SHALL trigger a new request with the correct page and pageSize values.
**Validates: Requirements 6.1, 6.5**

### Property 6: Column ValueType Rendering

_For any_ ProTable column with valueType, the cell content SHALL be rendered using the corresponding ProField component.
**Validates: Requirements 6.2, 9.2**

### Property 7: Table Action Ref Methods

_For any_ ProTable with actionRef, calling reload() SHALL refresh the data, and calling reset() SHALL clear filters and reset pagination.
**Validates: Requirements 6.7**

### Property 8: Column Transformation

_For any_ ProColumns configuration, genProColumnToColumn SHALL produce valid TDesign table columns with correct render functions.
**Validates: Requirements 9.1**

### Property 9: Utility Function Purity

_For any_ utility function (omitUndefined, stringify, etc.), calling with the same input SHALL always produce the same output.
**Validates: Requirements 11.1-11.19**

### Property 10: Editable Table State

_For any_ EditableTable, starting edit on a row SHALL add the rowKey to editableKeys, and canceling SHALL remove it, while preserving row data.
**Validates: Requirements 8.1-8.3**

## Error Handling

### 1. 请求错误处理

```typescript
// ProTable 请求错误处理
const handleRequestError = (error: Error) => {
  // 1. 调用用户提供的 onRequestError
  props.onRequestError?.(error)

  // 2. 设置错误状态
  state.error = error
  state.loading = false

  // 3. 显示错误提示 (可选)
  if (props.showErrorMessage !== false) {
    Message.error(error.message || '请求失败')
  }
}
```

### 2. 表单验证错误

```typescript
// 表单验证错误处理
const handleValidationError = (errors: Record<string, string[]>) => {
  // 1. 更新表单错误状态
  formState.errors = errors

  // 2. 滚动到第一个错误字段
  const firstErrorField = Object.keys(errors)[0]
  if (firstErrorField) {
    scrollToField(firstErrorField)
  }

  // 3. 触发 onFinishFailed 回调
  props.onFinishFailed?.({ values: formState.values, errors })
}
```

### 3. 组件边界错误

```typescript
// ErrorBoundary 组件 (待迁移)
const ErrorBoundary = defineComponent({
  props: {
    fallback: Function,
  },
  setup(props, { slots }) {
    const error = ref<Error | null>(null);

    onErrorCaptured((err) => {
      error.value = err;
      return false; // 阻止错误继续传播
    });

    return () => {
      if (error.value) {
        return props.fallback?.(error.value) ?? (
          <div class="error-boundary">
            <p>Something went wrong</p>
            <pre>{error.value.message}</pre>
          </div>
        );
      }
      return slots.default?.();
    };
  },
});
```

## Testing Strategy

### 测试框架选择

- **单元测试**: Vitest
- **属性测试**: fast-check (Property-Based Testing)
- **组件测试**: @vue/test-utils
- **E2E 测试**: Playwright (可选)

### 测试目录结构

```
src/
├── components/
│   ├── field/
│   │   ├── __tests__/
│   │   │   ├── field.test.ts           # 单元测试
│   │   │   └── field.property.test.ts  # 属性测试
│   ├── form/
│   │   ├── __tests__/
│   │   │   ├── base-form.test.ts
│   │   │   └── form-fields.property.test.ts
│   └── table/
│       ├── __tests__/
│       │   ├── table.test.ts
│       │   └── table.property.test.ts
```

### 属性测试示例

```typescript
// field.property.test.ts
import { fc } from 'fast-check'
import { mount } from '@vue/test-utils'
import ProField from '../component'

describe('ProField Property Tests', () => {
  // **Feature: pro-components-migration, Property 1: ValueType Rendering Consistency**
  it('should render correctly for any valueType and value', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          fc.constant('text'),
          fc.constant('money'),
          fc.constant('date'),
          fc.constant('select'),
          fc.constant('digit')
        ),
        fc.anything(),
        (valueType, value) => {
          const wrapper = mount(ProField, {
            props: { valueType, value, mode: 'read' },
          })
          expect(wrapper.exists()).toBe(true)
        }
      ),
      { numRuns: 100 }
    )
  })

  // **Feature: pro-components-migration, Property 2: Mode Switching Preservation**
  it('should preserve value when switching modes', () => {
    fc.assert(
      fc.property(fc.string(), value => {
        const wrapper = mount(ProField, {
          props: { valueType: 'text', value, mode: 'read' },
        })

        // Switch to edit mode
        wrapper.setProps({ mode: 'edit' })

        // Value should be preserved
        expect(wrapper.props('value')).toBe(value)
      }),
      { numRuns: 100 }
    )
  })
})
```

### 单元测试示例

```typescript
// table.test.ts
import { mount } from '@vue/test-utils'
import ProTable from '../index'

describe('ProTable', () => {
  it('should render with columns', () => {
    const columns = [
      { title: 'Name', dataIndex: 'name' },
      { title: 'Age', dataIndex: 'age', valueType: 'digit' },
    ]

    const wrapper = mount(ProTable, {
      props: { columns, rowKey: 'id' },
    })

    expect(wrapper.find('.t-pro-table').exists()).toBe(true)
  })

  it('should call request on mount', async () => {
    const request = vi.fn().mockResolvedValue({
      data: [{ id: 1, name: 'Test' }],
      success: true,
      total: 1,
    })

    mount(ProTable, {
      props: {
        columns: [{ title: 'Name', dataIndex: 'name' }],
        rowKey: 'id',
        request,
      },
    })

    await flushPromises()
    expect(request).toHaveBeenCalled()
  })
})
```

### 测试覆盖要求

1. **属性测试**: 每个 Correctness Property 必须有对应的属性测试
2. **单元测试**: 核心组件和工具函数需要单元测试覆盖
3. **集成测试**: 组件间交互需要集成测试
4. **测试运行**: 每个属性测试至少运行 100 次迭代
