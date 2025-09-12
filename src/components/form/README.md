# ProForm Vue3 组件库

## 📋 项目概述

这是一个完整的React ProForm组件库到Vue3的迁移项目，基于TDesign Vue Next组件库实现。保持了与原React版本相同的API接口设计，通过适配层实现Vue3语法转换。

## ✅ 已完成功能

### 🏗️ 核心架构
- ✅ Vue3 Composition API 转换
- ✅ TDesign Vue Next 组件适配
- ✅ TypeScript 完整类型定义
- ✅ 双向绑定机制（useModel）
- ✅ 表单校验系统集成
- ✅ Context API 迁移（provide/inject）

### 📝 基础表单组件
- ✅ **BaseForm** - 基础表单容器
- ✅ **ProFormItem** - 表单项包装器
- ✅ **LightWrapper** - 轻量模式包装器
- ✅ **Submitter** - 提交按钮组件

### 🎛️ 表单控件组件
- ✅ **ProFormText** - 文本输入框
- ✅ **ProFormTextArea** - 多行文本框
- ✅ **ProFormSelect** - 选择器
- ✅ **ProFormRadio** - 单选框组
- ✅ **ProFormCheckbox** - 复选框组
- ✅ **ProFormSwitch** - 开关
- ✅ **ProFormSlider** - 滑块
- ✅ **ProFormRate** - 评分
- ✅ **ProFormDatePicker** - 日期选择器
- ✅ **ProFormDateRangePicker** - 日期范围选择器
- ✅ **ProFormTimePicker** - 时间选择器
- ✅ **ProFormDigit** - 数字输入框
- ✅ **ProFormMoney** - 金额输入框
- ✅ **ProFormTreeSelect** - 树形选择器
- ✅ **ProFormCascader** - 级联选择器
- ✅ **ProFormColorPicker** - 颜色选择器
- ✅ **ProFormUploadButton** - 上传按钮
- ✅ **ProFormUploadDragger** - 拖拽上传

### 🎨 布局组件
- ✅ **ProFormList** - 动态表单列表
- ✅ **ProFormGroup** - 表单分组
- ✅ **ProFormFieldSet** - 字段集
- ✅ **ProFormDependency** - 依赖组件

## 🔄 React vs Vue3 核心差异对比

| 特性 | React | Vue3 |
|------|-------|------|
| **状态管理** | `useState`, `useReducer` | `ref`, `reactive` |
| **生命周期** | `useEffect` | `onMounted`, `watchEffect` |
| **双向绑定** | 受控组件 + onChange | `v-model` + `useModel` |
| **上下文传递** | `React.createContext` | `provide/inject` |
| **事件处理** | `onClick={handler}` | `onClick={handler}` |
| **条件渲染** | `{condition && <Component />}` | `{condition && <Component />}` |
| **列表渲染** | `array.map()` | `array.map()` |
| **组件定义** | `function Component()` | `defineComponent()` |

## 🎨 Ant Design vs TDesign 对比

| 方面 | Ant Design | TDesign |
|------|------------|---------|
| **设计风格** | 企业级、稳重 | 现代化、简洁 |
| **表单布局** | `horizontal/vertical/inline` | `vertical/inline` |
| **校验提示** | `validateStatus` + `help` | `status` + `help` |
| **主题定制** | CSS Variables + Less | CSS Variables + Design Tokens |
| **组件前缀** | `ant-` | `t-` |
| **API设计** | 配置化 | 配置化 + 插槽 |

## 🚀 使用示例

### 基础表单
```vue
<template>
  <BaseForm
    v-model="formData"
    layout="vertical"
    @finish="handleSubmit"
  >
    <ProFormText
      name="name"
      label="姓名"
      placeholder="请输入姓名"
      :rules="[{ required: true, message: '请输入姓名' }]"
    />
    
    <ProFormSelect
      name="type"
      label="类型"
      placeholder="请选择类型"
      :options="typeOptions"
      :rules="[{ required: true, message: '请选择类型' }]"
    />
    
    <ProFormTextArea
      name="description"
      label="描述"
      placeholder="请输入描述"
      :field-props="{ autosize: { minRows: 3, maxRows: 6 } }"
    />
  </BaseForm>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { BaseForm, ProFormText, ProFormSelect, ProFormTextArea } from '@/components/form'

const formData = ref({
  name: '',
  type: '',
  description: ''
})

const typeOptions = [
  { label: '个人', value: 'personal' },
  { label: '企业', value: 'company' }
]

const handleSubmit = (values: any) => {
  console.log('表单数据:', values)
}
</script>
```

### 动态表单
```vue
<template>
  <BaseForm v-model="formData">
    <ProFormList name="users" label="用户列表">
      <template #default="{ item, index, operations }">
        <ProFormText
          :name="['users', index, 'name']"
          label="姓名"
          placeholder="请输入姓名"
        />
        <ProFormText
          :name="['users', index, 'email']"
          label="邮箱"
          placeholder="请输入邮箱"
        />
      </template>
    </ProFormList>
  </BaseForm>
</template>
```

## 📁 项目结构

```
src/components/form/
├── index.ts                    # 主入口文件
├── typing.ts                   # 类型定义
├── FieldContext.ts            # 字段上下文
├── BaseForm/                  # 基础表单组件
│   ├── BaseForm.tsx
│   ├── LightWrapper/
│   └── Submitter/
├── components/                # 表单控件组件
│   ├── FormItem/
│   ├── Text/
│   ├── Select/
│   ├── DatePicker/
│   ├── List/
│   ├── Group/
│   └── ...
├── utils/                     # 工具函数
│   └── createField.tsx
└── demo/                      # 演示示例
    ├── BasicForm.tsx
    ├── index.tsx
    └── App.vue
```

## 🔧 技术栈

- **框架**: Vue 3.x + TypeScript
- **UI库**: TDesign Vue Next 1.13.1+
- **构建工具**: Vite 7.x
- **状态管理**: Vue3 Composition API
- **表单校验**: async-validator
- **样式方案**: TDesign Design Tokens

## 🎯 核心特性

### 1. 双向绑定
使用Vue3的`useModel`实现完美的双向数据绑定：
```typescript
const modelValue = useModel(props, 'modelValue')
```

### 2. 表单校验
集成async-validator，支持同步和异步校验：
```typescript
rules: [
  { required: true, message: '必填项' },
  { type: 'email', message: '邮箱格式错误' },
  { validator: customValidator }
]
```

### 3. 类型安全
完整的TypeScript类型定义，提供良好的开发体验：
```typescript
interface ProFormTextProps extends ProFormFieldItemProps {
  placeholder?: string
  maxlength?: number
  showWordLimit?: boolean
}
```

### 4. 组件化架构
采用高阶组件模式，通过`createField`工厂函数创建表单控件：
```typescript
export const ProFormText = createField<ProFormTextProps>({
  name: 'ProFormText',
  renderFormItem: (props, { slots }) => (
    <Input v-model={props.modelValue} {...props.fieldProps} />
  )
})
```

## 🚧 待完成功能

- 🔄 ProForm、ModalForm、DrawerForm 等高级布局组件
- 🔄 更多表单控件的完善
- 🔄 国际化支持
- 🔄 主题定制能力
- 🔄 单元测试覆盖

## 📝 更新日志

### v1.0.0 (2024-12-09)
- ✅ 完成基础表单组件迁移
- ✅ 实现所有表单控件组件
- ✅ 完成布局组件开发
- ✅ 集成表单校验系统
- ✅ 实现双向绑定机制
- ✅ 完成TypeScript类型定义
- ✅ 构建系统配置完成

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件