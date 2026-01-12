# TDesign Pro Components - AI 开发上下文文档

## 📋 项目概述

**项目名称**: tdesign-next-pro-components  
**项目目标**: 将 [Ant Design Pro Components](https://github.com/ant-design/pro-components) 迁移到基于 TDesign Vue Next 的 Vue 3 版本实现。

### 技术栈

- **框架**: Vue 3.x + TypeScript
- **UI 组件库**: TDesign Vue Next `^1.15.2`
- **图标库**: tdesign-icons-vue-next `^0.3.6`
- **构建工具**: Vite 8.x
- **包管理器**: pnpm
- **文档系统**: VitePress

---

## 🗂️ 项目目录结构

```
tdesign-pro-table/
├── raw/                           # Ant Design Pro Components 原始源码（参考用）
│   └── src/
│       ├── table/                 # ProTable 原始实现
│       ├── form/                  # ProForm 原始实现
│       ├── field/                 # ProField 原始实现
│       ├── card/                  # ProCard 原始实现（待迁移）
│       ├── descriptions/          # ProDescriptions 原始实现（待迁移）
│       ├── layout/                # ProLayout 原始实现（待迁移）
│       ├── list/                  # ProList 原始实现（待迁移）
│       ├── provider/              # Provider 原始实现（待迁移）
│       ├── skeleton/              # Skeleton 原始实现（待迁移）
│       └── utils/                 # 工具函数
│
├── src/
│   └── components/                # 已迁移的 Vue 3 组件
│       ├── table/                 # ✅ ProTable（部分完成）
│       ├── form/                  # ✅ ProForm（部分完成）
│       ├── field/                 # ✅ ProField（部分完成）
│       └── index.ts               # 组件导出入口
│
├── playground/                    # 开发测试环境
├── docs/                          # VitePress 文档
└── dist/                          # 构建产物
```

---

## 📦 已迁移组件状态

### 1. ProTable（表格组件）- `src/components/table/`

**主要功能状态**：

| 功能               | 状态        | 对应原始文件                              |
| ------------------ | ----------- | ----------------------------------------- |
| 基础表格渲染       | ✅ 已完成   | `raw/src/table/Table.tsx`                 |
| 数据请求 `request` | ✅ 已完成   | `raw/src/table/useFetchData.tsx`          |
| 分页功能           | ✅ 已完成   | -                                         |
| 排序/筛选          | ✅ 已完成   | -                                         |
| 搜索表单           | ⚠️ 部分完成 | `raw/src/table/components/Form/`          |
| 工具栏             | ⚠️ 部分完成 | `raw/src/table/components/ToolBar/`       |
| 列设置             | ⚠️ 部分完成 | `raw/src/table/components/ColumnSetting/` |
| Alert 选择提示     | ✅ 已完成   | `raw/src/table/components/Alert/`         |
| 可编辑表格         | ❌ 未实现   | `raw/src/table/components/EditableTable/` |
| 拖拽排序表格       | ❌ 未实现   | `raw/src/table/components/DragSortTable/` |
| ListToolBar        | ⚠️ 部分完成 | `raw/src/table/components/ListToolBar/`   |
| Dropdown           | ⚠️ 部分完成 | `raw/src/table/components/Dropdown/`      |

**已迁移的子组件** (`src/components/table/components/`)：

- `alert/` - 选择提示组件
- `column-setting/` - 列设置
- `density-icon/` - 密度图标
- `dropdown/` - 下拉操作
- `form/` - 搜索表单
- `fullscreen-icon/` - 全屏图标
- `header-menu/` - 头部菜单
- `list-toolbar/` - 列表工具栏
- `toolbar/` - 工具栏

**待迁移的子组件**：

- EditableTable（可编辑表格）
- DragSortTable（拖拽排序表格）

---

### 2. ProForm（表单组件）- `src/components/form/`

**主要功能状态**：

| 组件类型    | 状态        | 对应原始目录                          |
| ----------- | ----------- | ------------------------------------- |
| BaseForm    | ✅ 已完成   | `raw/src/form/BaseForm/`              |
| ProForm     | ✅ 已完成   | `raw/src/form/layouts/ProForm/`       |
| ModalForm   | ⚠️ 基本完成 | `raw/src/form/layouts/ModalForm/`     |
| DrawerForm  | ⚠️ 基本完成 | `raw/src/form/layouts/DrawerForm/`    |
| QueryFilter | ⚠️ 基本完成 | `raw/src/form/layouts/QueryFilter/`   |
| LightFilter | ⚠️ 基本完成 | `raw/src/form/layouts/LightFilter/`   |
| StepsForm   | ⚠️ 基本完成 | `raw/src/form/layouts/StepsForm/`     |
| SchemaForm  | ❌ 未实现   | `raw/src/form/components/SchemaForm/` |

**已迁移的表单控件** (`src/components/form/components/`)：

- ✅ ProFormText - 文本输入
- ✅ ProFormTextArea - 多行文本
- ✅ ProFormPassword - 密码输入
- ✅ ProFormDigit - 数字输入
- ✅ ProFormMoney - 金额输入
- ✅ ProFormSelect - 选择器
- ✅ ProFormTreeSelect - 树选择
- ✅ ProFormCascader - 级联选择
- ✅ ProFormCheckbox - 复选框
- ✅ ProFormRadio - 单选框
- ✅ ProFormSwitch - 开关
- ✅ ProFormSlider - 滑块
- ✅ ProFormRate - 评分
- ✅ ProFormDatePicker - 日期选择
- ✅ ProFormDateRangePicker - 日期范围
- ✅ ProFormTimePicker - 时间选择
- ✅ ProFormTimeRangePicker - 时间范围
- ✅ ProFormColorPicker - 颜色选择
- ✅ ProFormUploadButton - 上传按钮
- ✅ ProFormUploadDragger - 拖拽上传
- ✅ ProFormCaptcha - 验证码
- ✅ ProFormSegmented - 分段控制器
- ✅ ProFormField - 通用字段

**已迁移的布局组件**：

- ✅ ProFormGroup - 分组
- ✅ ProFormList - 动态列表
- ✅ ProFormFieldSet - 字段集
- ✅ ProFormDependency - 依赖组件

**待实现功能**：

- SchemaForm（JSON Schema 表单）
- DateTimePicker（日期时间选择器）
- DateTimeRangePicker（日期时间范围选择器）
- DigitRange（数字范围）

---

### 3. ProField（字段组件）- `src/components/field/`

**主要功能状态**：

| 功能            | 状态      | 说明                 |
| --------------- | --------- | -------------------- |
| ProField 主组件 | ✅ 已完成 | `component.tsx`      |
| ValueType 映射  | ✅ 已完成 | `value-type-map.tsx` |
| 读/编辑模式切换 | ✅ 已完成 | -                    |

**已迁移的 Field 组件** (`src/components/field/components/`)：

- ✅ FieldText - 文本
- ✅ FieldTextArea - 多行文本
- ✅ FieldPassword - 密码
- ✅ FieldDigit - 数字
- ✅ FieldDigitRange - 数字范围
- ✅ FieldMoney - 金额
- ✅ FieldPercent - 百分比
- ✅ FieldProgress - 进度条
- ✅ FieldSelect - 选择器
- ✅ FieldTreeSelect - 树选择
- ✅ FieldCascader - 级联
- ✅ FieldCheckbox - 复选框
- ✅ FieldRadio - 单选框
- ✅ FieldSwitch - 开关
- ✅ FieldSlider - 滑块
- ✅ FieldRate - 评分
- ✅ FieldDate - 日期
- ✅ FieldDateRange - 日期范围
- ✅ FieldTime - 时间
- ✅ FieldFromNow - 相对时间
- ✅ FieldSecond - 秒数
- ✅ FieldImage - 图片
- ✅ FieldCode - 代码
- ✅ FieldColorPicker - 颜色
- ✅ FieldStatus - 状态
- ✅ FieldOptions - 操作按钮
- ✅ FieldIndexColumn - 序号列
- ✅ FieldSegmented - 分段控制器

---

## 🔄 核心迁移模式

### React → Vue 3 转换规则

| React 概念            | Vue 3 实现                                  |
| --------------------- | ------------------------------------------- |
| `useState`            | `ref()` / `reactive()`                      |
| `useReducer`          | `ref()` + `computed`                        |
| `useEffect`           | `watchEffect()` / `watch()` / `onMounted()` |
| `useCallback`         | 普通函数（Vue 自动缓存）                    |
| `useMemo`             | `computed()`                                |
| `useRef`              | `ref()` / `shallowRef()`                    |
| `React.createContext` | `provide()` / `inject()`                    |
| `forwardRef`          | `defineExpose()`                            |
| `React.cloneElement`  | `cloneVNode()`                              |
| `children` prop       | `slots.default?.()`                         |
| `className`           | `class`                                     |
| `onChange`            | `onUpdate:modelValue` / `onChange`          |
| `key` in JSX          | `:key`                                      |

### Ant Design → TDesign 组件映射

| Ant Design 组件 | TDesign 组件                 |
| --------------- | ---------------------------- |
| `Table`         | `EnhancedTable` / `Table`    |
| `Form`          | `Form`                       |
| `Form.Item`     | `FormItem`                   |
| `Input`         | `Input`                      |
| `Select`        | `Select`                     |
| `DatePicker`    | `DatePicker`                 |
| `TimePicker`    | `TimePicker`                 |
| `TreeSelect`    | `TreeSelect`                 |
| `Cascader`      | `Cascader`                   |
| `Checkbox`      | `Checkbox` / `CheckboxGroup` |
| `Radio`         | `Radio` / `RadioGroup`       |
| `Switch`        | `Switch`                     |
| `Slider`        | `Slider`                     |
| `Rate`          | `Rate`                       |
| `Upload`        | `Upload`                     |
| `Button`        | `Button`                     |
| `Modal`         | `Dialog`                     |
| `Drawer`        | `Drawer`                     |
| `Tooltip`       | `Tooltip`                    |
| `Popover`       | `Popup`                      |
| `Card`          | `Card`                       |
| `Space`         | `Space`                      |
| `Divider`       | `Divider`                    |
| `Tag`           | `Tag`                        |
| `Badge`         | `Badge`                      |
| `message`       | `MessagePlugin`              |
| `notification`  | `NotifyPlugin`               |

### API 差异注意事项

1. **表单校验**

   - Ant Design: `form.validateFields()`
   - TDesign: `form.validate()`

2. **双向绑定**

   - Ant Design: `value` + `onChange`
   - TDesign: `v-model` / `modelValue` + `onUpdate:modelValue`

3. **插槽语法**

   - Ant Design React: `renderXxx` prop
   - TDesign Vue: `#slotName` / `slots.xxx`

4. **表格列配置**
   - Ant Design: `render: (text, record, index) => ...`
   - TDesign: `cell: ({ row, col, rowIndex }) => ...`

---

## 📁 关键文件说明

### 原始文件参考路径

```
raw/src/table/
├── Table.tsx              # ProTable 主组件（1000+ 行）
├── typing.ts              # 类型定义
├── useFetchData.tsx       # 数据请求 Hook
├── components/
│   ├── Alert/             # 选择提示
│   ├── ColumnSetting/     # 列设置
│   ├── DragSortTable/     # 拖拽排序
│   ├── Dropdown/          # 下拉操作
│   ├── EditableTable/     # 可编辑表格
│   ├── Form/              # 搜索表单
│   ├── ListToolBar/       # 列表工具栏
│   └── ToolBar/           # 工具栏
└── utils/                 # 工具函数

raw/src/form/
├── BaseForm/              # 基础表单
│   ├── BaseForm.tsx
│   ├── LightWrapper/
│   └── Submitter.tsx
├── components/            # 表单控件
├── layouts/               # 布局组件
│   ├── DrawerForm/
│   ├── LightFilter/
│   ├── ModalForm/
│   ├── ProForm/
│   ├── QueryFilter/
│   └── StepsForm/
├── FieldContext.tsx
└── typing.ts

raw/src/field/
├── AllProField.tsx        # 所有字段汇总
├── PureProField.tsx       # 纯字段组件
├── ValueTypeToComponent.tsx
├── components/            # 各类型字段
└── FieldHOC/              # 高阶组件
```

### 已迁移文件路径

```
src/components/table/
├── index.tsx              # ProTable 主组件
├── types.ts               # 类型定义
├── components/            # 子组件
├── hooks/                 # 组合函数
├── utils/                 # 工具函数
└── style/                 # 样式

src/components/form/
├── index.ts               # 导出入口
├── typing.ts              # 类型定义
├── FieldContext.ts        # 字段上下文
├── BaseForm/              # 基础表单
├── ProForm/               # ProForm
├── ModalForm/             # 弹窗表单
├── DrawerForm/            # 抽屉表单
├── QueryFilter/           # 查询筛选
├── LightFilter/           # 轻量筛选
├── StepsForm/             # 分步表单
├── components/            # 表单控件
├── utils/                 # 工具函数
└── helpers/               # 辅助函数

src/components/field/
├── index.ts               # 导出入口
├── types.ts               # 类型定义
├── component.tsx          # ProField 主组件
├── value-type-map.tsx     # ValueType 映射
├── components/            # 各字段组件
├── composables/           # Vue 组合函数
└── utils/                 # 工具函数
```

---

## ❌ 待迁移组件

以下组件尚未开始迁移：

| 组件             | 原始路径                                  | 优先级 |
| ---------------- | ----------------------------------------- | ------ |
| ProCard          | `raw/src/card/`                           | 中     |
| ProDescriptions  | `raw/src/descriptions/`                   | 中     |
| ProLayout        | `raw/src/layout/`                         | 高     |
| ProList          | `raw/src/list/`                           | 中     |
| ProProvider      | `raw/src/provider/`                       | 低     |
| ProSkeleton      | `raw/src/skeleton/`                       | 低     |
| EditableProTable | `raw/src/table/components/EditableTable/` | 高     |
| DragSortTable    | `raw/src/table/components/DragSortTable/` | 中     |
| SchemaForm       | `raw/src/form/components/SchemaForm/`     | 高     |

---

## 🛠️ 开发指南

### 运行项目

```bash
# 安装依赖
pnpm install

# 启动开发服务器（playground）
pnpm dev

# 启动文档服务器
pnpm dev:docs

# 构建库
pnpm build

# 类型检查
pnpm type-check

# 运行测试
pnpm test
```

### 迁移新组件的步骤

1. **分析原始组件**

   - 阅读 `raw/src/<component>/` 目录下的所有文件
   - 理解组件的 Props、State、事件和渲染逻辑

2. **创建 Vue 组件结构**

   - 在 `src/components/<component>/` 创建目录
   - 创建 `index.tsx`（主组件）、`types.ts`（类型）

3. **转换 React 语法到 Vue 3**

   - 使用 `defineComponent` + TSX
   - 使用 Composition API
   - 适配 TDesign 组件

4. **实现核心功能**

   - Props 定义
   - 状态管理
   - 事件处理
   - 插槽系统

5. **测试与文档**
   - 在 `playground/` 中测试
   - 在 `docs/` 中添加文档

### 代码风格

- 使用 TSX 语法编写组件
- 使用 Composition API
- 遵循 TDesign 的设计规范
- 保持与原 Ant Design Pro Components API 的兼容性

---

## 🔗 参考资源

- [Ant Design Pro Components 文档](https://procomponents.ant.design/)
- [Ant Design Pro Components GitHub](https://github.com/ant-design/pro-components)
- [TDesign Vue Next 文档](https://tdesign.tencent.com/vue-next/)
- [TDesign Vue Next GitHub](https://github.com/Tencent/tdesign-vue-next)
- [Vue 3 官方文档](https://vuejs.org/)

---

## 📝 更新日志

- **2024-01** - 项目初始化，完成 ProTable、ProForm、ProField 基础迁移
- 持续更新中...

---

## ⚠️ 注意事项

1. **保持 API 兼容性** - 尽量保持与 Ant Design Pro Components 相同的 API 设计
2. **TypeScript 优先** - 所有组件必须有完整的类型定义
3. **渐进式迁移** - 可以先实现核心功能，再逐步完善
4. **TDesign 适配** - 注意 TDesign 和 Ant Design 的 API 差异
5. **性能考虑** - Vue 3 的响应式系统与 React 不同，需要合理使用 `shallowRef` 等优化手段
