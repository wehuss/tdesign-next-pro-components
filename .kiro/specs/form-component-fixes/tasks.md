# Implementation Plan

## Phase 1: 修复 BaseForm 表单提交

- [x] 1. 修复 BaseForm 的 onSubmit 事件处理
  - [x] 1.1 修改 handleFinish 函数以正确解析 TDesign SubmitContext
    - 修改 `src/components/form/BaseForm/BaseForm.tsx`
    - 从 SubmitContext 中提取 validateResult 和 firstError
    - 验证失败时调用 onFinishFailed
    - 验证成功时获取表单值并调用 onFinish
    - _Requirements: 1.1, 1.2, 1.3_

  - [x] 1.2 实现表单值收集机制
    - 添加 data prop 支持
    - 使用 TDesign Form 的 getFieldsValue 方法获取表单值
    - _Requirements: 1.4, 5.2_

  - [ ]\* 1.3 编写 BaseForm 提交属性测试
    - **Property 1: Form Submit Triggers onFinish**
    - **Validates: Requirements 1.1, 1.3**

  - [ ]\* 1.4 编写 BaseForm 验证失败属性测试
    - **Property 2: Form Validation Failure Triggers onFinishFailed**
    - **Validates: Requirements 1.2**

- [ ] 2. Checkpoint - 确保 BaseForm 测试通过
  - Ensure all tests pass, ask the user if questions arise.

## Phase 2: 修复 createField 工厂函数

- [x] 3. 重构 createField 函数
  - [x] 3.1 移除无效的泛型参数并优化类型定义
    - 修改 `src/components/form/utils/createField.tsx`
    - 移除 `<T = any>` 泛型参数
    - 确保 inheritAttrs: false 已设置
    - _Requirements: 2.1_

  - [x] 3.2 实现属性过滤逻辑
    - 定义 FILTERED_ATTRS 常量列表
    - 在 setup 中过滤 attrs
    - 只传递有效属性给 ProFormItem
    - _Requirements: 3.3, 3.4_

  - [x] 3.3 修复 v-model 双向绑定
    - 确保 useModel 正确工作
    - 验证值变更正确传播
    - _Requirements: 2.3, 5.3_

  - [x] 3.4 编写 createField 属性测试
    - **Property 4: createField Returns Valid Component**
    - **Validates: Requirements 2.1**

  - [ ]\* 3.5 编写属性过滤属性测试
    - **Property 5: Attribute Filtering Prevents Warnings**
    - **Validates: Requirements 3.3, 3.4**

- [ ] 4. Checkpoint - 确保 createField 测试通过
  - Ensure all tests pass, ask the user if questions arise.

## Phase 3: 修复 ProFormItem 组件

- [x] 5. 修复 ProFormItem 属性处理
  - [x] 5.1 添加属性过滤到 ProFormItem
    - 修改 `src/components/form/components/FormItem/index.tsx`
    - 在渲染前过滤不需要的属性
    - 确保单根元素正确继承属性
    - _Requirements: 3.1, 3.2, 3.3_

  - [x] 5.2 修复 FormItem 与 TDesign FormItem 的集成
    - 确保 name 属性正确传递
    - 确保 rules 属性正确传递
    - _Requirements: 5.1_

## Phase 4: 修复 ProFormSelect 组件

- [x] 6. 修复 ProFormSelect 组件
  - [x] 6.1 修复 options 渲染
    - 修改 `src/components/form/components/Select/index.tsx`
    - 确保 options 正确传递给 TDesign Select
    - _Requirements: 4.1_

  - [x] 6.2 修复 v-model 绑定
    - 确保选择值正确更新
    - 确保初始值正确显示
    - _Requirements: 4.2_

  - [x] 6.3 添加 valueEnum 支持
    - 实现 valueEnum 到 options 的转换
    - 支持 Map 和 Object 两种格式
    - _Requirements: 4.3_

  - [x] 6.4 修复 read 模式显示
    - 在 read 模式下显示选中项的 label
    - _Requirements: 4.4_

  - [ ]\* 6.5 编写 ProFormSelect 属性测试
    - **Property 6: Select Options Rendering**
    - **Validates: Requirements 4.1, 4.2**

- [ ] 7. Checkpoint - 确保 ProFormSelect 测试通过
  - Ensure all tests pass, ask the user if questions arise.

## Phase 5: 修复表单数据绑定

- [x] 8. 修复表单字段注册和值收集
  - [x] 8.1 完善 FieldContext 字段注册
    - 修改 `src/components/form/FieldContext.ts`
    - 添加字段注册/注销方法
    - 添加值收集方法
    - _Requirements: 5.1, 5.2_

  - [x] 8.2 修复表单重置功能
    - 确保 reset 方法正确重置所有字段
    - 支持重置到初始值
    - _Requirements: 5.4_

  - [ ]\* 8.3 编写表单重置属性测试
    - **Property 7: Form Reset Restores Initial Values**
    - **Validates: Requirements 5.4**

  - [ ]\* 8.4 编写 v-model 双向绑定属性测试
    - **Property 3: Field v-model Bidirectional Binding**
    - **Validates: Requirements 2.3, 5.3**

-

- [x] 9. Checkpoint - 确保表单数据绑定测试通过
  - Ensure all tests pass, ask the user if questions arise.

## Phase 6: 修复其他表单字段组件

- [x] 10. 批量修复表单字段组件
  - [x] 10.1 修复 ProFormText 组件
    - 确保 v-model 正确工作
    - 确保属性正确传递
    - _Requirements: 2.2, 2.4_

  - [x] 10.2 修复 ProFormDatePicker 组件
    - 确保日期值正确绑定
    - 确保 fieldProps 正确合并
    - _Requirements: 2.2, 2.4_

  - [x] 10.3 修复 ProFormSwitch 组件
    - 确保布尔值正确绑定
    - _Requirements: 2.2, 2.4_

  - [x] 10.4 修复 ProFormRadio 组件
    - 确保 options 正确渲染
    - 确保选中值正确更新
    - _Requirements: 2.2, 2.4_

  - [x] 10.5 修复 ProFormCheckbox 组件
    - 确保多选值正确绑定
    - _Requirements: 2.2, 2.4_

- [ ] 11. Final Checkpoint - 确保所有测试通过
  - Ensure all tests pass, ask the user if questions arise.
