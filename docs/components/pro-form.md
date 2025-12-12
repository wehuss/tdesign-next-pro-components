# ProForm 高级表单

ProForm 是基于 TDesign Form 封装的高级表单组件，提供了更便捷的表单开发体验。它内置了丰富的表单项组件，支持表单联动、动态表单、表单验证等功能。

## 基础用法

ProForm 提供了一系列预设的表单项组件，可以快速构建表单：

<DemoContainer title="基础用法">
  <ProFormBasic />
</DemoContainer>

::: details 查看代码
<<< @/.vitepress/demos/pro-form/Basic.vue
:::

## 表单项组件

ProForm 提供了丰富的表单项组件，涵盖文本输入、数字输入、选择类、日期时间、级联选择等多种类型：

<DemoContainer title="表单项组件">
  <ProFormFormItems />
</DemoContainer>

::: details 查看代码
<<< @/.vitepress/demos/pro-form/FormItems.vue
:::

## 文本输入

### ProFormText 文本框

<DemoContainer title="文本框">
  <ProFormTextDemo />
</DemoContainer>

::: details 查看代码
<<< @/.vitepress/demos/pro-form/TextDemo.vue
:::

### ProFormTextArea 多行文本

<DemoContainer title="多行文本">
  <ProFormTextAreaDemo />
</DemoContainer>

::: details 查看代码
<<< @/.vitepress/demos/pro-form/TextAreaDemo.vue
:::

### ProFormPassword 密码框

<DemoContainer title="密码框">
  <ProFormPasswordDemo />
</DemoContainer>

::: details 查看代码
<<< @/.vitepress/demos/pro-form/PasswordDemo.vue
:::

## 数字输入

### ProFormDigit 数字输入框

<DemoContainer title="数字输入框">
  <ProFormDigitDemo />
</DemoContainer>

::: details 查看代码
<<< @/.vitepress/demos/pro-form/DigitDemo.vue
:::

### ProFormMoney 金额输入

<DemoContainer title="金额输入">
  <ProFormMoneyDemo />
</DemoContainer>

::: details 查看代码
<<< @/.vitepress/demos/pro-form/MoneyDemo.vue
:::

### ProFormSlider 滑块

<DemoContainer title="滑块">
  <ProFormSliderDemo />
</DemoContainer>

::: details 查看代码
<<< @/.vitepress/demos/pro-form/SliderDemo.vue
:::

## 选择类组件

### ProFormSelect 下拉选择

<DemoContainer title="下拉选择">
  <ProFormSelectDemo />
</DemoContainer>

::: details 查看代码
<<< @/.vitepress/demos/pro-form/SelectDemo.vue
:::

### ProFormRadio 单选框

<DemoContainer title="单选框">
  <ProFormRadioDemo />
</DemoContainer>

::: details 查看代码
<<< @/.vitepress/demos/pro-form/RadioDemo.vue
:::

### ProFormCheckbox 复选框

<DemoContainer title="复选框">
  <ProFormCheckboxDemo />
</DemoContainer>

::: details 查看代码
<<< @/.vitepress/demos/pro-form/CheckboxDemo.vue
:::

### ProFormSegmented 分段控制器

<DemoContainer title="分段控制器">
  <ProFormSegmentedDemo />
</DemoContainer>

::: details 查看代码
<<< @/.vitepress/demos/pro-form/SegmentedDemo.vue
:::

### ProFormSwitch 开关

<DemoContainer title="开关">
  <ProFormSwitchDemo />
</DemoContainer>

::: details 查看代码
<<< @/.vitepress/demos/pro-form/SwitchDemo.vue
:::

### ProFormRate 评分

<DemoContainer title="评分">
  <ProFormRateDemo />
</DemoContainer>

::: details 查看代码
<<< @/.vitepress/demos/pro-form/RateDemo.vue
:::

## 级联与树选择

### ProFormCascader 级联选择

<DemoContainer title="级联选择">
  <ProFormCascaderDemo />
</DemoContainer>

::: details 查看代码
<<< @/.vitepress/demos/pro-form/CascaderDemo.vue
:::

### ProFormTreeSelect 树选择

<DemoContainer title="树选择">
  <ProFormTreeSelectDemo />
</DemoContainer>

::: details 查看代码
<<< @/.vitepress/demos/pro-form/TreeSelectDemo.vue
:::

## 日期时间

### ProFormDatePicker 日期选择

<DemoContainer title="日期选择">
  <ProFormDatePickerDemo />
</DemoContainer>

::: details 查看代码
<<< @/.vitepress/demos/pro-form/DatePickerDemo.vue
:::

### ProFormDateRangePicker 日期范围选择

<DemoContainer title="日期范围选择">
  <ProFormDateRangePickerDemo />
</DemoContainer>

::: details 查看代码
<<< @/.vitepress/demos/pro-form/DateRangePickerDemo.vue
:::

### ProFormTimePicker 时间选择

<DemoContainer title="时间选择">
  <ProFormTimePickerDemo />
</DemoContainer>

::: details 查看代码
<<< @/.vitepress/demos/pro-form/TimePickerDemo.vue
:::

## 其他组件

### ProFormColorPicker 颜色选择

<DemoContainer title="颜色选择">
  <ProFormColorPickerDemo />
</DemoContainer>

::: details 查看代码
<<< @/.vitepress/demos/pro-form/ColorPickerDemo.vue
:::

### ProFormCaptcha 验证码

<DemoContainer title="验证码">
  <ProFormCaptchaDemo />
</DemoContainer>

::: details 查看代码
<<< @/.vitepress/demos/pro-form/CaptchaDemo.vue
:::

## 表单布局

使用 `ProFormGroup` 实现分组布局，支持水平、垂直方向，以及可折叠功能：

<DemoContainer title="表单布局">
  <ProFormLayout />
</DemoContainer>

::: details 查看代码
<<< @/.vitepress/demos/pro-form/Layout.vue
:::

## 表单联动

使用 `ProFormDependency` 实现字段联动，支持根据其他字段值动态显示/隐藏字段、动态修改验证规则等：

<DemoContainer title="表单联动">
  <ProFormDependency />
</DemoContainer>

::: details 查看代码
<<< @/.vitepress/demos/pro-form/Dependency.vue
:::

## 动态表单

使用 `ProFormList` 实现动态增减表单项，支持排序、复制、最大/最小数量限制等功能：

<DemoContainer title="动态表单（基础）">
  <ProFormList />
</DemoContainer>

::: details 查看代码
<<< @/.vitepress/demos/pro-form/List.vue
:::

### 复杂动态表单

支持更复杂的动态表单场景，如多字段组合、嵌套结构等：

<DemoContainer title="动态表单（复杂）">
  <ProFormDynamicForm />
</DemoContainer>

::: details 查看代码
<<< @/.vitepress/demos/pro-form/DynamicForm.vue
:::

## 表单验证

ProForm 支持 TDesign Form 的所有验证规则，包括必填、格式、长度、自定义验证等：

<DemoContainer title="表单验证">
  <ProFormValidation />
</DemoContainer>

::: details 查看代码
<<< @/.vitepress/demos/pro-form/Validation.vue
:::

## 只读模式

通过 `readonly` 属性可以将表单切换为只读模式，适用于详情展示场景：

<DemoContainer title="只读模式">
  <ProFormReadonly />
</DemoContainer>

::: details 查看代码
<<< @/.vitepress/demos/pro-form/Readonly.vue
:::

## API

### ProForm Props

| 属性           | 说明         | 类型                      | 默认值  |
| -------------- | ------------ | ------------------------- | ------- |
| initialValues  | 初始值       | `object`                  | -       |
| onFinish       | 提交成功回调 | `(values) => void`        | -       |
| onFinishFailed | 提交失败回调 | `(errors) => void`        | -       |
| submitter      | 提交按钮配置 | `false \| SubmitterProps` | -       |
| readonly       | 只读模式     | `boolean`                 | `false` |
| grid           | 开启栅格布局 | `boolean`                 | `false` |

### 通用表单项 Props

所有 ProForm 表单项组件都支持以下属性：

| 属性       | 说明                 | 类型                                     | 默认值  |
| ---------- | -------------------- | ---------------------------------------- | ------- |
| name       | 字段名               | `string \| string[]`                     | -       |
| label      | 标签                 | `string`                                 | -       |
| rules      | 验证规则             | `FormRule[]`                             | -       |
| tooltip    | 提示信息             | `string`                                 | -       |
| readonly   | 只读                 | `boolean`                                | `false` |
| width      | 宽度                 | `number \| 'sm' \| 'md' \| 'lg' \| 'xl'` | -       |
| fieldProps | 传递给底层组件的属性 | `object`                                 | -       |

### SubmitterProps

| 属性              | 说明         | 类型                    | 默认值   |
| ----------------- | ------------ | ----------------------- | -------- |
| submitText        | 提交按钮文字 | `string`                | `'提交'` |
| resetText         | 重置按钮文字 | `string`                | `'重置'` |
| submitButtonProps | 提交按钮属性 | `ButtonProps`           | -        |
| resetButtonProps  | 重置按钮属性 | `ButtonProps`           | -        |
| render            | 自定义渲染   | `(props, dom) => VNode` | -        |

### ProFormGroup Props

| 属性        | 说明       | 类型                             | 默认值         |
| ----------- | ---------- | -------------------------------- | -------------- |
| title       | 分组标题   | `string`                         | -              |
| direction   | 排列方向   | `'horizontal' \| 'vertical'`     | `'horizontal'` |
| wrap        | 是否换行   | `boolean`                        | `false`        |
| collapsible | 是否可折叠 | `boolean`                        | `false`        |
| size        | 间距大小   | `'small' \| 'medium' \| 'large'` | `'medium'`     |

### ProFormList Props

| 属性                | 说明             | 类型                 | 默认值     |
| ------------------- | ---------------- | -------------------- | ---------- |
| name                | 字段名           | `string \| string[]` | -          |
| label               | 标签             | `string`             | -          |
| min                 | 最小行数         | `number`             | `0`        |
| max                 | 最大行数         | `number`             | `Infinity` |
| creatorButtonProps  | 新增按钮配置     | `object \| false`    | -          |
| creatorRecord       | 新增行默认数据   | `object \| function` | -          |
| arrowSort           | 是否显示排序箭头 | `boolean`            | `false`    |
| copyIconProps       | 复制按钮配置     | `object \| false`    | -          |
| alwaysShowItemLabel | 是否始终显示标签 | `boolean`            | `false`    |

### ProFormDependency Props

| 属性     | 说明         | 类型                                     | 默认值 |
| -------- | ------------ | ---------------------------------------- | ------ |
| name     | 依赖的字段名 | `string[]`                               | -      |
| children | 渲染函数     | `(values: Record<string, any>) => VNode` | -      |

### ProFormCaptcha Props

| 属性         | 说明           | 类型     | 默认值 |
| ------------ | -------------- | -------- | ------ |
| captchaProps | 验证码按钮配置 | `object` | -      |

#### captchaProps

| 属性         | 说明           | 类型                      | 默认值         |
| ------------ | -------------- | ------------------------- | -------------- |
| onGetCaptcha | 获取验证码回调 | `(phone: string) => void` | -              |
| countDown    | 倒计时秒数     | `number`                  | `60`           |
| buttonText   | 按钮文字       | `string`                  | `'获取验证码'` |

## 表单项组件列表

| 组件名                 | 说明         |
| ---------------------- | ------------ |
| ProFormText            | 文本框       |
| ProFormTextArea        | 多行文本     |
| ProFormPassword        | 密码框       |
| ProFormDigit           | 数字输入框   |
| ProFormMoney           | 金额输入     |
| ProFormSelect          | 下拉选择     |
| ProFormRadio           | 单选框       |
| ProFormCheckbox        | 复选框       |
| ProFormSwitch          | 开关         |
| ProFormRate            | 评分         |
| ProFormSlider          | 滑块         |
| ProFormSegmented       | 分段控制器   |
| ProFormCascader        | 级联选择     |
| ProFormTreeSelect      | 树选择       |
| ProFormDatePicker      | 日期选择     |
| ProFormDateRangePicker | 日期范围选择 |
| ProFormTimePicker      | 时间选择     |
| ProFormTimeRangePicker | 时间范围选择 |
| ProFormColorPicker     | 颜色选择     |
| ProFormCaptcha         | 验证码       |
| ProFormGroup           | 表单分组     |
| ProFormList            | 动态表单     |
| ProFormDependency      | 表单联动     |
