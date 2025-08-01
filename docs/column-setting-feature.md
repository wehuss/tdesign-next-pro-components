# TDesign Pro Table 列配置功能

## 功能介绍

TDesign Pro Table 集成了 TDesign Table 的列配置功能，允许用户动态控制表格列的显示/隐藏。

## 实现原理

### 1. TDesign Table 原生支持

TDesign Table 组件原生提供了 `columnControllerVisible` 属性来控制列配置弹窗的显示：

```tsx
<Table
  columns={columns}
  data={data}
  columnControllerVisible={visible}
  // 其他属性...
/>
```

### 2. ProTable 集成

在 ProTable 中，我们通过以下方式集成了这个功能：

#### 2.1 主组件集成

```tsx
// src/components/table/index.tsx
const ProTable = defineComponent({
  props: {
    // ... 其他属性
    columnControllerVisible: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const columnControllerVisible = ref(props.columnControllerVisible)

    const handleColumnControllerVisibleChange = (visible: boolean) => {
      columnControllerVisible.value = visible
    }

    return () => {
      // 表格节点
      const tableNode = (
        <Table
          // ... 其他属性
          columnControllerVisible={columnControllerVisible.value}
        />
      )
    }
  },
})
```

#### 2.2 工具栏集成

```tsx
// src/components/table/components/toolbar/index.tsx
export default defineComponent({
  props: {
    // ... 其他属性
    onColumnControllerVisibleChange: Function as PropType<
      (visible: boolean) => void
    >,
  },
  setup(props) {
    const handleColumnSetting = () => {
      const newVisible = !columnControllerVisible.value
      columnControllerVisible.value = newVisible
      props.onColumnControllerVisibleChange?.(newVisible)
    }

    return () => (
      <Tooltip content="列设置" key="setting">
        <Button
          variant="text"
          shape="square"
          icon={() => <SettingIcon />}
          onClick={handleColumnSetting}
        />
      </Tooltip>
    )
  },
})
```

## 使用方法

### 基础使用

```tsx
import ProTable from '@/components/table'

const Demo = () => {
  const columns = [
    { colKey: 'id', title: 'ID', width: 80 },
    { colKey: 'name', title: '姓名', width: 120 },
    { colKey: 'age', title: '年龄', width: 100 },
    { colKey: 'email', title: '邮箱', width: 200 },
  ]

  return (
    <ProTable
      columns={columns}
      request={fetchData}
      headerTitle="用户列表"
      // 工具栏会自动显示列设置按钮
    />
  )
}
```

### 控制初始状态

```tsx
<ProTable
  columns={columns}
  request={fetchData}
  columnControllerVisible={true} // 初始显示列配置弹窗
/>
```

## 功能特性

### 1. 🎯 一键控制

- 点击工具栏的设置按钮即可打开/关闭列配置弹窗
- 无需额外配置，开箱即用

### 2. 🔧 灵活配置

- 支持列的显示/隐藏控制
- 支持列的拖拽排序（TDesign 原生功能）
- 配置实时生效

### 3. 🎨 界面友好

- 使用 TDesign 原生的列配置 UI
- 与 ProTable 整体设计风格一致
- 响应式设计，适配各种屏幕尺寸

### 4. 📱 交互优化

- 点击设置按钮切换弹窗显示状态
- 支持键盘快捷键操作
- 良好的用户体验

## API 参考

### ProTable Props

| 属性                    | 说明               | 类型      | 默认值  |
| ----------------------- | ------------------ | --------- | ------- |
| columnControllerVisible | 控制列配置弹窗显示 | `boolean` | `false` |

### TableToolBar Props

| 属性                            | 说明                   | 类型                         | 默认值 |
| ------------------------------- | ---------------------- | ---------------------------- | ------ |
| onColumnControllerVisibleChange | 列配置显示状态变化回调 | `(visible: boolean) => void` | -      |

## 示例代码

### 完整示例

```tsx
import { defineComponent } from 'vue'
import { Button, MessagePlugin } from 'tdesign-vue-next'
import ProTable from '@/components/table'

export default defineComponent({
  name: 'ColumnSettingDemo',
  setup() {
    const columns = [
      { colKey: 'id', title: 'ID', width: 80 },
      { colKey: 'name', title: '姓名', width: 120 },
      { colKey: 'age', title: '年龄', width: 100 },
      { colKey: 'email', title: '邮箱', width: 200 },
      { colKey: 'status', title: '状态', width: 100 },
      { colKey: 'department', title: '部门', width: 120 },
      { colKey: 'createTime', title: '创建时间', width: 150 },
    ]

    const request = async () => {
      // 模拟 API 请求
      const mockData = [
        {
          id: 1,
          name: '张三',
          age: 28,
          email: 'zhangsan@example.com',
          status: '在职',
          department: '技术部',
          createTime: '2024-01-01',
        },
        // ... 更多数据
      ]

      return {
        data: mockData,
        success: true,
        total: mockData.length,
      }
    }

    const toolbarRender = () => [
      <Button theme="primary">新建</Button>,
      <Button>导出</Button>,
    ]

    return () => (
      <ProTable
        columns={columns}
        request={request}
        headerTitle="员工管理"
        toolbarRender={toolbarRender}
        rowKey="id"
      />
    )
  },
})
```

## 技术实现细节

### 1. 状态管理

```tsx
// 使用 ref 管理列配置显示状态
const columnControllerVisible = ref(props.columnControllerVisible)

// 响应式更新
const handleColumnControllerVisibleChange = (visible: boolean) => {
  columnControllerVisible.value = visible
}
```

### 2. 事件传递

```tsx
// 工具栏 -> 主组件的事件传递
;<TableToolBar
  onColumnControllerVisibleChange={handleColumnControllerVisibleChange}
/>

// 工具栏内部的点击处理
const handleColumnSetting = () => {
  const newVisible = !columnControllerVisible.value
  props.onColumnControllerVisibleChange?.(newVisible)
}
```

### 3. TDesign 集成

```tsx
// 直接传递给 TDesign Table 组件
<Table
  columnControllerVisible={columnControllerVisible.value}
  // 其他属性...
/>
```

## 注意事项

1. **依赖版本**: 确保使用的 TDesign Vue Next 版本支持 `columnControllerVisible` 属性
2. **列配置**: 列必须设置 `colKey` 属性才能被列配置功能识别
3. **性能优化**: 大量列的情况下，建议使用虚拟滚动等优化方案
4. **兼容性**: 功能基于 TDesign 原生实现，继承其浏览器兼容性

## 后续优化

- [ ] 支持列配置状态持久化
- [ ] 添加列配置预设功能
- [ ] 支持更多列操作（宽度调整等）
- [ ] 提供列配置变化的回调事件
