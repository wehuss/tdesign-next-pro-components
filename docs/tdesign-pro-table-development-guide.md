# TDesign Pro Table 开发指南

基于对 Ant Design Pro Components Table 的深入分析，本文档为开发 TDesign Pro Table 提供详细的功能规划和实现方案。

## 项目概述

TDesign Pro Table 是基于 TDesign Vue Next Table 组件的高级封装，参考 Ant Design Pro Components Table 的设计理念，为 Vue 3 生态系统提供企业级表格解决方案。

## 核心功能规划

### 1. 数据请求管理 🔄

- **自动数据加载**: 实现类似 `request` 函数的异步数据获取机制
- **分页集成**: 自动处理分页参数 (`pageSize`, `current`)
- **加载状态**: 统一的 loading 状态管理
- **错误处理**: 内置错误边界和用户友好的错误提示

### 2. 搜索表单系统 🔍

- **自动生成**: 基于 columns 配置自动生成搜索表单
- **表单类型**: 支持 `query` (标准表单) 和 `light` (轻量表单) 两种模式
- **响应式布局**: 根据屏幕尺寸自适应表单布局
- **字段联动**: 支持复杂的表单字段依赖和联动逻辑

### 3. 值类型系统 (ValueType) 📊

参考 Ant Design 的 valueType，为 TDesign 生态实现：

- **基础类型**: `text`, `textarea`, `digit`, `money`, `percent`
- **选择类型**: `select`, `radio`, `checkbox`, `switch`
- **日期类型**: `date`, `dateRange`, `dateTime`, `dateTimeRange`, `time`
- **特殊类型**: `tag`, `badge`, `avatar`, `image`, `color`

### 4. 工具栏功能 🔧

- **标准操作**: 刷新、密度调整、全屏、列设置
- **快速搜索**: 内置搜索框支持关键词搜索
- **自定义按钮**: 灵活的自定义操作按钮配置
- **批量操作**: 选中行的批量操作工具栏

### 5. 列配置系统 📋

- **显示控制**: `hideInTable`, `hideInForm`, `hideInSearch`
- **列设置**: 可视化的列显示/隐藏、排序功能
- **列状态持久化**: 记住用户的列配置偏好
- **响应式列**: 根据屏幕尺寸自动调整列显示

### 6. 可编辑表格 ✏️

- **编辑模式**: 支持单行编辑和多行编辑
- **表单验证**: 集成 TDesign Form 的验证能力
- **自定义编辑器**: 支持自定义编辑组件
- **编辑状态管理**: 完整的编辑状态控制和数据同步

## 技术架构设计

### 组件结构

```
src/components/pro-table/
├── index.tsx                 # 主入口组件
├── types.ts                  # TypeScript 类型定义
├── hooks/
│   ├── use-fetch-data.ts     # 数据获取逻辑
│   ├── use-columns.ts        # 列处理逻辑
│   ├── use-search-form.ts    # 搜索表单逻辑
│   └── use-table-action.ts   # 表格操作逻辑
├── components/
│   ├── toolbar/              # 工具栏组件
│   │   ├── index.tsx
│   │   ├── density-icon.tsx
│   │   ├── full-screen-icon.tsx
│   │   ├── column-setting.tsx
│   │   └── reload-icon.tsx
│   ├── search-form/          # 搜索表单组件
│   │   ├── index.tsx
│   │   ├── query-form.tsx
│   │   └── light-form.tsx
│   ├── value-type/           # 值类型组件
│   │   ├── index.tsx
│   │   ├── text.tsx
│   │   ├── select.tsx
│   │   ├── date.tsx
│   │   └── money.tsx
│   └── editable/             # 可编辑相关
│       ├── index.tsx
│       ├── editable-cell.tsx
│       └── editable-row.tsx
└── utils/
    ├── column-utils.ts       # 列处理工具
    ├── form-utils.ts         # 表单工具
    └── value-type-utils.ts   # 值类型工具
```

### 核心 Props 设计

```typescript
interface ProTableProps<T = any, P = Record<string, any>> {
  // 数据相关
  request?: (params: P & PaginationParams) => Promise<{
    data: T[]
    total?: number
    success?: boolean
  }>
  dataSource?: T[]
  params?: Partial<P>

  // 列配置
  columns: ProColumn<T>[]

  // 搜索表单
  search?: false | SearchConfig

  // 工具栏
  toolbar?: ToolbarConfig
  toolbarRender?: (actions: ActionRef) => VNode[]

  // 操作引用
  actionRef?: Ref<ActionRef>

  // 其他 TDesign Table 属性
  loading?: boolean
  pagination?: PaginationProps
  rowSelection?: RowSelectionProps<T>
}

interface ProColumn<T = any> extends TableColumn<T> {
  // 值类型
  valueType?: ValueType
  valueEnum?: Record<string, ValueEnumItem>

  // 显示控制
  hideInTable?: boolean
  hideInForm?: boolean
  hideInSearch?: boolean

  // 搜索相关
  search?: SearchColumnConfig

  // 表单相关
  formItemProps?: FormItemProps
  fieldProps?: any

  // 渲染函数 (Vue 3)
  render?: (
    h: CreateElement,
    { value, record, index }: RenderContext<T>
  ) => VNode
  renderText?: (value: any, record: T, index: number) => string

  // 编辑相关
  editable?: boolean | ((record: T, index: number) => boolean)
}
```

## 实现优先级

### Phase 1: 基础功能 (MVP)

1. **基础 ProTable 组件**: 继承 TDesign Table 的所有功能
2. **简单的 request 数据获取**: 支持异步数据加载
3. **基础 valueType**: `text`, `select`, `date` 等常用类型
4. **基础工具栏**: 刷新、列设置等核心功能
5. **基础搜索表单**: 根据 columns 自动生成简单搜索表单

### Phase 2: 增强功能

1. **完整的 valueType 系统**: 支持所有规划的值类型
2. **高级搜索表单**: 支持 light 模式、表单联动
3. **完整工具栏**: 密度调整、全屏、自定义按钮
4. **列状态管理**: 列显示/隐藏、拖拽排序、状态持久化
5. **批量操作**: 行选择、批量操作栏

### Phase 3: 高级功能

1. **可编辑表格**: 单行/多行编辑、自定义编辑器
2. **虚拟滚动**: 大数据量性能优化
3. **主题定制**: 深度集成 TDesign 设计令牌
4. **国际化**: 完整的多语言支持
5. **无障碍**: ARIA 标准支持

## 关键实现要点

### 1. Vue 3 Composition API 设计

```typescript
// hooks/use-pro-table.ts
export function useProTable<T, P>(props: ProTableProps<T, P>) {
  // 数据获取
  const { data, loading, reload, pagination } = useFetchData(
    props.request,
    props.params
  )

  // 列处理
  const { tableColumns, searchColumns } = useColumns(props.columns)

  // 搜索表单
  const { searchForm, onSearch, onReset } = useSearchForm(searchColumns)

  // 工具栏
  const { toolbarActions } = useToolbar(props.toolbar)

  return {
    data,
    loading,
    reload,
    pagination,
    tableColumns,
    searchForm,
    onSearch,
    onReset,
    toolbarActions,
  }
}
```

### 2. ValueType 系统实现

```typescript
// value-type/index.ts
export const valueTypeMap = {
  text: {
    render: (value: any) => value,
    renderFormItem: (props: any) => h(TInput, props),
  },
  select: {
    render: (value: any, { valueEnum }: any) =>
      valueEnum?.[value]?.label || value,
    renderFormItem: (props: any) => h(TSelect, props),
  },
  date: {
    render: (value: any) => dayjs(value).format('YYYY-MM-DD'),
    renderFormItem: (props: any) => h(TDatePicker, props),
  },
  // ... 更多类型
}

export function renderValueType(
  valueType: ValueType,
  value: any,
  props: any,
  mode: 'read' | 'edit' = 'read'
) {
  const typeConfig = valueTypeMap[valueType]
  return mode === 'read'
    ? typeConfig.render(value, props)
    : typeConfig.renderFormItem({ ...props, value })
}
```

### 3. 响应式设计

```typescript
// hooks/use-responsive.ts
export function useResponsive() {
  const breakpoints = useBreakpoints({
    mobile: 768,
    tablet: 992,
    desktop: 1200,
  })

  const isMobile = computed(() => breakpoints.smaller('mobile'))
  const isTablet = computed(() => breakpoints.between('mobile', 'desktop'))
  const isDesktop = computed(() => breakpoints.greaterOrEqual('desktop'))

  return {
    isMobile,
    isTablet,
    isDesktop,
    breakpoints,
  }
}
```

### 4. 状态管理

```typescript
// composables/use-table-store.ts
export function useTableStore() {
  const columnsMap = ref<Record<string, ColumnState>>({})
  const tableSize = ref<TableSize>('medium')
  const searchValues = ref<Record<string, any>>({})

  const updateColumnState = (key: string, state: Partial<ColumnState>) => {
    columnsMap.value[key] = { ...columnsMap.value[key], ...state }
  }

  const resetColumnsState = () => {
    columnsMap.value = {}
  }

  return {
    columnsMap: readonly(columnsMap),
    tableSize: readonly(tableSize),
    searchValues: readonly(searchValues),
    updateColumnState,
    resetColumnsState,
  }
}
```

## 开发计划

### 第一周: 项目初始化

- [x] 项目结构搭建
- [x] TypeScript 配置
- [x] 基础组件架构设计
- [ ] 核心类型定义

### 第二周: 基础功能开发

- [ ] ProTable 主组件实现
- [ ] 基础 request 数据获取
- [ ] 简单 valueType 支持
- [ ] 基础工具栏实现

### 第三周: 搜索表单开发

- [ ] 搜索表单自动生成
- [ ] 表单布局和样式
- [ ] 表单验证集成
- [ ] 搜索和重置功能

### 第四周: 列配置系统

- [ ] 列显示/隐藏控制
- [ ] 列设置面板UI
- [ ] 列状态持久化
- [ ] 拖拽排序功能

## 总结

通过深入分析 Ant Design Pro Components Table 的功能特性和实现细节，我们为 TDesign Pro Table 制定了完整的开发计划。该项目将为 TDesign Vue Next 生态系统带来强大的企业级表格解决方案，帮助开发者快速构建功能丰富的数据管理界面。

关键优势：

- 🎯 **开箱即用**: 减少重复的表格配置代码
- 🚀 **高性能**: 基于 Vue 3 Composition API 的优化实现
- 🎨 **设计统一**: 深度集成 TDesign 设计系统
- 🔧 **高度可定制**: 灵活的配置和扩展机制
- 📱 **响应式**: 完美适配各种屏幕尺寸

开发团队可以基于这份文档开始 TDesign Pro Table 的开发工作，按照规划的优先级逐步实现各项功能。
