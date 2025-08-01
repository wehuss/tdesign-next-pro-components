# TDesign Pro Table 使用指南

## 快速开始

### 安装

```bash
npm install @tdesign/vue-next
npm install tdesign-icons-vue-next
```

### 基本使用

```tsx
import { defineComponent } from 'vue'
import ProTable from '@/components/table'
import type { ProColumn } from '@/components/table/types'

interface TableData {
  id: number
  name: string
  age: number
  status: string
}

export default defineComponent({
  setup() {
    const columns: ProColumn<TableData>[] = [
      {
        colKey: 'name',
        title: '姓名',
        valueType: 'text',
      },
      {
        colKey: 'age',
        title: '年龄',
        valueType: 'digit',
        hideInSearch: true,
      },
      {
        colKey: 'status',
        title: '状态',
        valueType: 'select',
        valueEnum: {
          active: { text: '激活', status: 'success' },
          inactive: { text: '禁用', status: 'error' },
        },
      },
    ]

    const request = async params => {
      const response = await api.getUsers(params)
      return {
        data: response.data,
        success: true,
        total: response.total,
      }
    }

    return () => (
      <ProTable
        columns={columns}
        request={request}
        headerTitle="用户列表"
        rowKey="id"
      />
    )
  },
})
```

## 特性

### 1. 自动数据加载

- 支持异步数据请求
- 自动分页处理
- 加载状态管理

### 2. 智能搜索表单

- 基于列配置自动生成
- 支持多种表单控件
- 响应式布局

### 3. 值类型系统

- 20+ 种内置值类型
- 自动渲染对应组件
- 支持枚举映射

### 4. 工具栏功能

- 刷新、设置等标准操作
- 支持自定义按钮
- 响应式设计

## API 文档

### ProTable Props

| 属性        | 说明         | 类型                               | 默认值 |
| ----------- | ------------ | ---------------------------------- | ------ |
| columns     | 列配置       | `ProColumn[]`                      | `[]`   |
| request     | 数据请求函数 | `(params) => Promise<RequestData>` | -      |
| dataSource  | 静态数据源   | `T[]`                              | -      |
| search      | 搜索表单配置 | `boolean \| SearchConfig`          | `true` |
| toolbar     | 工具栏配置   | `boolean \| ToolbarConfig`         | `true` |
| headerTitle | 表格标题     | `string`                           | -      |
| rowKey      | 行 key       | `string \| function`               | `'id'` |
| pagination  | 分页配置     | `boolean \| PaginationProps`       | `true` |

### ProColumn

| 属性         | 说明         | 类型                            | 默认值   |
| ------------ | ------------ | ------------------------------- | -------- |
| colKey       | 列标识       | `string`                        | -        |
| title        | 列标题       | `string`                        | -        |
| valueType    | 值类型       | `ValueType`                     | `'text'` |
| valueEnum    | 枚举映射     | `Record<string, ValueEnumItem>` | -        |
| hideInTable  | 在表格中隐藏 | `boolean`                       | `false`  |
| hideInSearch | 在搜索中隐藏 | `boolean`                       | `false`  |
| render       | 自定义渲染   | `(context) => VNode`            | -        |

### ValueType 类型

- `text` - 文本输入
- `textarea` - 多行文本
- `select` - 下拉选择
- `date` - 日期选择
- `dateRange` - 日期范围
- `digit` - 数字输入
- `switch` - 开关
- `radio` - 单选
- `checkbox` - 多选

## 高级用法

### 自定义工具栏

```tsx
const toolbarRender = (actionRef) => [
  <Button theme="primary" onClick={() => handleAdd()}>
    新建
  </Button>,
  <Button onClick={() => actionRef.reload()}>
    刷新
  </Button>,
]

<ProTable
  columns={columns}
  request={request}
  toolbarRender={toolbarRender}
/>
```

### 自定义渲染

```tsx
const columns = [
  {
    colKey: 'actions',
    title: '操作',
    render: ({ record }) => (
      <Space>
        <Button size="small" onClick={() => handleEdit(record)}>
          编辑
        </Button>
        <Button
          size="small"
          theme="danger"
          onClick={() => handleDelete(record)}
        >
          删除
        </Button>
      </Space>
    ),
  },
]
```

### 搜索表单配置

```tsx
const searchConfig = {
  labelWidth: 'auto',
  collapsed: true,
  searchText: '查询',
  resetText: '重置',
}

<ProTable
  columns={columns}
  request={request}
  search={searchConfig}
/>
```

## 样式定制

ProTable 使用 TDesign 设计令牌，支持主题定制：

```less
.t-pro-table {
  .t-pro-table-toolbar-title {
    font-size: 18px;
    font-weight: 600;
  }

  .t-pro-table-search-form {
    padding: 20px;
    background: var(--td-bg-color-container);
  }
}
```

## 注意事项

1. **TypeScript 支持**：组件完全使用 TypeScript 编写，提供完整的类型提示
2. **Vue 3 兼容**：基于 Vue 3 Composition API 开发
3. **TDesign 依赖**：需要安装 TDesign Vue Next 作为基础组件库
4. **响应式设计**：自动适配移动端和桌面端
5. **性能优化**：使用 Vue 3 的响应式系统，性能优异

## 更新计划

- [ ] 可编辑表格支持
- [ ] 虚拟滚动
- [ ] 更多 ValueType
- [ ] 拖拽排序
- [ ] 导入导出功能
- [ ] 表格状态持久化

## 贡献指南

欢迎提交 Issue 和 Pull Request 来帮助改进 TDesign Pro Table！
