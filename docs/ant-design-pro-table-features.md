# Ant Design Pro Components Table 功能文档

## 概述

ProTable 是基于 Ant Design Table 组件的高级封装，专为企业级应用设计。它提供了预设的行为和逻辑，大大减少了在项目中编写表格样板代码的工作量。

## 核心特性

### 1. 数据请求管理

- **自动数据加载**: 通过 `request` 函数自动处理数据请求
- **分页支持**: 内置分页处理，自动传递 `pageSize` 和 `current` 参数
- **loading 状态**: 自动管理加载状态
- **错误处理**: 内置错误边界和错误处理

### 2. 搜索表单

- **自动生成**: 根据 columns 配置自动生成搜索表单
- **多种布局**: 支持 `query` 和 `light` 两种搜索表单类型
- **表单联动**: 支持复杂的表单字段联动
- **自定义搜索**: 支持自定义搜索组件和逻辑

### 3. 列配置系统

- **valueType**: 20+ 种内置值类型（text, select, date, money 等）
- **列隐藏**: 支持在表格、表单、描述中分别控制列的显示
- **列设置**: 可视化的列显示/隐藏配置
- **列排序**: 支持拖拽排序列

### 4. 工具栏功能

- **标准操作**: 刷新、密度调整、全屏、列设置
- **自定义按钮**: 支持添加自定义操作按钮
- **搜索框**: 内置快速搜索功能
- **筛选器**: 支持轻量级筛选组件

### 5. 可编辑表格

- **行编辑**: 支持单行或多行编辑模式
- **字段验证**: 集成表单验证
- **自定义编辑**: 支持自定义编辑组件
- **编辑状态管理**: 完整的编辑状态控制

### 6. 批量操作

- **行选择**: 内置行选择功能
- **批量操作栏**: 显示选中项信息和批量操作按钮
- **选择状态管理**: 完整的选择状态控制

### 7. 高级功能

- **列状态持久化**: 记住用户的列配置
- **虚拟滚动**: 支持大数据量渲染
- **响应式**: 自适应不同屏幕尺寸
- **国际化**: 完整的多语言支持

## API 文档

### ProTable Props

#### 核心属性

```typescript
interface ProTableProps<T, U, ValueType> {
  // 数据请求
  request?: (
    params: U & {
      pageSize: number
      current: number
    },
    sort: Record<string, SortOrder>,
    filter: Record<string, (string | number)[] | null>
  ) => Promise<{
    data: T[]
    success?: boolean
    total?: number
  }>

  // 数据源
  dataSource?: T[]
  params?: Partial<U>

  // 列配置
  columns: ProTableColumns<T, ValueType>[]

  // 搜索表单
  search?: false | SearchConfig

  // 工具栏
  options?: OptionConfig
  toolbar?: ListToolBarProps
  toolBarRender?: (action: ActionType) => ReactNode[]

  // 行选择
  rowSelection?: TableRowSelection<T>

  // 可编辑
  editable?: TableRowEditable<T>

  // 引用
  actionRef?: MutableRefObject<ActionType>
  formRef?: MutableRefObject<FormInstance>
}
```

#### 列配置 (ProTableColumns)

```typescript
interface ProTableColumns<T, ValueType> extends ColumnType<T> {
  // 值类型
  valueType?: ValueType
  valueEnum?: Record<string, any>

  // 显示控制
  hideInTable?: boolean
  hideInForm?: boolean
  hideInSearch?: boolean
  hideInDescriptions?: boolean

  // 搜索相关
  search?:
    | false
    | {
        transform?: (value: any) => any
      }

  // 表单相关
  formItemProps?: FormItemProps
  fieldProps?: any
  formItemRender?: (item, config, form) => ReactNode

  // 渲染
  render?: (
    dom: ReactNode,
    entity: T,
    index: number,
    action: ActionType
  ) => ReactNode
  renderText?: (
    text: any,
    record: T,
    index: number,
    action: ActionType
  ) => string

  // 编辑
  editable?: false | ((text: any, record: T, index: number) => boolean)

  // 其他
  order?: number
  colSize?: number
  copyable?: boolean
  ellipsis?: boolean
  filters?: boolean | object[]
  onFilter?: (value: any, record: T) => boolean | false
}
```

### ValueType 类型

ProTable 支持以下内置 valueType：

- **文本类**: `text`, `textarea`, `jsonCode`, `code`
- **数字类**: `digit`, `money`, `percent`
- **选择类**: `select`, `checkbox`, `radio`, `radioButton`
- **日期类**: `date`, `dateWeek`, `dateMonth`, `dateQuarter`, `dateYear`, `dateRange`, `dateTime`, `dateTimeRange`, `time`, `timeRange`
- **其他**: `password`, `switch`, `rate`, `slider`, `color`, `image`, `avatar`, `cascader`, `treeSelect`

### ActionRef 方法

```typescript
interface ActionType {
  reload: (resetPageIndex?: boolean) => Promise<void>
  reloadAndRest: () => Promise<void>
  reset: () => void
  clearSelected?: () => void
  startEditable: (rowKey: Key) => boolean
  cancelEditable: (rowKey: Key) => boolean
  setPageInfo: (
    page: Partial<{
      pageSize: number
      current: number
      total: number
    }>
  ) => void
  fullScreen?: () => void
}
```

## 使用示例

### 基础用法

```tsx
import { ProTable } from '@ant-design/pro-components'

const columns = [
  {
    title: '姓名',
    dataIndex: 'name',
    valueType: 'text',
  },
  {
    title: '年龄',
    dataIndex: 'age',
    valueType: 'digit',
    hideInSearch: true,
  },
  {
    title: '状态',
    dataIndex: 'status',
    valueType: 'select',
    valueEnum: {
      all: { text: '全部', status: 'Default' },
      open: { text: '未解决', status: 'Error' },
      closed: { text: '已解决', status: 'Success' },
    },
  },
]

;<ProTable
  columns={columns}
  request={async (params, sort, filter) => {
    const { data } = await queryUsers(params)
    return {
      data,
      success: true,
      total: data.length,
    }
  }}
  rowKey="id"
  pagination={{
    showQuickJumper: true,
  }}
  search={{
    labelWidth: 'auto',
  }}
  options={{
    setting: {
      listsHeight: 400,
    },
  }}
  dateFormatter="string"
  headerTitle="用户列表"
/>
```

### 可编辑表格

```tsx
<ProTable
  columns={columns}
  editable={{
    type: 'multiple',
    editableKeys,
    onChange: setEditableRowKeys,
    onSave: async (rowKey, data, row) => {
      await waitTime(2000)
      console.log(rowKey, data, row)
    },
    actionRender: (row, config, dom) => [dom.save, dom.cancel],
  }}
/>
```

### 自定义工具栏

```tsx
<ProTable
  columns={columns}
  request={request}
  toolBarRender={() => [
    <Button key="button" icon={<PlusOutlined />} type="primary">
      新建
    </Button>,
    <Dropdown key="menu" overlay={menu}>
      <Button>
        更多操作 <DownOutlined />
      </Button>
    </Dropdown>,
  ]}
/>
```

## 最佳实践

### 1. 数据请求

- 使用 `request` 而不是 `dataSource` 来处理异步数据
- 在 `request` 中进行数据转换和错误处理
- 利用 `params` 传递额外参数

### 2. 搜索表单

- 合理设置 `hideInSearch` 控制搜索字段
- 使用 `search.transform` 进行数据转换
- 利用 `initialValue` 设置默认搜索值

### 3. 列配置

- 选择合适的 `valueType` 自动生成组件
- 使用 `valueEnum` 处理枚举数据
- 合理设置列的 `order` 控制搜索表单顺序

### 4. 性能优化

- 使用 `debounceTime` 控制搜索防抖
- 适当使用 `hideInTable` 减少渲染列
- 大数据量时启用虚拟滚动

### 5. 用户体验

- 提供有意义的 `headerTitle` 和 `tooltip`
- 使用 `options` 配置合适的工具栏功能
- 合理设置分页大小和快速跳转
