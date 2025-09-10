# ProField 双向数据绑定 (v-model) 使用指南

## 概述

ProField 组件全面支持 Vue 3 的双向数据绑定功能，可以通过 `v-model` 指令实现数据的双向同步。这使得 ProField 可以无缝集成到表单系统中，提供出色的用户体验。

## 核心特性

### ✅ 完整的 v-model 支持

- 支持 Vue 3.4+ 的 `defineModel` 模式
- 支持传统的 `modelValue` + `update:modelValue` 模式
- 向后兼容原有的 `value` + `update:value` 模式
- 自动触发 `change` 事件

### ✅ 多种绑定方式

```vue
<!-- 推荐：v-model 双向绑定 -->
<ProField v-model="value" valueType="text" mode="edit" />

<!-- 传统：modelValue 方式 -->
<ProField
  :modelValue="value"
  @update:modelValue="value = $event"
  valueType="text"
  mode="edit"
/>

<!-- 兼容：value 方式 -->
<ProField
  :value="value"
  @update:value="value = $event"
  valueType="text"
  mode="edit"
/>
```

## 基本用法

### 1. 文本字段双向绑定

```vue
<template>
  <div>
    <!-- 显示当前值 -->
    <p>当前值: {{ textValue }}</p>

    <!-- 只读模式显示 -->
    <ProField v-model="textValue" valueType="text" mode="read" />

    <!-- 编辑模式 - 支持双向绑定 -->
    <ProField
      v-model="textValue"
      valueType="text"
      mode="edit"
      placeholder="请输入文本"
    />
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { ProField } from 'tdesign-pro-components'

  const textValue = ref('初始文本')
</script>
```

### 2. 数字字段双向绑定

```vue
<template>
  <div>
    <p>数字值: {{ numberValue }}</p>
    <ProField
      v-model="numberValue"
      valueType="digit"
      mode="edit"
      :fieldProps="{ min: 0, max: 100, step: 1 }"
    />
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'

  const numberValue = ref(50)
</script>
```

### 3. 开关字段双向绑定

```vue
<template>
  <div>
    <p>开关状态: {{ switchValue ? '开启' : '关闭' }}</p>
    <ProField v-model="switchValue" valueType="switch" mode="edit" />
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'

  const switchValue = ref(true)
</script>
```

### 4. 选择字段双向绑定

```vue
<template>
  <div>
    <p>选择值: {{ selectValue }}</p>
    <ProField
      v-model="selectValue"
      valueType="select"
      mode="edit"
      :valueEnum="{
        option1: { text: '选项一' },
        option2: { text: '选项二' },
        option3: { text: '选项三' },
      }"
    />
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'

  const selectValue = ref('option1')
</script>
```

## 高级用法

### 1. 表单集成

```vue
<template>
  <t-form :data="formData" @submit="handleSubmit">
    <t-form-item label="用户名" name="username">
      <ProField
        v-model="formData.username"
        valueType="text"
        mode="edit"
        placeholder="请输入用户名"
      />
    </t-form-item>

    <t-form-item label="年龄" name="age">
      <ProField
        v-model="formData.age"
        valueType="digit"
        mode="edit"
        :fieldProps="{ min: 0, max: 120 }"
      />
    </t-form-item>

    <t-form-item label="状态" name="active">
      <ProField v-model="formData.active" valueType="switch" mode="edit" />
    </t-form-item>

    <t-form-item label="类型" name="type">
      <ProField
        v-model="formData.type"
        valueType="select"
        mode="edit"
        :valueEnum="typeOptions"
      />
    </t-form-item>

    <t-button type="submit">提交</t-button>
  </t-form>
</template>

<script setup lang="ts">
  import { reactive } from 'vue'
  import {
    Form as TForm,
    FormItem as TFormItem,
    Button as TButton,
  } from 'tdesign-vue-next'

  const formData = reactive({
    username: '',
    age: 0,
    active: true,
    type: 'user',
  })

  const typeOptions = {
    user: { text: '用户' },
    admin: { text: '管理员' },
    guest: { text: '访客' },
  }

  const handleSubmit = (data: typeof formData) => {
    console.log('表单数据:', data)
  }
</script>
```

### 2. 监听数据变化

```vue
<template>
  <ProField
    v-model="value"
    valueType="text"
    mode="edit"
    @change="handleChange"
  />
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue'

  const value = ref('')

  // 方式1: 监听 change 事件
  const handleChange = (newValue: string) => {
    console.log('值已改变:', newValue)
  }

  // 方式2: 使用 watch 监听
  watch(value, (newValue, oldValue) => {
    console.log('从', oldValue, '变为', newValue)
  })
</script>
```

### 3. 复杂数据类型

```vue
<template>
  <div>
    <!-- 日期范围 -->
    <ProField v-model="dateRange" valueType="dateRange" mode="edit" />

    <!-- 多选 -->
    <ProField
      v-model="multipleValues"
      valueType="checkbox"
      mode="edit"
      :valueEnum="checkboxOptions"
    />
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'

  const dateRange = ref(['2023-01-01', '2023-12-31'])
  const multipleValues = ref(['option1', 'option3'])

  const checkboxOptions = {
    option1: { text: '选项A' },
    option2: { text: '选项B' },
    option3: { text: '选项C' },
  }
</script>
```

## 实现原理

### 组件内部实现

ProField 组件内部使用了以下机制来实现双向绑定：

```typescript
// 主要实现逻辑
export const ProField = defineComponent({
  props: {
    // 传统 text 属性（只读）
    text: {
      /* ... */
    },
    // v-model 属性
    modelValue: {
      /* ... */
    },
    // 兼容旧版本
    value: {
      /* ... */
    },
  },
  emits: ['update:modelValue', 'update:value', 'change'],
  setup(props, { emit }) {
    // 计算当前值 - 优先级: modelValue > value > text
    const currentValue = computed(() => {
      if (props.modelValue !== undefined) return props.modelValue
      if (props.value !== undefined) return props.value
      return props.text
    })

    // 处理值变更
    const handleChange = (value: unknown) => {
      emit('update:modelValue', value) // v-model 更新
      emit('update:value', value) // 兼容模式
      emit('change', value) // change 事件
    }

    return { currentValue, handleChange }
  },
})
```

### 子组件实现

每个具体的 Field 组件都支持双向绑定：

```typescript
// 以 FieldText 为例
export const FieldText = defineComponent({
  props: {
    text: { /* ... */ },
    modelValue: { /* ... */ }
  },
  emits: ['update:modelValue', 'change'],
  setup(props, { emit }) {
    const currentValue = computed(() =>
      props.modelValue !== undefined ? props.modelValue : props.text
    )

    const handleInput = (value: string) => {
      emit('update:modelValue', value)
      emit('change', value)
    }

    return () => (
      <Input
        modelValue={currentValue.value}
        onUpdate:modelValue={handleInput}
      />
    )
  }
})
```

## 类型安全

ProField 的双向绑定完全支持 TypeScript：

```typescript
import { ref } from 'vue'
import type { ProFieldTextType } from 'tdesign-pro-components'

// 强类型支持
const textValue = ref<string>('初始值')
const numberValue = ref<number>(100)
const booleanValue = ref<boolean>(true)
const arrayValue = ref<string[]>(['option1'])

// 类型推断
const value = ref('auto-inferred') // 自动推断为 string
```

## 最佳实践

### 1. 推荐使用 v-model

```vue
<!-- ✅ 推荐 -->
<ProField v-model="value" valueType="text" mode="edit" />

<!-- ❌ 不推荐 -->
<ProField
  :value="value"
  @change="value = $event"
  valueType="text"
  mode="edit"
/>
```

### 2. 合理设置初始值

```vue
<script setup lang="ts">
  // ✅ 根据 valueType 设置合适的初始值
  const textValue = ref('') // text
  const numberValue = ref(0) // digit, money, percent
  const booleanValue = ref(false) // switch
  const arrayValue = ref([]) // checkbox, dateRange
  const objectValue = ref(null) // 复杂对象
</script>
```

### 3. 处理空值情况

```vue
<template>
  <ProField
    v-model="value"
    valueType="text"
    mode="edit"
    :emptyText="value ? undefined : '暂无数据'"
  />
</template>
```

### 4. 表单验证集成

```vue
<template>
  <t-form :data="formData" :rules="rules">
    <t-form-item label="用户名" name="username">
      <ProField
        v-model="formData.username"
        valueType="text"
        mode="edit"
        placeholder="请输入用户名"
      />
    </t-form-item>
  </t-form>
</template>

<script setup lang="ts">
  const rules = {
    username: [
      { required: true, message: '用户名不能为空' },
      { min: 3, max: 20, message: '用户名长度为3-20个字符' },
    ],
  }
</script>
```

## 注意事项

1. **初始值类型**：确保初始值类型与 valueType 匹配
2. **只读模式**：只读模式下不会触发双向绑定
3. **性能优化**：大量 Field 组件时考虑使用 `v-memo`
4. **事件处理**：可以同时监听 `@change` 事件和使用 `watch`

## 更新日志

### v0.1.0

- ✅ 实现完整的 v-model 双向绑定
- ✅ 支持所有 valueType 的双向绑定
- ✅ 提供 change 事件
- ✅ 向后兼容旧版本 API
- ✅ 完整的 TypeScript 类型支持

通过双向数据绑定，ProField 组件可以更好地集成到现代 Vue 应用中，提供流畅的用户交互体验。
