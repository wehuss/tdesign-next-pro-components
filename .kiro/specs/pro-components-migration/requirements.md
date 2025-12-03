# Requirements Document

## Introduction

本文档定义了将 ant-design/pro-components (React) 迁移到 Vue 3 + TDesign 的详细需求。原版代码位于 `/raw` 目录，目标是创建一个功能完整、API 兼容的 Vue 3 组件库。当前已部分迁移 Field、Form 和 Table 组件，但完成度不一。

## Glossary

- **ProField**: 用于展示和编辑各种数据类型的字段组件
- **ProForm**: 高级表单组件，支持多种布局和表单类型
- **ProTable**: 高级表格组件，支持搜索、工具栏、可编辑等功能
- **ProProvider**: 全局配置提供者，包含国际化和主题配置
- **ValueType**: 字段值类型，如 text、money、date 等
- **ValueEnum**: 枚举值映射配置
- **TDesign**: 腾讯设计系统的 Vue 组件库
- **BaseForm**: 表单基础组件，提供核心表单功能
- **Submitter**: 表单提交按钮组件
- **LightWrapper**: 轻量级表单项包装器
- **EditableTable**: 可编辑表格组件
- **DragSortTable**: 拖拽排序表格组件

## Requirements

### Requirement 1: ProField 组件迁移

**User Story:** As a developer, I want to use ProField components to display and edit various data types, so that I can quickly build data display interfaces.

#### Acceptance Criteria

1. WHEN a developer uses ProField with valueType="text" THEN the system SHALL render a text display/input component
2. WHEN a developer uses ProField with valueType="money" THEN the system SHALL render a formatted currency display/input
3. WHEN a developer uses ProField with valueType="date" THEN the system SHALL render a date picker component
4. WHEN a developer uses ProField with valueType="dateRange" THEN the system SHALL render a date range picker
5. WHEN a developer uses ProField with valueType="time" THEN the system SHALL render a time picker
6. WHEN a developer uses ProField with valueType="select" THEN the system SHALL render a select dropdown with valueEnum support
7. WHEN a developer uses ProField with valueType="checkbox" THEN the system SHALL render checkbox options
8. WHEN a developer uses ProField with valueType="radio" THEN the system SHALL render radio options
9. WHEN a developer uses ProField with valueType="switch" THEN the system SHALL render a switch toggle
10. WHEN a developer uses ProField with valueType="rate" THEN the system SHALL render a rating component
11. WHEN a developer uses ProField with valueType="slider" THEN the system SHALL render a slider component
12. WHEN a developer uses ProField with valueType="percent" THEN the system SHALL render a percentage display/input
13. WHEN a developer uses ProField with valueType="digit" THEN the system SHALL render a number input
14. WHEN a developer uses ProField with valueType="password" THEN the system SHALL render a password input
15. WHEN a developer uses ProField with valueType="textarea" THEN the system SHALL render a textarea
16. WHEN a developer uses ProField with mode="read" THEN the system SHALL render read-only display
17. WHEN a developer uses ProField with mode="edit" THEN the system SHALL render editable input

#### 待迁移子组件 (原版存在但未迁移)

18. WHEN a developer uses ProField with valueType="cascader" THEN the system SHALL render a cascader component
19. WHEN a developer uses ProField with valueType="treeSelect" THEN the system SHALL render a tree select
20. WHEN a developer uses ProField with valueType="code" THEN the system SHALL render a code editor
21. WHEN a developer uses ProField with valueType="colorPicker" THEN the system SHALL render a color picker
22. WHEN a developer uses ProField with valueType="digitRange" THEN the system SHALL render a number range input
23. WHEN a developer uses ProField with valueType="fromNow" THEN the system SHALL render relative time display
24. WHEN a developer uses ProField with valueType="image" THEN the system SHALL render an image display
25. WHEN a developer uses ProField with valueType="indexColumn" THEN the system SHALL render row index
26. WHEN a developer uses ProField with valueType="progress" THEN the system SHALL render a progress bar
27. WHEN a developer uses ProField with valueType="second" THEN the system SHALL render seconds display
28. WHEN a developer uses ProField with valueType="segmented" THEN the system SHALL render a segmented control
29. WHEN a developer uses ProField with valueType="options" THEN the system SHALL render options display

---

### Requirement 2: ProForm 基础组件迁移

**User Story:** As a developer, I want to use ProForm base components to build forms quickly, so that I can reduce boilerplate code.

#### Acceptance Criteria

1. WHEN a developer uses BaseForm THEN the system SHALL provide form state management and validation
2. WHEN a developer uses Submitter THEN the system SHALL render submit and reset buttons with customization support
3. WHEN a developer uses LightWrapper THEN the system SHALL provide lightweight form item wrapping
4. WHEN a developer uses EditOrReadOnlyContext THEN the system SHALL provide edit/readonly mode switching
5. WHEN a developer uses FieldContext THEN the system SHALL provide field-level context sharing

---

### Requirement 3: ProForm 表单项组件迁移

**User Story:** As a developer, I want to use ProForm field components to build form fields, so that I can have consistent form item behavior.

#### Acceptance Criteria

1. WHEN a developer uses ProFormText THEN the system SHALL render a text input with form integration
2. WHEN a developer uses ProFormTextArea THEN the system SHALL render a textarea with form integration
3. WHEN a developer uses ProFormDigit THEN the system SHALL render a number input with form integration
4. WHEN a developer uses ProFormMoney THEN the system SHALL render a money input with form integration
5. WHEN a developer uses ProFormSelect THEN the system SHALL render a select with form integration
6. WHEN a developer uses ProFormCheckbox THEN the system SHALL render checkboxes with form integration
7. WHEN a developer uses ProFormRadio THEN the system SHALL render radios with form integration
8. WHEN a developer uses ProFormSwitch THEN the system SHALL render a switch with form integration
9. WHEN a developer uses ProFormRate THEN the system SHALL render a rating with form integration
10. WHEN a developer uses ProFormSlider THEN the system SHALL render a slider with form integration
11. WHEN a developer uses ProFormDatePicker THEN the system SHALL render date pickers with form integration
12. WHEN a developer uses ProFormDateRangePicker THEN the system SHALL render date range pickers with form integration
13. WHEN a developer uses ProFormTimePicker THEN the system SHALL render time pickers with form integration
14. WHEN a developer uses ProFormCascader THEN the system SHALL render a cascader with form integration
15. WHEN a developer uses ProFormTreeSelect THEN the system SHALL render a tree select with form integration
16. WHEN a developer uses ProFormColorPicker THEN the system SHALL render a color picker with form integration
17. WHEN a developer uses ProFormUploadButton THEN the system SHALL render an upload button with form integration
18. WHEN a developer uses ProFormUploadDragger THEN the system SHALL render a drag upload area with form integration

#### 待迁移子组件 (原版存在但未迁移)

19. WHEN a developer uses ProFormCaptcha THEN the system SHALL render a captcha input with countdown
20. WHEN a developer uses ProFormSegmented THEN the system SHALL render a segmented control with form integration
21. WHEN a developer uses ProFormField THEN the system SHALL render a generic field wrapper

---

### Requirement 4: ProForm 高级组件迁移

**User Story:** As a developer, I want to use ProForm advanced components for complex form scenarios, so that I can handle grouped and dynamic form fields.

#### Acceptance Criteria

1. WHEN a developer uses ProFormGroup THEN the system SHALL render grouped form fields with title
2. WHEN a developer uses ProFormList THEN the system SHALL render dynamic form list with add/remove
3. WHEN a developer uses ProFormFieldSet THEN the system SHALL render a set of related fields
4. WHEN a developer uses ProFormDependency THEN the system SHALL provide field dependency handling
5. WHEN a developer uses ProFormItem THEN the system SHALL render a customizable form item wrapper

---

### Requirement 5: ProForm 布局组件迁移

**User Story:** As a developer, I want to use different form layouts, so that I can adapt forms to various UI requirements.

#### Acceptance Criteria

1. WHEN a developer uses ProForm THEN the system SHALL render a standard vertical form layout
2. WHEN a developer uses ModalForm THEN the system SHALL render a form inside a modal dialog
3. WHEN a developer uses DrawerForm THEN the system SHALL render a form inside a drawer
4. WHEN a developer uses QueryFilter THEN the system SHALL render a collapsible search filter form
5. WHEN a developer uses LightFilter THEN the system SHALL render a lightweight inline filter
6. WHEN a developer uses StepsForm THEN the system SHALL render a multi-step wizard form

#### 待迁移子组件 (原版存在但未迁移)

7. WHEN a developer uses LoginForm THEN the system SHALL render a login form layout
8. WHEN a developer uses LoginFormPage THEN the system SHALL render a full-page login layout
9. WHEN a developer uses SchemaForm THEN the system SHALL render a form from JSON schema

---

### Requirement 6: ProTable 核心功能迁移

**User Story:** As a developer, I want to use ProTable for data display with advanced features, so that I can build data management interfaces efficiently.

#### Acceptance Criteria

1. WHEN a developer uses ProTable with request prop THEN the system SHALL fetch data with pagination support
2. WHEN a developer uses ProTable with columns prop THEN the system SHALL render table columns with valueType support
3. WHEN a developer uses ProTable with search prop THEN the system SHALL render a search form above the table
4. WHEN a developer uses ProTable with toolbar prop THEN the system SHALL render a toolbar with actions
5. WHEN a developer uses ProTable with pagination prop THEN the system SHALL handle pagination state
6. WHEN a developer uses ProTable with rowSelection prop THEN the system SHALL support row selection
7. WHEN a developer uses ProTable with actionRef THEN the system SHALL expose table action methods
8. WHEN a developer uses ProTable with polling prop THEN the system SHALL support data polling

---

### Requirement 7: ProTable 子组件迁移

**User Story:** As a developer, I want to use ProTable sub-components for customization, so that I can extend table functionality.

#### Acceptance Criteria

1. WHEN a developer uses TableAlert THEN the system SHALL display selection info and batch actions
2. WHEN a developer uses TableToolbar THEN the system SHALL render toolbar with title and actions

#### 待迁移子组件 (原版存在但未迁移)

3. WHEN a developer uses ColumnSetting THEN the system SHALL render column visibility controls
4. WHEN a developer uses DensityIcon THEN the system SHALL render table density toggle
5. WHEN a developer uses FullscreenIcon THEN the system SHALL render fullscreen toggle
6. WHEN a developer uses ListToolBar THEN the system SHALL render list-style toolbar
7. WHEN a developer uses HeaderMenu THEN the system SHALL render toolbar header menu
8. WHEN a developer uses FormRender THEN the system SHALL render search form for table
9. WHEN a developer uses Dropdown THEN the system SHALL render action dropdown menu

---

### Requirement 8: ProTable 高级表格迁移

**User Story:** As a developer, I want to use advanced table features, so that I can handle complex data editing scenarios.

#### Acceptance Criteria (待迁移)

1. WHEN a developer uses EditableTable THEN the system SHALL support inline row editing
2. WHEN a developer uses CellEditorTable THEN the system SHALL support cell-level editing
3. WHEN a developer uses RowEditorTable THEN the system SHALL support row-level editing
4. WHEN a developer uses DragSortTable THEN the system SHALL support drag-and-drop row sorting

---

### Requirement 9: ProTable 工具函数迁移

**User Story:** As a developer, I want table utility functions to work correctly, so that I can rely on consistent data processing.

#### Acceptance Criteria

1. WHEN the system processes columns THEN genProColumnToColumn SHALL convert ProColumns to table columns
2. WHEN the system renders cells THEN columnRender SHALL handle valueType rendering
3. WHEN the system sorts columns THEN columnSort SHALL order columns correctly
4. WHEN the system renders form items THEN cellRenderToFormItem SHALL convert cells to form items

---

### Requirement 10: ProProvider 全局配置迁移

**User Story:** As a developer, I want to configure global settings, so that I can customize the component library behavior.

#### Acceptance Criteria (待迁移)

1. WHEN a developer uses ProConfigProvider THEN the system SHALL provide global configuration context
2. WHEN a developer sets locale THEN the system SHALL display localized text
3. WHEN a developer uses useIntl hook THEN the system SHALL return internationalization utilities
4. WHEN a developer customizes theme THEN the system SHALL apply theme tokens

---

### Requirement 11: 工具函数库迁移

**User Story:** As a developer, I want utility functions available, so that I can use common helpers in my code.

#### Acceptance Criteria (待迁移)

1. WHEN a developer uses omitUndefined THEN the system SHALL remove undefined values from objects
2. WHEN a developer uses omitBoolean THEN the system SHALL handle boolean value filtering
3. WHEN a developer uses stringify THEN the system SHALL serialize objects consistently
4. WHEN a developer uses nanoid THEN the system SHALL generate unique IDs
5. WHEN a developer uses isNil THEN the system SHALL check for null/undefined
6. WHEN a developer uses isUrl THEN the system SHALL validate URL strings
7. WHEN a developer uses isImg THEN the system SHALL check for image URLs
8. WHEN a developer uses isBrowser THEN the system SHALL detect browser environment
9. WHEN a developer uses merge THEN the system SHALL deep merge objects
10. WHEN a developer uses runFunction THEN the system SHALL safely execute functions
11. WHEN a developer uses conversionMomentValue THEN the system SHALL convert date values
12. WHEN a developer uses parseValueToMoment THEN the system SHALL parse strings to dates
13. WHEN a developer uses transformKeySubmitValue THEN the system SHALL transform form values
14. WHEN a developer uses pickProProps THEN the system SHALL extract Pro-specific props
15. WHEN a developer uses pickProFormItemProps THEN the system SHALL extract form item props
16. WHEN a developer uses getFieldPropsOrFormItemProps THEN the system SHALL resolve field props
17. WHEN a developer uses proFieldParsingText THEN the system SHALL parse field text values
18. WHEN a developer uses dateArrayFormatter THEN the system SHALL format date arrays
19. WHEN a developer uses genCopyable THEN the system SHALL generate copyable content

---

### Requirement 12: 工具 Hooks 迁移

**User Story:** As a developer, I want utility hooks available, so that I can use common reactive patterns.

#### Acceptance Criteria (待迁移)

1. WHEN a developer uses useMountMergeState THEN the system SHALL provide merged state management
2. WHEN a developer uses useEditableArray THEN the system SHALL provide array editing utilities
3. WHEN a developer uses useEditableMap THEN the system SHALL provide map editing utilities
4. WHEN a developer uses useDeepCompareEffect THEN the system SHALL run effects with deep comparison
5. WHEN a developer uses useDeepCompareMemo THEN the system SHALL memoize with deep comparison
6. WHEN a developer uses useDebounceFn THEN the system SHALL provide debounced functions
7. WHEN a developer uses useDebounceValue THEN the system SHALL provide debounced values
8. WHEN a developer uses useMediaQuery THEN the system SHALL detect media query matches
9. WHEN a developer uses useFetchData THEN the system SHALL provide data fetching utilities
10. WHEN a developer uses useLatest THEN the system SHALL provide latest value reference
11. WHEN a developer uses usePrevious THEN the system SHALL provide previous value
12. WHEN a developer uses useRefFunction THEN the system SHALL provide stable function references
13. WHEN a developer uses useRefCallback THEN the system SHALL provide stable callbacks
14. WHEN a developer uses useForceRender THEN the system SHALL force component re-render
15. WHEN a developer uses useDocumentTitle THEN the system SHALL manage document title
16. WHEN a developer uses useReactiveRef THEN the system SHALL provide reactive refs

---

### Requirement 13: 工具组件迁移

**User Story:** As a developer, I want utility components available, so that I can use common UI patterns.

#### Acceptance Criteria (待迁移)

1. WHEN a developer uses ErrorBoundary THEN the system SHALL catch and display errors gracefully
2. WHEN a developer uses FieldLabel THEN the system SHALL render field labels with icons
3. WHEN a developer uses LabelIconTip THEN the system SHALL render labels with tooltip icons
4. WHEN a developer uses FilterDropdown THEN the system SHALL render filter dropdown menus
5. WHEN a developer uses DropdownFooter THEN the system SHALL render dropdown footer actions
6. WHEN a developer uses InlineErrorFormItem THEN the system SHALL display inline form errors
7. WHEN a developer uses ProFormContext THEN the system SHALL provide form context

---

### Requirement 14: 其他组件迁移 (低优先级)

**User Story:** As a developer, I want additional Pro components available, so that I can build complete admin interfaces.

#### Acceptance Criteria (待迁移)

1. WHEN a developer uses ProCard THEN the system SHALL render an enhanced card component
2. WHEN a developer uses ProDescriptions THEN the system SHALL render description lists
3. WHEN a developer uses ProList THEN the system SHALL render enhanced list views
4. WHEN a developer uses ProSkeleton THEN the system SHALL render loading skeletons
5. WHEN a developer uses ProLayout THEN the system SHALL render admin layout structure
