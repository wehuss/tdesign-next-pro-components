# Implementation Plan

## Phase 1: ProField 组件完善 (P0 - 核心)

- [x] 1. 完善 ProField 核心组件
  - [x] 1.1 添加 Cascader 级联选择组件
    - 创建 `src/components/field/components/cascader/index.tsx`
    - 参考 `raw/src/field/components/Cascader/`
    - 支持 read/edit 模式
    - _Requirements: 1.18_

  - [x] 1.2 添加 TreeSelect 树选择组件
    - 创建 `src/components/field/components/tree-select/index.tsx`
    - 参考 `raw/src/field/components/TreeSelect/`
    - 支持 read/edit 模式
    - _Requirements: 1.19_

  - [x] 1.3 添加 Code 代码展示组件
    - 创建 `src/components/field/components/code/index.tsx`
    - 参考 `raw/src/field/components/Code/`
    - 支持 JSON 代码高亮
    - _Requirements: 1.20_

  - [x] 1.4 添加 ColorPicker 颜色选择组件
    - 创建 `src/components/field/components/color-picker/index.tsx`
    - 参考 `raw/src/field/components/ColorPicker/`

    - _Requirements: 1.21_

  - [x] 1.5 添加 DigitRange 数字范围组件
    - 创建 `src/components/field/components/digit-range/index.tsx`
    - 参考 `raw/src/field/components/DigitRange/`
    - _Requirements: 1.22_

  - [x] 1.6 添加 FromNow 相对时间组件
    - 创建 `src/components/field/components/from-now/index.tsx`
    - 参考 `raw/src/field/components/FromNow/`
    - _Requirements: 1.23_

  - [x] 1.7 添加 Image 图片展示组件
    - 创建 `src/components/field/components/image/index.tsx`
    - 参考 `raw/src/field/components/Image/`

    - _Requirements: 1.24_

  - [x] 1.8 添加 IndexColumn 序号列组件
    - 创建 `src/components/field/components/index-column/index.tsx`
    - 参考 `raw/src/field/components/IndexColumn/`
    - _Requirements: 1.25_

  - [x] 1.9 添加 Progress 进度条组件
    - 创建 `src/components/field/components/progress/index.tsx`
    - 参考 `raw/src/field/components/Progress/`
    - _Requirements: 1.26_

  - [x] 1.10 添加 Second 秒数展示组件
    - 创建 `src/components/field/components/second/index.tsx`
    - 参考 `raw/src/field/components/Second/`
    - _Requirements: 1.27_

  - [ ] 1.11 添加 Segmented 分段控制器组件
    - 创建 `src/components/field/components/segmented/index.tsx`
    - 参考 `raw/src/field/components/Segmented/`
    - _Requirements: 1.28_
  - [x] 1.12 添加 Options 操作项组件
    - 创建 `src/components/field/components/options/index.tsx`
    - 参考 `raw/src/field/components/Options/`
    - _Requirements: 1.29_

  - [x] 1.13 更新 value-type-map.tsx 注册新组件
    - 在 valueTypeMap 中注册所有新增的 valueType 组件
    - _Requirements: 1.1-1.29_

  - [ ]\* 1.14 编写 ProField 属性测试
    - **Property 1: ValueType Rendering Consistency**
    - **Validates: Requirements 1.1-1.17**
  - [ ]\* 1.15 编写 ProField 模式切换属性测试
    - **Property 2: Mode Switching Preservation**
    - **Validates: Requirements 1.16, 1.17**

- [ ] 2. Checkpoint - 确保 ProField 所有测试通过
  - Ensure all tests pass, ask the user if questions arise.

## Phase 2: ProForm 基础组件完善 (P0 - 核心)

- [x] 3. 完善 BaseForm 核心组件
  - [x] 3.1 完善 Submitter 组件
    - 检查并完善 `src/components/form/BaseForm/Submitter/index.tsx`
    - 添加 render 自定义渲染支持
    - 添加 searchConfig 配置支持
    - 参考 `raw/src/form/BaseForm/Submitter/`
    - _Requirements: 2.2_

  - [x] 3.2 创建 LightWrapper 组件
    - 创建 `src/components/form/BaseForm/LightWrapper/index.tsx`
    - 参考 `raw/src/form/BaseForm/LightWrapper/`
    - 实现轻量级表单项包装功能
    - _Requirements: 2.3_

  - [x] 3.3 完善 EditOrReadOnlyContext
    - 检查并完善 `src/components/form/BaseForm/EditOrReadOnlyContext.ts`
    - 确保 provide/inject 正确工作
    - _Requirements: 2.4_

  - [x] 3.4 完善 FieldContext
    - 检查并完善 `src/components/form/FieldContext.ts`
    - 添加缺失的上下文属性
    - _Requirements: 2.5_

  - [ ]\* 3.5 编写 BaseForm 属性测试
    - **Property 3: Form Value Binding**
    - **Validates: Requirements 3.1-3.18**

- [x] 4. 完善 ProForm 表单项组件
  - [x] 4.1 审查并完善现有表单项组件
    - 审查 `src/components/form/components/` 下所有组件
    - 确保与 BaseForm 正确集成
    - 确保 valueType 和 valueEnum 支持
    - _Requirements: 3.1-3.18_

  - [x] 4.2 创建 ProFormCaptcha 组件
    - 创建 `src/components/form/components/Captcha/index.tsx`
    - 参考 `raw/src/form/components/Captcha/`
    - 实现验证码输入和倒计时功能
    - _Requirements: 3.19_

  - [x] 4.3 创建 ProFormSegmented 组件
    - 创建 `src/components/form/components/Segmented/index.tsx`
    - 参考 `raw/src/form/components/Segmented/`
    - _Requirements: 3.20_

  - [x] 4.4 创建 ProFormField 通用组件
    - 创建 `src/components/form/components/Field/index.tsx`
    - 参考 `raw/src/form/components/Field/`
    - 实现通用字段包装器
    - _Requirements: 3.21_

- [x] 5. 完善 ProForm 高级组件
  - [x] 5.1 完善 ProFormGroup 组件
    - 检查 `src/components/form/components/Group/`
    - 确保分组标题和布局正确
    - _Requirements: 4.1_

  - [x] 5.2 完善 ProFormList 组件
    - 检查 `src/components/form/components/List/`
    - 确保动态增删功能正常
    - 参考 `raw/src/form/components/List/`
    - _Requirements: 4.2_

  - [x] 5.3 完善 ProFormFieldSet 组件
    - 检查 `src/components/form/components/FieldSet/`
    - 参考 `raw/src/form/components/FieldSet/`
    - _Requirements: 4.3_

  - [x] 5.4 完善 ProFormDependency 组件
    - 检查 `src/components/form/components/Dependency/`
    - 确保字段依赖逻辑正确
    - 参考 `raw/src/form/components/Dependency/`
    - _Requirements: 4.4_

  - [x] 5.5 完善 ProFormItem 组件
    - 检查 `src/components/form/components/FormItem/`
    - 参考 `raw/src/form/components/FormItem/`
    - _Requirements: 4.5_

  - [ ]\* 5.6 编写 ProFormList 属性测试
    - **Property 4: Form List Operations**
    - **Validates: Requirements 4.2**

- [x] 6. Checkpoint - 确保 ProForm 基础组件测试通过
  - Ensure all tests pass, ask the user if questions arise.

## Phase 3: ProForm 布局组件完善 (P1 - 重要)

- [x] 7. 完善现有布局组件
  - [x] 7.1 完善 ProForm 标准布局
    - 检查 `src/components/form/ProForm/`
    - 参考 `raw/src/form/layouts/ProForm/`
    - _Requirements: 5.1_

  - [x] 7.2 完善 ModalForm 组件
    - 检查 `src/components/form/ModalForm/`
    - 参考 `raw/src/form/layouts/ModalForm/`
    - _Requirements: 5.2_

  - [x] 7.3 完善 DrawerForm 组件
    - 检查 `src/components/form/DrawerForm/`
    - 参考 `raw/src/form/layouts/DrawerForm/`
    - _Requirements: 5.3_

  - [x] 7.4 完善 QueryFilter 组件
    - 检查 `src/components/form/QueryFilter/`
    - 参考 `raw/src/form/layouts/QueryFilter/`
    - _Requirements: 5.4_

  - [x] 7.5 完善 LightFilter 组件
    - 检查 `src/components/form/LightFilter/`
    - 参考 `raw/src/form/layouts/LightFilter/`
    - _Requirements: 5.5_

  - [x] 7.6 完善 StepsForm 组件
    - 检查 `src/components/form/StepsForm/`
    - 参考 `raw/src/form/layouts/StepsForm/`
    - _Requirements: 5.6_

- [ ] 8. 创建缺失的布局组件
  - [ ] 8.1 创建 LoginForm 组件
    - 创建 `src/components/form/layouts/LoginForm/index.tsx`
    - 参考 `raw/src/form/layouts/LoginForm/`
    - 实现登录表单布局
    - _Requirements: 5.7_
  - [ ] 8.2 创建 LoginFormPage 组件
    - 创建 `src/components/form/layouts/LoginFormPage/index.tsx`
    - 参考 `raw/src/form/layouts/LoginFormPage/`
    - 实现全页登录布局
    - _Requirements: 5.8_
  - [ ] 8.3 创建 SchemaForm 组件
    - 创建 `src/components/form/layouts/SchemaForm/index.tsx`
    - 参考 `raw/src/form/components/SchemaForm/`
    - 实现 JSON Schema 驱动表单
    - _Requirements: 5.9_

- [ ] 9. Checkpoint - 确保 ProForm 布局组件测试通过
  - Ensure all tests pass, ask the user if questions arise.

## Phase 4: ProTable 核心功能重构 (P0 - 核心)

- [-] 10. 重构 ProTable 核心
  - [x] 10.1 重构 ProTable 主组件
    - 重构 `src/components/table/index.tsx`
    - 参考 `raw/src/table/Table.tsx`
    - 实现 request 数据请求
    - 实现 columns 配置解析
    - 需要保留ProCloumns的form属性
    - _Requirements: 6.1, 6.2_

  - [x] 10.2 实现 useFetchData Hook
    - 创建 `src/components/table/hooks/useFetchData.ts`
    - 参考 `raw/src/table/useFetchData.tsx`
    - 实现分页、排序、筛选请求
    - _Requirements: 6.1, 6.5_

  - [x] 10.3 实现 ActionRef 功能
    - 完善 actionRef 暴露的方法
    - 实现 reload、reset、setPageInfo 等
    - _Requirements: 6.7_

  - [x] 10.4 实现 Polling 轮询功能
    - 添加 polling 属性支持
    - 实现定时刷新数据
    - _Requirements: 6.8_

  - [ ]\* 10.5 编写 ProTable 请求分页属性测试
    - **Property 5: Table Request Pagination**
    - **Validates: Requirements 6.1, 6.5**
  - [ ]\* 10.6 编写 ProTable ActionRef 属性测试
    - **Property 7: Table Action Ref Methods**
    - **Validates: Requirements 6.7**

- [x] 11. 完善 ProTable 工具函数
  - [x] 11.1 完善 genProColumnToColumn
    - 检查 `src/components/table/utils/`
    - 参考 `raw/src/table/utils/genProColumnToColumn.tsx`
    - _Requirements: 9.1_

  - [x] 11.2 完善 columnRender
    - 参考 `raw/src/table/utils/columnRender.tsx`
    - 实现 valueType 渲染
    - _Requirements: 9.2_

  - [x] 11.3 完善 columnSort
    - 参考 `raw/src/table/utils/columnSort.ts`
    - _Requirements: 9.3_

  - [x] 11.4 完善 cellRenderToFormItem
    - 参考 `raw/src/table/utils/cellRenderToFromItem.tsx`
    - _Requirements: 9.4_

  - [ ]\* 11.5 编写列转换属性测试
    - **Property 8: Column Transformation**
    - **Validates: Requirements 9.1**
  - [ ]\* 11.6 编写列 ValueType 渲染属性测试
    - **Property 6: Column ValueType Rendering**
    - **Validates: Requirements 6.2, 9.2**

- [ ] 12. Checkpoint - 确保 ProTable 核心功能测试通过
  - Ensure all tests pass, ask the user if questions arise.

## Phase 5: ProTable 子组件完善 (P1 - 重要)

- [x] 13. 完善现有子组件
  - [x] 13.1 完善 TableAlert 组件
    - 检查 `src/components/table/components/alert/`
    - 参考 `raw/src/table/components/Alert/`
    - _Requirements: 7.1_

  - [x] 13.2 完善 TableToolbar 组件
    - 检查 `src/components/table/components/toolbar/`
    - 参考 `raw/src/table/components/ToolBar/`
    - _Requirements: 7.2_

- [-] 14. 创建缺失的子组件
  - [x] 14.1 创建 ColumnSetting 列设置组件
    - 创建 `src/components/table/components/column-setting/index.tsx`
    - 参考 `raw/src/table/components/ColumnSetting/`
    - 实现列显示/隐藏控制
    - _Requirements: 7.3_

  - [x] 14.2 创建 DensityIcon 密度切换组件
    - 创建 `src/components/table/components/density-icon/index.tsx`
    - 参考 `raw/src/table/components/ToolBar/DensityIcon.tsx`
    - _Requirements: 7.4_

  - [x] 14.3 创建 FullscreenIcon 全屏切换组件
    - 创建 `src/components/table/components/fullscreen-icon/index.tsx`
    - 参考 `raw/src/table/components/ToolBar/FullscreenIcon.tsx`
    - _Requirements: 7.5_

  - [-] 14.4 创建 ListToolBar 列表工具栏组件
    - 创建 `src/components/table/components/list-toolbar/index.tsx`

    - 参考 `raw/src/table/components/ListToolBar/`
    - _Requirements: 7.6_

  - [x] 14.5 创建 HeaderMenu 头部菜单组件
    - 创建 `src/components/table/components/header-menu/index.tsx`
    - 参考 `raw/src/table/components/ListToolBar/HeaderMenu.tsx`
    - _Requirements: 7.7_

  - [x] 14.6 创建 FormRender 搜索表单组件
    - 创建 `src/components/table/components/form/index.tsx`
    - 参考 `raw/src/table/components/Form/`
    - _Requirements: 7.8_

  - [ ] 14.7 创建 Dropdown 操作下拉组件
    - 创建 `src/components/table/components/dropdown/index.tsx`
    - 参考 `raw/src/table/components/Dropdown/`
    - _Requirements: 7.9_

- [ ] 15. Checkpoint - 确保 ProTable 子组件测试通过
  - Ensure all tests pass, ask the user if questions arise.

## Phase 6: ProTable 高级功能 (P1 - 重要)

- [ ] 16. 创建可编辑表格组件
  - [ ] 16.1 创建 EditableTable 组件
    - 创建 `src/components/table/components/editable/EditableTable.tsx`
    - 参考 `raw/src/table/components/EditableTable/`
    - 实现行内编辑功能
    - _Requirements: 8.1_
  - [ ] 16.2 创建 CellEditorTable 组件
    - 创建 `src/components/table/components/editable/CellEditorTable.tsx`
    - 参考 `raw/src/table/components/EditableTable/`
    - 实现单元格编辑功能
    - _Requirements: 8.2_
  - [ ] 16.3 创建 RowEditorTable 组件
    - 创建 `src/components/table/components/editable/RowEditorTable.tsx`
    - 参考 `raw/src/table/components/EditableTable/`
    - 实现整行编辑功能
    - _Requirements: 8.3_
  - [ ]\* 16.4 编写可编辑表格属性测试
    - **Property 10: Editable Table State**
    - **Validates: Requirements 8.1-8.3**

- [ ] 17. 创建拖拽排序表格
  - [ ] 17.1 创建 DragSortTable 组件
    - 创建 `src/components/table/components/drag-sort/index.tsx`
    - 参考 `raw/src/table/components/DragSortTable/`
    - 实现拖拽排序功能
    - _Requirements: 8.4_
  - [ ] 17.2 实现 useDragSort Hook
    - 创建 `src/components/table/hooks/useDragSort.ts`
    - 参考 `raw/src/table/utils/useDragSort.tsx`
    - _Requirements: 8.4_

- [ ] 18. 创建 Table Store 状态管理
  - [ ] 18.1 创建 Table Store Provider
    - 创建 `src/components/table/store/index.ts`
    - 参考 `raw/src/table/Store/Provide.tsx`
    - 实现表格状态共享
    - _Requirements: 6.1-6.8_

- [ ] 19. Checkpoint - 确保 ProTable 高级功能测试通过
  - Ensure all tests pass, ask the user if questions arise.

## Phase 7: ProProvider 全局配置 (P2 - 增强)

- [ ] 20. 创建 ProProvider 组件
  - [ ] 20.1 创建 ProConfigProvider 组件
    - 创建 `src/components/provider/index.tsx`
    - 参考 `raw/src/provider/index.tsx`
    - 实现全局配置上下文
    - _Requirements: 10.1_
  - [ ] 20.2 创建国际化模块
    - 创建 `src/components/provider/locale/` 目录
    - 参考 `raw/src/provider/locale/`
    - 实现 zh_CN、en_US 等语言包
    - _Requirements: 10.2_
  - [ ] 20.3 创建 useIntl Hook
    - 创建 `src/components/provider/intl.ts`
    - 参考 `raw/src/provider/intl.ts`
    - _Requirements: 10.3_
  - [ ] 20.4 创建主题配置
    - 创建 `src/components/provider/useStyle/`
    - 参考 `raw/src/provider/useStyle/`
    - _Requirements: 10.4_

- [ ] 21. Checkpoint - 确保 ProProvider 测试通过
  - Ensure all tests pass, ask the user if questions arise.

## Phase 8: 工具函数库迁移 (P2 - 增强)

- [ ] 22. 迁移核心工具函数
  - [ ] 22.1 创建 omitUndefined 函数
    - 创建 `src/utils/omitUndefined/index.ts`
    - 参考 `raw/src/utils/omitUndefined/`
    - _Requirements: 11.1_
  - [ ] 22.2 创建 omitBoolean 函数
    - 创建 `src/utils/omitBoolean/index.ts`
    - 参考 `raw/src/utils/omitBoolean/`
    - _Requirements: 11.2_
  - [ ] 22.3 创建 stringify 函数
    - 创建 `src/utils/stringify/index.ts`
    - 参考 `raw/src/utils/stringify/`
    - _Requirements: 11.3_
  - [ ] 22.4 创建 nanoid 函数
    - 创建 `src/utils/nanoid/index.ts`
    - 参考 `raw/src/utils/nanoid/`
    - _Requirements: 11.4_
  - [ ] 22.5 创建 isNil 函数
    - 创建 `src/utils/isNil/index.ts`
    - 参考 `raw/src/utils/isNil/`
    - _Requirements: 11.5_
  - [ ] 22.6 创建 isUrl 函数
    - 创建 `src/utils/isUrl/index.ts`
    - 参考 `raw/src/utils/isUrl/`
    - _Requirements: 11.6_
  - [ ] 22.7 创建 isImg 函数
    - 创建 `src/utils/isImg/index.ts`
    - 参考 `raw/src/utils/isImg/`
    - _Requirements: 11.7_
  - [ ] 22.8 创建 isBrowser 函数
    - 创建 `src/utils/isBrowser/index.ts`
    - 参考 `raw/src/utils/isBrowser/`
    - _Requirements: 11.8_
  - [ ] 22.9 创建 merge 函数
    - 创建 `src/utils/merge/index.ts`
    - 参考 `raw/src/utils/merge/`
    - _Requirements: 11.9_
  - [ ] 22.10 创建 runFunction 函数
    - 创建 `src/utils/runFunction/index.ts`
    - 参考 `raw/src/utils/runFunction/`
    - _Requirements: 11.10_
  - [ ]\* 22.11 编写工具函数属性测试
    - **Property 9: Utility Function Purity**
    - **Validates: Requirements 11.1-11.19**

- [ ] 23. 迁移日期处理函数
  - [ ] 23.1 创建 conversionMomentValue 函数
    - 创建 `src/utils/conversionMomentValue/index.ts`
    - 参考 `raw/src/utils/conversionMomentValue/`
    - _Requirements: 11.11_
  - [ ] 23.2 创建 parseValueToMoment 函数
    - 创建 `src/utils/parseValueToMoment/index.ts`
    - 参考 `raw/src/utils/parseValueToMoment/`
    - _Requirements: 11.12_
  - [ ] 23.3 创建 dateArrayFormatter 函数
    - 创建 `src/utils/dateArrayFormatter/index.ts`
    - 参考 `raw/src/utils/dateArrayFormatter/`
    - _Requirements: 11.18_

- [ ] 24. 迁移表单处理函数
  - [ ] 24.1 创建 transformKeySubmitValue 函数
    - 创建 `src/utils/transformKeySubmitValue/index.ts`
    - 参考 `raw/src/utils/transformKeySubmitValue/`
    - _Requirements: 11.13_
  - [ ] 24.2 创建 pickProProps 函数
    - 创建 `src/utils/pickProProps/index.ts`
    - 参考 `raw/src/utils/pickProProps/`
    - _Requirements: 11.14_
  - [ ] 24.3 创建 pickProFormItemProps 函数
    - 创建 `src/utils/pickProFormItemProps/index.ts`
    - 参考 `raw/src/utils/pickProFormItemProps/`
    - _Requirements: 11.15_
  - [ ] 24.4 创建 getFieldPropsOrFormItemProps 函数
    - 创建 `src/utils/getFieldPropsOrFormItemProps/index.ts`
    - 参考 `raw/src/utils/getFieldPropsOrFormItemProps/`
    - _Requirements: 11.16_
  - [ ] 24.5 创建 proFieldParsingText 函数
    - 创建 `src/utils/proFieldParsingText/index.ts`
    - 参考 `raw/src/utils/proFieldParsingText/`
    - _Requirements: 11.17_
  - [ ] 24.6 创建 genCopyable 函数
    - 创建 `src/utils/genCopyable/index.ts`
    - 参考 `raw/src/utils/genCopyable/`
    - _Requirements: 11.19_

- [ ] 25. Checkpoint - 确保工具函数测试通过
  - Ensure all tests pass, ask the user if questions arise.

## Phase 9: 工具 Hooks 迁移 (P2 - 增强)

- [ ] 26. 迁移状态管理 Hooks
  - [ ] 26.1 创建 useMountMergeState Hook
    - 创建 `src/utils/hooks/useMountMergeState/index.ts`
    - 参考 `raw/src/utils/useMountMergeState/`
    - _Requirements: 12.1_
  - [ ] 26.2 创建 useEditableArray Hook
    - 创建 `src/utils/hooks/useEditableArray/index.ts`
    - 参考 `raw/src/utils/useEditableArray/`
    - _Requirements: 12.2_
  - [ ] 26.3 创建 useEditableMap Hook
    - 创建 `src/utils/hooks/useEditableMap/index.ts`
    - 参考 `raw/src/utils/useEditableMap/`
    - _Requirements: 12.3_

- [ ] 27. 迁移性能优化 Hooks
  - [ ] 27.1 创建 useDeepCompareEffect Hook
    - 创建 `src/utils/hooks/useDeepCompareEffect/index.ts`
    - 参考 `raw/src/utils/hooks/useDeepCompareEffect/`
    - _Requirements: 12.4_
  - [ ] 27.2 创建 useDeepCompareMemo Hook
    - 创建 `src/utils/hooks/useDeepCompareMemo/index.ts`
    - 参考 `raw/src/utils/hooks/useDeepCompareMemo/`
    - _Requirements: 12.5_
  - [ ] 27.3 创建 useDebounceFn Hook
    - 创建 `src/utils/hooks/useDebounceFn/index.ts`
    - 参考 `raw/src/utils/hooks/useDebounceFn/`
    - _Requirements: 12.6_
  - [ ] 27.4 创建 useDebounceValue Hook
    - 创建 `src/utils/hooks/useDebounceValue/index.ts`
    - 参考 `raw/src/utils/hooks/useDebounceValue/`
    - _Requirements: 12.7_

- [ ] 28. 迁移其他工具 Hooks
  - [ ] 28.1 创建 useMediaQuery Hook
    - 创建 `src/utils/hooks/useMediaQuery/index.ts`
    - 参考 `raw/src/utils/useMediaQuery/`
    - _Requirements: 12.8_
  - [ ] 28.2 创建 useFetchData Hook
    - 创建 `src/utils/hooks/useFetchData/index.ts`
    - 参考 `raw/src/utils/hooks/useFetchData/`
    - _Requirements: 12.9_
  - [ ] 28.3 创建 useLatest Hook
    - 创建 `src/utils/hooks/useLatest/index.ts`
    - 参考 `raw/src/utils/hooks/useLatest/`
    - _Requirements: 12.10_
  - [ ] 28.4 创建 usePrevious Hook
    - 创建 `src/utils/hooks/usePrevious/index.ts`
    - 参考 `raw/src/utils/hooks/usePrevious/`
    - _Requirements: 12.11_
  - [ ] 28.5 创建 useRefFunction Hook
    - 创建 `src/utils/hooks/useRefFunction/index.ts`
    - 参考 `raw/src/utils/hooks/useRefFunction/`
    - _Requirements: 12.12_
  - [ ] 28.6 创建 useRefCallback Hook
    - 创建 `src/utils/hooks/useRefCallback/index.ts`
    - 参考 `raw/src/utils/hooks/useRefCallback/`
    - _Requirements: 12.13_
  - [ ] 28.7 创建 useForceRender Hook
    - 创建 `src/utils/hooks/useForceRender/index.ts`
    - 参考 `raw/src/utils/hooks/useForceRender/`
    - _Requirements: 12.14_
  - [ ] 28.8 创建 useDocumentTitle Hook
    - 创建 `src/utils/hooks/useDocumentTitle/index.ts`
    - 参考 `raw/src/utils/hooks/useDocumentTitle/`
    - _Requirements: 12.15_
  - [ ] 28.9 创建 useReactiveRef Hook
    - 创建 `src/utils/hooks/useReactiveRef/index.ts`
    - 参考 `raw/src/utils/hooks/useReactiveRef/`
    - _Requirements: 12.16_

- [ ] 29. Checkpoint - 确保工具 Hooks 测试通过
  - Ensure all tests pass, ask the user if questions arise.

## Phase 10: 工具组件迁移 (P2 - 增强)

- [ ] 30. 迁移工具组件
  - [ ] 30.1 创建 ErrorBoundary 组件
    - 创建 `src/utils/components/ErrorBoundary/index.tsx`
    - 参考 `raw/src/utils/components/ErrorBoundary/`
    - _Requirements: 13.1_
  - [ ] 30.2 创建 FieldLabel 组件
    - 创建 `src/utils/components/FieldLabel/index.tsx`
    - 参考 `raw/src/utils/components/FieldLabel/`
    - _Requirements: 13.2_
  - [ ] 30.3 创建 LabelIconTip 组件
    - 创建 `src/utils/components/LabelIconTip/index.tsx`
    - 参考 `raw/src/utils/components/LabelIconTip/`
    - _Requirements: 13.3_
  - [ ] 30.4 创建 FilterDropdown 组件
    - 创建 `src/utils/components/FilterDropdown/index.tsx`
    - 参考 `raw/src/utils/components/FilterDropdown/`
    - _Requirements: 13.4_
  - [ ] 30.5 创建 DropdownFooter 组件
    - 创建 `src/utils/components/DropdownFooter/index.tsx`
    - 参考 `raw/src/utils/components/DropdownFooter/`
    - _Requirements: 13.5_
  - [ ] 30.6 创建 InlineErrorFormItem 组件
    - 创建 `src/utils/components/InlineErrorFormItem/index.tsx`
    - 参考 `raw/src/utils/components/InlineErrorFormItem/`
    - _Requirements: 13.6_
  - [ ] 30.7 创建 ProFormContext 组件
    - 创建 `src/utils/components/ProFormContext/index.tsx`
    - 参考 `raw/src/utils/components/ProFormContext/`
    - _Requirements: 13.7_

- [ ] 31. Checkpoint - 确保工具组件测试通过
  - Ensure all tests pass, ask the user if questions arise.

## Phase 11: 其他组件迁移 (P3 - 扩展)

- [ ] 32. 迁移 ProCard 组件
  - [ ] 32.1 创建 ProCard 主组件
    - 创建 `src/components/card/index.tsx`
    - 参考 `raw/src/card/ProCard.tsx`
    - _Requirements: 14.1_
  - [ ] 32.2 创建 ProCard 子组件
    - 创建 Actions、Divider、Loading 等子组件
    - 参考 `raw/src/card/components/`
    - _Requirements: 14.1_
  - [ ] 32.3 创建 CheckCard 组件
    - 创建 `src/components/card/components/CheckCard/`
    - 参考 `raw/src/card/components/CheckCard/`
    - _Requirements: 14.1_
  - [ ] 32.4 创建 StatisticCard 组件
    - 创建 `src/components/card/components/StatisticCard/`
    - 参考 `raw/src/card/components/StatisticCard/`
    - _Requirements: 14.1_

- [ ] 33. 迁移 ProDescriptions 组件
  - [ ] 33.1 创建 ProDescriptions 主组件
    - 创建 `src/components/descriptions/index.tsx`
    - 参考 `raw/src/descriptions/index.tsx`
    - _Requirements: 14.2_
  - [ ] 33.2 创建 useFetchData Hook
    - 创建 `src/components/descriptions/useFetchData.ts`
    - 参考 `raw/src/descriptions/useFetchData.tsx`
    - _Requirements: 14.2_

- [ ] 34. 迁移 ProList 组件
  - [ ] 34.1 创建 ProList 主组件
    - 创建 `src/components/list/index.tsx`
    - 参考 `raw/src/list/index.tsx`
    - _Requirements: 14.3_
  - [ ] 34.2 创建 ProList Item 组件
    - 创建 `src/components/list/Item.tsx`
    - 参考 `raw/src/list/Item.tsx`
    - _Requirements: 14.3_
  - [ ] 34.3 创建 ListView 组件
    - 创建 `src/components/list/ListView.tsx`
    - 参考 `raw/src/list/ListView.tsx`
    - _Requirements: 14.3_

- [ ] 35. 迁移 ProSkeleton 组件
  - [ ] 35.1 创建 ProSkeleton 主组件
    - 创建 `src/components/skeleton/index.tsx`
    - 参考 `raw/src/skeleton/index.tsx`
    - _Requirements: 14.4_
  - [ ] 35.2 创建 Descriptions Skeleton
    - 创建 `src/components/skeleton/components/Descriptions/`
    - 参考 `raw/src/skeleton/components/Descriptions/`
    - _Requirements: 14.4_
  - [ ] 35.3 创建 List Skeleton
    - 创建 `src/components/skeleton/components/List/`
    - 参考 `raw/src/skeleton/components/List/`
    - _Requirements: 14.4_
  - [ ] 35.4 创建 Result Skeleton
    - 创建 `src/components/skeleton/components/Result/`
    - 参考 `raw/src/skeleton/components/Result/`
    - _Requirements: 14.4_

- [ ] 36. 迁移 ProLayout 组件
  - [ ] 36.1 创建 ProLayout 主组件
    - 创建 `src/components/layout/index.tsx`
    - 参考 `raw/src/layout/ProLayout.tsx`
    - _Requirements: 14.5_
  - [ ] 36.2 创建 SiderMenu 组件
    - 创建 `src/components/layout/components/SiderMenu/`
    - 参考 `raw/src/layout/components/SiderMenu/`
    - _Requirements: 14.5_
  - [ ] 36.3 创建 GlobalHeader 组件
    - 创建 `src/components/layout/components/GlobalHeader/`
    - 参考 `raw/src/layout/components/GlobalHeader/`
    - _Requirements: 14.5_
  - [ ] 36.4 创建 PageContainer 组件
    - 创建 `src/components/layout/components/PageContainer/`
    - 参考 `raw/src/layout/components/PageContainer/`
    - _Requirements: 14.5_
  - [ ] 36.5 创建 FooterToolbar 组件
    - 创建 `src/components/layout/components/FooterToolbar/`
    - 参考 `raw/src/layout/components/FooterToolbar/`
    - _Requirements: 14.5_
  - [ ] 36.6 创建 SettingDrawer 组件
    - 创建 `src/components/layout/components/SettingDrawer/`
    - 参考 `raw/src/layout/components/SettingDrawer/`
    - _Requirements: 14.5_
  - [ ] 36.7 创建 Layout 工具函数
    - 创建 `src/components/layout/utils/`
    - 参考 `raw/src/layout/utils/`
    - _Requirements: 14.5_
  - [ ] 36.8 创建 Layout 国际化
    - 创建 `src/components/layout/locales/`
    - 参考 `raw/src/layout/locales/`
    - _Requirements: 14.5_

- [ ] 37. Checkpoint - 确保其他组件测试通过
  - Ensure all tests pass, ask the user if questions arise.

## Phase 12: 统一导出和文档 (P1 - 重要)

- [ ] 38. 更新统一导出
  - [ ] 38.1 更新 src/components/index.ts
    - 导出所有新增组件
    - 确保类型定义正确导出
    - _Requirements: 1-14_
  - [ ] 38.2 创建 src/utils/index.ts
    - 导出所有工具函数和 Hooks
    - _Requirements: 11-13_
  - [ ] 38.3 更新 package.json 导出配置
    - 配置正确的 exports 字段
    - _Requirements: 1-14_

- [ ] 39. Final Checkpoint - 确保所有测试通过
  - Ensure all tests pass, ask the user if questions arise.
