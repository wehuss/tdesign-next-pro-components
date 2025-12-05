# ProField 高级字段

ProField 是一个智能字段渲染组件，可以根据 `valueType` 自动选择合适的组件进行渲染，支持阅读模式和编辑模式的切换。

## 基础用法

ProField 会根据 `valueType` 自动渲染对应的组件：

<DemoContainer title="基础用法">
  <ProFieldBasic />
</DemoContainer>

::: details 查看代码

```vue
<script setup lang="ts">
  import { ref } from 'vue'
  import { ProField } from 'tdesign-pro-components'

  const textValue = ref('Hello World')
  const moneyValue = ref(12345.67)
  const dateValue = ref('2024-01-15')
  const percentValue = ref(0.85)
  const digitValue = ref(100)
</script>

<template>
  <t-space direction="vertical" size="large">
    <t-space align="center">
      <span>文本：</span>
      <ProField :modelValue="textValue" valueType="text" mode="read" />
    </t-space>

    <t-space align="center">
      <span>金额：</span>
      <ProField :modelValue="moneyValue" valueType="money" mode="read" />
    </t-space>

    <t-space align="center">
      <span>日期：</span>
      <ProField :modelValue="dateValue" valueType="date" mode="read" />
    </t-space>

    <t-space align="center">
      <span>百分比：</span>
      <ProField :modelValue="percentValue" valueType="percent" mode="read" />
    </t-space>

    <t-space align="center">
      <span>数字：</span>
      <ProField :modelValue="digitValue" valueType="digit" mode="read" />
    </t-space>
  </t-space>
</template>
```

:::

## 支持的 valueType

ProField 支持丰富的字段类型，以下是所有类型的展示：

<DemoContainer title="全部类型展示">
  <ProFieldAllTypes />
</DemoContainer>

### valueType 列表

| valueType     | 说明       | 编辑组件        |
| ------------- | ---------- | --------------- |
| `text`        | 文本       | Input           |
| `password`    | 密码       | Input.Password  |
| `textarea`    | 多行文本   | Textarea        |
| `digit`       | 数字       | InputNumber     |
| `money`       | 金额       | InputNumber     |
| `percent`     | 百分比     | InputNumber     |
| `date`        | 日期       | DatePicker      |
| `dateTime`    | 日期时间   | DatePicker      |
| `dateRange`   | 日期范围   | DateRangePicker |
| `time`        | 时间       | TimePicker      |
| `select`      | 下拉选择   | Select          |
| `checkbox`    | 多选框     | Checkbox        |
| `radio`       | 单选框     | Radio           |
| `switch`      | 开关       | Switch          |
| `rate`        | 评分       | Rate            |
| `slider`      | 滑块       | Slider          |
| `progress`    | 进度条     | Progress        |
| `code`        | 代码       | -               |
| `image`       | 图片       | -               |
| `color`       | 颜色       | ColorPicker     |
| `cascader`    | 级联选择   | Cascader        |
| `treeSelect`  | 树选择     | TreeSelect      |
| `second`      | 秒数       | -               |
| `fromNow`     | 相对时间   | -               |
| `index`       | 序号       | -               |
| `indexBorder` | 带边框序号 | -               |

## 阅读模式与编辑模式

通过 `mode` 属性控制字段的显示模式：

<DemoContainer title="模式切换">
  <ProFieldMode />
</DemoContainer>

::: details 查看代码

```vue
<script setup lang="ts">
  import { ref } from 'vue'
  import { ProField } from 'tdesign-pro-components'

  const value = ref('示例文本')
  const mode = ref<'read' | 'edit'>('read')
</script>

<template>
  <t-space direction="vertical">
    <t-radio-group v-model="mode">
      <t-radio-button value="read">阅读模式</t-radio-button>
      <t-radio-button value="edit">编辑模式</t-radio-button>
    </t-radio-group>

    <ProField v-model="value" valueType="text" :mode="mode" />
  </t-space>
</template>
```

:::

## 枚举值映射

对于 `select`、`radio`、`checkbox` 等类型，可以通过 `valueEnum` 定义选项：

<DemoContainer title="枚举值映射">
  <ProFieldValueEnum />
</DemoContainer>

::: details 查看代码

```vue
<script setup lang="ts">
  import { ref } from 'vue'
  import { ProField } from 'tdesign-pro-components'

  const status = ref('active')

  const valueEnum = {
    active: { text: '启用', status: 'success' },
    inactive: { text: '禁用', status: 'error' },
    pending: { text: '待审核', status: 'warning' },
  }
</script>

<template>
  <ProField
    v-model="status"
    valueType="select"
    :valueEnum="valueEnum"
    mode="read"
  />
</template>
```

:::

## 金额格式化

`money` 类型支持自动格式化和货币符号：

<DemoContainer title="金额格式化">
  <ProFieldMoney />
</DemoContainer>

::: details 查看代码

```vue
<script setup lang="ts">
  import { ref } from 'vue'
  import { ProField } from 'tdesign-pro-components'

  const amount = ref(1234567.89)
</script>

<template>
  <t-space direction="vertical">
    <!-- 默认人民币 -->
    <ProField :value="amount" valueType="money" mode="read" />

    <!-- 美元 -->
    <ProField
      :value="amount"
      valueType="money"
      mode="read"
      :fieldProps="{ currency: '$' }"
    />

    <!-- 欧元 -->
    <ProField
      :value="amount"
      valueType="money"
      mode="read"
      :fieldProps="{ currency: '€' }"
    />
  </t-space>
</template>
```

:::

## 日期格式化

日期类型支持自定义格式：

<DemoContainer title="日期格式化">
  <ProFieldDate />
</DemoContainer>

::: details 查看代码

```vue
<script setup lang="ts">
  import { ref } from 'vue'
  import { ProField } from 'tdesign-pro-components'

  const date = ref('2024-01-15 14:30:00')
</script>

<template>
  <t-space direction="vertical">
    <!-- 日期 -->
    <ProField :value="date" valueType="date" mode="read" />

    <!-- 日期时间 -->
    <ProField :value="date" valueType="dateTime" mode="read" />

    <!-- 相对时间 -->
    <ProField :value="date" valueType="fromNow" mode="read" />
  </t-space>
</template>
```

:::

## API

### Props

| 属性            | 说明                 | 类型                            | 默认值   |
| --------------- | -------------------- | ------------------------------- | -------- |
| value / v-model | 字段值               | `any`                           | -        |
| valueType       | 字段类型             | `string`                        | `'text'` |
| mode            | 显示模式             | `'read' \| 'edit'`              | `'read'` |
| valueEnum       | 枚举值映射           | `Record<string, ValueEnumItem>` | -        |
| fieldProps      | 传递给底层组件的属性 | `object`                        | -        |
| render          | 自定义渲染函数       | `(value, props) => VNode`       | -        |
| renderFormItem  | 自定义编辑组件渲染   | `(value, props) => VNode`       | -        |
| text            | 显示文本（阅读模式） | `string`                        | -        |
| emptyText       | 空值显示文本         | `string`                        | `'-'`    |

### ValueEnumItem

```ts
interface ValueEnumItem {
  text: string
  status?: 'success' | 'error' | 'warning' | 'default' | 'processing'
  disabled?: boolean
}
```
