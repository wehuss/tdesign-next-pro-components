# Requirements Document

## Introduction

This document specifies the requirements for fixing the ProForm component type inference issue in the Vue 3 + TDesign implementation. The current implementation uses a generic `createField` factory function that loses type information from TDesign components, resulting in no IDE type hints when using ProFormXXX components. The goal is to rewrite the form components to preserve full type inference from the underlying TDesign components while maintaining the ProForm wrapper functionality.

## Glossary

- **ProFormXXX**: Wrapper components (e.g., ProFormColorPicker, ProFormSelect) that combine TDesign form controls with ProFormItem functionality
- **TDesign**: The TDesign Vue Next component library providing base form controls
- **createField**: A factory function that creates ProForm field components with common functionality
- **Type Inference**: TypeScript's ability to automatically determine types, enabling IDE autocomplete and type checking
- **fieldProps**: Props passed directly to the underlying TDesign component
- **ProFormItem**: A wrapper component that provides form item functionality (label, validation, layout)
- **valueType**: A string identifier for the type of field (e.g., 'text', 'select', 'date')
- **valueEnum**: An object or Map that defines enumerated values for select-like components

## Requirements

### Requirement 1

**User Story:** As a developer, I want ProFormXXX components to provide full type hints for the underlying TDesign component props, so that I can use IDE autocomplete and type checking when configuring form fields.

#### Acceptance Criteria

1. WHEN a developer uses ProFormColorPicker THEN the IDE SHALL display ColorPicker props from TDesign in autocomplete suggestions for fieldProps
2. WHEN a developer uses ProFormSelect THEN the IDE SHALL display Select props from TDesign in autocomplete suggestions for fieldProps
3. WHEN a developer uses ProFormInput THEN the IDE SHALL display Input props from TDesign in autocomplete suggestions for fieldProps
4. WHEN a developer passes invalid props to fieldProps THEN TypeScript SHALL report a type error
5. WHEN a developer hovers over a ProFormXXX component THEN the IDE SHALL display the combined type definition including both ProForm props and TDesign component props

### Requirement 2

**User Story:** As a developer, I want each ProFormXXX component to be a standalone component with explicit type definitions, so that the type system can properly infer all available props.

#### Acceptance Criteria

1. WHEN defining ProFormColorPicker THEN the component SHALL use defineComponent with explicit props derived from TDesign ColorPickerProps
2. WHEN defining ProFormSelect THEN the component SHALL use defineComponent with explicit props derived from TDesign SelectProps
3. WHEN defining any ProFormXXX component THEN the component SHALL export a properly typed component definition
4. WHEN a component is created THEN the component SHALL NOT use generic type parameters that Vue cannot resolve at runtime

### Requirement 3

**User Story:** As a developer, I want the createField utility to be refactored or replaced with a pattern that preserves type information, so that all ProFormXXX components have consistent behavior while maintaining type safety.

#### Acceptance Criteria

1. WHEN the createField utility is used THEN the resulting component SHALL preserve type information from the input component props
2. WHEN a ProFormXXX component is created THEN the component SHALL include all common ProForm props (name, label, rules, etc.)
3. WHEN a ProFormXXX component is created THEN the component SHALL include fieldProps typed to the specific TDesign component
4. WHEN the utility generates a component THEN the component SHALL support v-model for two-way binding

### Requirement 4

**User Story:** As a developer, I want ProFormXXX components to maintain all existing functionality including form context integration, validation, and layout features, so that the type fix does not break existing behavior.

#### Acceptance Criteria

1. WHEN a ProFormXXX component is used within a ProForm THEN the component SHALL integrate with the form context for value management
2. WHEN a ProFormXXX component has validation rules THEN the component SHALL display validation errors correctly
3. WHEN ignoreFormItem is set to true THEN the component SHALL render without the ProFormItem wrapper
4. WHEN readonly mode is enabled THEN the component SHALL display the value in read-only format
5. WHEN the form is submitted THEN the component SHALL apply any configured transform functions to the value

### Requirement 5

**User Story:** As a developer, I want the types.ts file to define proper intersection types that combine ProForm base props with TDesign component props, so that type definitions are centralized and maintainable.

#### Acceptance Criteria

1. WHEN defining ProFormColorPickerProps THEN the type SHALL extend ProFormFieldItemProps and include ColorPickerProps from TDesign
2. WHEN defining ProFormSelectProps THEN the type SHALL extend ProFormFieldItemProps and include SelectProps from TDesign
3. WHEN defining any ProFormXXXProps THEN the type SHALL use TypeScript intersection or extension to combine types
4. WHEN types are exported THEN the types SHALL be available for external consumption

### Requirement 6

**User Story:** As a developer, I want a consistent pattern for creating new ProFormXXX components, so that future components can be added with proper type support.

#### Acceptance Criteria

1. WHEN a new ProFormXXX component is needed THEN the developer SHALL follow a documented pattern that preserves types
2. WHEN the pattern is applied THEN the resulting component SHALL have full type inference for the underlying TDesign component
3. WHEN the pattern is applied THEN the resulting component SHALL integrate with ProFormItem automatically
4. WHEN the pattern is applied THEN the resulting component SHALL support all common ProForm features (valueType, valueEnum, transform, etc.)
