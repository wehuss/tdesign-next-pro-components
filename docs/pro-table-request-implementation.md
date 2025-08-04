# ProTable 数据请求功能实现

## 功能概述

我已经完成了 ProTable 的数据请求相关逻辑实现，参考了 ant-design/pro-components 的设计理念，为 TDesign Vue Next 生态系统提供了企业级表格解决方案。

## 核心功能

### 1. 数据请求管理

- **自动数据加载**: 通过 `request` 函数自动处理数据请求
- **分页支持**: 内置分页处理，自动传递 `pageSize` 和 `current` 参数
- **loading 状态**: 自动管理加载状态
- **错误处理**: 内置错误边界和错误处理
- **请求取消**: 支持 AbortController 取消请求
- **轮询支持**: 支持定时轮询数据

### 2. 高级功能

- **防抖处理**: 搜索参数变化时的防抖处理
- **数据后处理**: 支持 `postData` 函数对返回数据进行处理
- **排序和筛选**: 支持排序和筛选参数传递
- **手动请求**: 支持手动控制请求时机
- **请求参数合并**: 自动合并 props.params 和搜索参数

## 核心 Hook: useProTable

```typescript
export function useProTable<T extends TableRowData = TableRowData>(
  props: ProTableProps<T>
) {
  // 数据状态管理
  const tableData = ref<T[]>([])
  const tableLoading = ref(false)
  const searchParams = ref<Record<string, unknown>>({})
  const pageInfo = ref<PaginationParams>({...})

  // 排序和筛选状态
  const sortInfo = ref<SortInfo>({})
  const filterInfo = ref<FilterInfo>({})

  // 请求控制
  const abortController = ref<AbortController | null>(null)
  const pollingTimer = ref<ReturnType<typeof setTimeout> | null>(null)

  // 核心方法
  const fetchData = async (params, sort, filter, options) => {
    // 实现数据请求逻辑
  }

  const reload = async (resetPageIndex?) => {
    // 刷新数据
  }

  const reloadAndReset = async () => {
    // 重置并刷新
  }

  // 返回表格所需的状态和方法
  return {
    tableData,
    tableColumns,
    tableLoading,
    // ... 其他状态和方法
  }
}
```

## 接口设计

### RequestData 接口

```typescript
interface RequestData<T = Record<string, unknown>> {
  data: T[]
  success?: boolean
  total?: number
  errorMessage?: string
  [key: string]: unknown
}
```

### ProTableProps 接口

```typescript
interface ProTableProps<T extends TableRowData = TableRowData> {
  // 数据请求
  request?: (
    params: T & RequestParams,
    sort?: SortInfo,
    filter?: FilterInfo
  ) => Promise<RequestData<T>>

  // 数据处理
  postData?: (data: T[]) => T[]
  defaultData?: T[]

  // 回调函数
  onLoad?: (dataSource: T[], extra: unknown) => void
  onRequestError?: (error: Error) => void
  onDataSourceChange?: (dataSource: T[]) => void

  // 请求控制
  manual?: boolean
  manualRequest?: boolean
  debounceTime?: number
  polling?: number | boolean
  revalidateOnFocus?: boolean

  // 其他配置...
}
```

## 使用示例

```typescript
// 基本使用
<ProTable
  rowKey="id"
  columns={columns}
  request={async (params, sort, filter) => {
    const response = await api.getUserList({
      ...params,
      sortBy: sort,
      filterBy: filter,
    })
    return {
      data: response.data,
      success: true,
      total: response.total,
    }
  }}
  pagination={{
    defaultPageSize: 20,
    showJumper: true,
    pageSizeOptions: [10, 20, 50, 100],
  }}
  onLoad={(dataSource, extra) => {
    console.log('数据加载完成:', dataSource)
  }}
  onRequestError={(error) => {
    console.error('请求失败:', error)
  }}
  postData={(data) => {
    // 数据后处理
    return data.map(item => ({
      ...item,
      displayName: `${item.firstName} ${item.lastName}`
    }))
  }}
/>
```

## 高级特性

### 1. 轮询请求

```typescript
<ProTable
  request={fetchData}
  polling={3000} // 每3秒轮询一次
  // 或者
  polling={true} // 使用默认的2秒轮询
/>
```

### 2. 手动控制

```typescript
const actionRef = ref()

// 刷新数据
actionRef.value?.reload()

// 重置并刷新
actionRef.value?.reloadAndReset()

// 设置分页信息
actionRef.value?.setPageInfo({ current: 1, pageSize: 20 })
```

### 3. 请求参数合并

```typescript
<ProTable
  request={fetchData}
  params={{
    // 这些参数会自动合并到每次请求中
    departmentId: currentDepartment.id,
    status: 'active',
  }}
/>
```

### 4. 防抖搜索

```typescript
<ProTable
  request={fetchData}
  debounceTime={500} // 搜索参数变化后500ms再请求
/>
```

## 实现亮点

1. **完整的生命周期管理**: 从请求发起到数据展示的完整流程控制
2. **错误处理机制**: 完善的错误边界和用户友好的错误提示
3. **性能优化**: 防抖处理、请求取消、轮询控制
4. **类型安全**: 完整的 TypeScript 类型定义
5. **扩展性**: 支持自定义数据处理和回调函数
6. **兼容性**: 与 TDesign Vue Next 完美集成

## 下一步规划

1. 实现搜索表单自动生成功能
2. 添加列设置和状态持久化
3. 实现可编辑表格功能
4. 添加批量操作支持
5. 完善工具栏功能

这个实现为 TDesign Pro Table 提供了强大的数据请求基础，支持企业级应用的各种需求场景。
