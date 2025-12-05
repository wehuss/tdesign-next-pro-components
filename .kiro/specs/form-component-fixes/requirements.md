# Requirements Document

## Introduction

本文档定义了修复 Vue 3 ProForm 组件迁移问题的需求。当前从 React 迁移到 Vue 3 + TDesign 的过程中，存在以下核心问题：

1. **handleFinish 无法触发**: TDesign Form 的 `onSubmit` 事件签名与 React 版本不同，导致表单提交回调无法正确触发
2. **泛型 Props 问题**: Vue 组件不支持将泛型作为 props 传递，导致 `createField` 工厂函数的类型系统无法正常工作
3. **Extraneous non-props attributes 警告**: 组件渲染 fragment 或 text 时无法自动继承属性，导致控制台警告

## Glossary

- **TDesign Form**: 腾讯设计系统的 Vue 3 表单组件
- **SubmitContext**: TDesign Form onSubmit 事件的上下文对象，包含 validateResult、firstError、fields 等属性
- **createField**: 用于创建表单字段组件的工厂函数
- **inheritAttrs**: Vue 组件选项，控制是否自动继承非 props 属性
- **ProFormItem**: 表单项包装组件
- **BaseForm**: 表单基础组件，封装 TDesign Form

## Requirements

### Requirement 1: 修复表单提交事件处理

**User Story:** As a developer, I want the form onFinish callback to be triggered correctly when the form is submitted, so that I can handle form data submission.

#### Acceptance Criteria

1. WHEN a user clicks the submit button THEN the BaseForm SHALL validate the form and call onFinish with the form values if validation passes
2. WHEN form validation fails THEN the BaseForm SHALL call onFinishFailed with the validation errors
3. WHEN the form is submitted THEN the BaseForm SHALL correctly extract form values from TDesign Form's SubmitContext
4. WHEN the form has a data prop THEN the BaseForm SHALL use the data prop to get form values
5. WHEN the form uses v-model on fields THEN the field values SHALL be correctly collected and passed to onFinish

---

### Requirement 2: 修复 createField 工厂函数

**User Story:** As a developer, I want to use createField to create form field components with proper TypeScript support, so that I can have type-safe form fields.

#### Acceptance Criteria

1. WHEN createField is called with a config THEN the system SHALL return a valid Vue component
2. WHEN a field component is rendered THEN the system SHALL correctly pass props to the underlying input component
3. WHEN a field component uses v-model THEN the system SHALL support bidirectional data binding
4. WHEN a field component has fieldProps THEN the system SHALL merge fieldProps with component props correctly
5. WHEN a field component is inside a ProForm THEN the system SHALL integrate with the form context

---

### Requirement 3: 修复属性继承警告

**User Story:** As a developer, I want to use ProForm components without console warnings about extraneous attributes, so that I have a clean development experience.

#### Acceptance Criteria

1. WHEN a component renders a single root element THEN the component SHALL correctly inherit non-props attributes
2. WHEN a component renders a fragment THEN the component SHALL handle attributes explicitly without warnings
3. WHEN ProFormItem wraps a field THEN the system SHALL filter out non-applicable attributes before passing to children
4. WHEN createField creates a component THEN the component SHALL use inheritAttrs: false and handle attrs explicitly

---

### Requirement 4: 修复 ProFormSelect 组件

**User Story:** As a developer, I want to use ProFormSelect with proper options and value binding, so that I can create select fields in forms.

#### Acceptance Criteria

1. WHEN ProFormSelect is rendered with options THEN the system SHALL display all options correctly
2. WHEN a user selects an option THEN the system SHALL update the v-model value
3. WHEN ProFormSelect has valueEnum THEN the system SHALL convert valueEnum to options format
4. WHEN ProFormSelect is in read mode THEN the system SHALL display the selected option label

---

### Requirement 5: 修复表单数据绑定

**User Story:** As a developer, I want form fields to correctly bind to form data, so that I can manage form state effectively.

#### Acceptance Criteria

1. WHEN a field has a name prop THEN the field value SHALL be registered with the form
2. WHEN the form is submitted THEN the system SHALL collect all named field values
3. WHEN a field value changes THEN the system SHALL notify the form of the change
4. WHEN the form is reset THEN all field values SHALL be reset to initial values
