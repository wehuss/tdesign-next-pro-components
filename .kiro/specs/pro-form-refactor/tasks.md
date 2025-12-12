# Implementation Plan

## Phase 1: 修复类型错误

- [x] 1. 修复 proFormFieldProps 中的类型定义
  - [x] 1.1 修改 `src/components/form/utils/proFormFieldProps.ts` 中的 `label` 类型
    - 将 `label` 类型改为 `FormItemProps['label']`
    - _Requirements: 1.1, 1.3_

  - [x] 1.2 修改 `src/components/form/utils/proFormFieldProps.ts` 中的 `help` 类型
    - 将 `help` 类型改为 `FormItemProps['help']`
    - _Requirements: 1.2, 1.4_

  - [ ]\* 1.3 编写属性测试验证 label 类型转换
    - **Property 1: Label type conversion preserves value**
    - **Validates: Requirements 1.3**
  - [ ]\* 1.4 编写属性测试验证 help 类型转换
    - **Property 2: Help type conversion preserves value**
    - **Validates: Requirements 1.4**

- [x] 2. 更新 ProFormItem 组件的类型处理
  - [x] 2.1 修改 `src/components/form/components/FormItem/index.tsx` 中的 props 类型定义
    - 更新 `label` 和 `help` 的 PropType 定义
    - _Requirements: 1.3, 1.4_

  - [x] 2.2 验证所有 ProFormXXX 组件的类型兼容性
    - 检查 Digit, Text, Select 等组件是否正确传递 label 和 help
    - _Requirements: 1.1, 1.2_

- [ ] 3. Checkpoint - 确保类型修复后无编译错误
  - Ensure all tests pass, ask the user if questions arise.

## Phase 2: 重命名文件夹为 kebab-case

- [x] 4. 重命名组件文件夹
  - [x] 4.1 重命名单词组件文件夹 (无需连字符)
    - Captcha → captcha, Cascader → cascader, Checkbox → checkbox, Dependency → dependency
    - Digit → digit, Field → field, Group → group, List → list, Money → money
    - Password → password, Radio → radio, Rate → rate, Segmented → segmented
    - Select → select, Slider → slider, Switch → switch, Text → text
    - _Requirements: 2.1_

  - [x] 4.2 重命名多词组件文件夹 (需要连字符)
    - ColorPicker → color-picker, DatePicker → date-picker
    - DateRangePicker → date-range-picker, FieldSet → field-set
    - FormItem → form-item, TextArea → text-area
    - TimePicker → time-picker, TimeRangePicker → time-range-picker
    - TreeSelect → tree-select, UploadButton → upload-button
    - UploadDragger → upload-dragger
    - _Requirements: 2.1_

- [x] 5. 更新导入路径
  - [x] 5.1 更新 `src/components/form/components/index.ts` 中的所有导入路径
    - 将所有 PascalCase 路径改为 kebab-case
    - _Requirements: 2.2_

  - [x] 5.2 更新 `src/components/form/index.ts` 中的所有导入路径
    - 将所有 PascalCase 路径改为 kebab-case
    - _Requirements: 2.2_

  - [ ] 5.3 检查并更新其他文件中的相关导入
    - 检查 BaseForm, ProForm 等组件中的导入
    - _Requirements: 2.2, 2.3_

- [ ] 6. Checkpoint - 确保重命名后项目可正常编译
  - Ensure all tests pass, ask the user if questions arise.

## Phase 3: 重写 ProForm 文档

- [x] 7. 创建基础 Demo 组件
  - [ ] 7.1 创建 `docs/.vitepress/demos/pro-form/Basic.vue` 基础用法示例
    - 展示 ProForm 基本使用方式
    - _Requirements: 3.2, 4.1, 4.2, 4.3_

  - [ ] 7.2 创建 `docs/.vitepress/demos/pro-form/FormItems.vue` 表单项组件示例
    - 展示所有 ProFormXXX 组件的用法

    - _Requirements: 3.2, 3.4_

  - [-] 7.3 创建 `docs/.vitepress/demos/pro-form/Layout.vue` 布局示例
    - 展示 ProFormGroup 栅格布局

    - _Requirements: 3.2_

- [ ] 8. 创建高级功能 Demo 组件
  - [ ] 8.1 创建 `docs/.vitepress/demos/pro-form/Validation.vue` 表单验证示例
    - 展示各种验证规则的使用

    - _Requirements: 3.2_

  - [ ] 8.2 创建 `docs/.vitepress/demos/pro-form/Dependency.vue` 表单联动示例
    - 展示 ProFormDependency 的使用
    - _Requirements: 3.2_
  - [x] 8.3 创建 `docs/.vitepress/demos/pro-form/DynamicForm.vue` 动态表单示例
    - 展示 ProFormList 的使用

    - _Requirements: 3.2_

  - [ ] 8.4 创建 `docs/.vitepress/demos/pro-form/Readonly.vue` 只读模式示例
    - 展示只读模式的使用
    - _Requirements: 3.2_

- [ ] 9. 创建各组件独立 Demo
  - [x] 9.1 创建文本输入类组件 Demo
    - TextDemo.vue, TextAreaDemo.vue, PasswordDemo.vue
    - _Requirements: 3.4_

  - [ ] 9.2 创建选择类组件 Demo
    - SelectDemo.vue, RadioDemo.vue, CheckboxDemo.vue, CascaderDemo.vue, TreeSelectDemo.vue
    - _Requirements: 3.4_
  - [-] 9.3 创建日期时间类组件 Demo
    - DatePickerDemo.vue, TimePickerDemo.vue, DateRangePickerDemo.vue

    - _Requirements: 3.4_

  - [ ] 9.4 创建数字输入类组件 Demo
    - DigitDemo.vue, MoneyDemo.vue, SliderDemo.vue, RateDemo.vue
    - _Requirements: 3.4_
  - [ ] 9.5 创建其他组件 Demo
    - SwitchDemo.vue, ColorPickerDemo.vue, SegmentedDemo.vue, CaptchaDemo.vue
    - _Requirements: 3.4_

- [ ] 10. 重写 ProForm 文档
  - [ ] 10.1 编写文档介绍部分
    - 包含 ProForm 的功能特性和使用场景
    - _Requirements: 3.1_
  - [ ] 10.2 编写基础用法部分
    - 引用 Basic.vue 和 FormItems.vue Demo
    - _Requirements: 3.2, 3.5, 4.4_
  - [ ] 10.3 编写布局和联动部分
    - 引用 Layout.vue, Dependency.vue, DynamicForm.vue Demo
    - _Requirements: 3.2, 3.5, 4.4_

  - [ ] 10.4 编写验证和只读部分
    - 引用 Validation.vue, Readonly.vue Demo
    - _Requirements: 3.2, 3.5, 4.4_
  - [ ] 10.5 编写各组件用法部分
    - 引用各组件独立 Demo，展示每个 ProFormXXX 组件的详细用法
    - _Requirements: 3.4, 3.5, 4.4_
  - [ ] 10.6 编写 API 文档部分
    - 包含 ProForm、ProFormItem 和所有 ProFormXXX 组件的 Props 表格
    - 包含完整的 TypeScript 类型标注
    - _Requirements: 3.3, 3.6_

- [ ] 11. Final Checkpoint - 确保文档和所有功能正常
  - Ensure all tests pass, ask the user if questions arise.
