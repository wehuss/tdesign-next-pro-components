<script setup lang="ts">
  import { ProField } from '@/components/field'
  import { ref } from 'vue'

  // 各种类型的示例值
  const textValue = ref('Hello World')
  const passwordValue = ref('password123')
  const digitValue = ref(12345)
  const moneyValue = ref(99999.99)
  const percentValue = ref(0.856)
  const dateValue = ref('2024-01-15')
  const dateTimeValue = ref('2024-01-15 14:30:00')
  const timeValue = ref('14:30:00')
  const selectValue = ref('active')
  const switchValue = ref(true)
  const rateValue = ref(4)
  const progressValue = ref(75)
  const codeValue = ref('{ "name": "test", "value": 123 }')
  const imageValue = ref('https://tdesign.gtimg.com/site/avatar.jpg')
  const colorValue = ref('#0052d9')
  const secondValue = ref(3661)
  const fromNowValue = ref('2024-01-10 10:00:00')
  const indexValue = ref(1)

  const statusEnum = {
    active: { text: '启用', status: 'success' },
    inactive: { text: '禁用', status: 'error' },
    pending: { text: '待审核', status: 'warning' },
  }
</script>

<template>
  <t-space direction="vertical" size="large" style="width: 100%">
    <t-row :gutter="[16, 16]">
      <!-- 文本类 -->
      <t-col :span="6">
        <div class="field-item">
          <span class="field-label">text 文本</span>
          <ProField :modelValue="textValue" valueType="text" mode="read" />
        </div>
      </t-col>

      <t-col :span="6">
        <div class="field-item">
          <span class="field-label">password 密码</span>
          <ProField
            :modelValue="passwordValue"
            valueType="password"
            mode="read"
          />
        </div>
      </t-col>

      <!-- 数字类 -->
      <t-col :span="6">
        <div class="field-item">
          <span class="field-label">digit 数字</span>
          <ProField :modelValue="digitValue" valueType="digit" mode="read" />
        </div>
      </t-col>

      <t-col :span="6">
        <div class="field-item">
          <span class="field-label">money 金额</span>
          <ProField :modelValue="moneyValue" valueType="money" mode="read" />
        </div>
      </t-col>

      <t-col :span="6">
        <div class="field-item">
          <span class="field-label">percent 百分比</span>
          <ProField
            :modelValue="percentValue"
            valueType="percent"
            mode="read"
          />
        </div>
      </t-col>

      <!-- 日期时间类 -->
      <t-col :span="6">
        <div class="field-item">
          <span class="field-label">date 日期</span>
          <ProField :modelValue="dateValue" valueType="date" mode="read" />
        </div>
      </t-col>

      <t-col :span="6">
        <div class="field-item">
          <span class="field-label">dateTime 日期时间</span>
          <ProField
            :modelValue="dateTimeValue"
            valueType="dateTime"
            mode="read"
          />
        </div>
      </t-col>

      <t-col :span="6">
        <div class="field-item">
          <span class="field-label">time 时间</span>
          <ProField :modelValue="timeValue" valueType="time" mode="read" />
        </div>
      </t-col>

      <t-col :span="6">
        <div class="field-item">
          <span class="field-label">fromNow 相对时间</span>
          <ProField
            :modelValue="fromNowValue"
            valueType="fromNow"
            mode="read"
          />
        </div>
      </t-col>

      <t-col :span="6">
        <div class="field-item">
          <span class="field-label">second 秒数</span>
          <ProField :modelValue="secondValue" valueType="second" mode="read" />
        </div>
      </t-col>

      <!-- 选择类 -->
      <t-col :span="6">
        <div class="field-item">
          <span class="field-label">select 选择</span>
          <ProField
            :modelValue="selectValue"
            valueType="select"
            :valueEnum="statusEnum"
            mode="read"
          />
        </div>
      </t-col>

      <t-col :span="6">
        <div class="field-item">
          <span class="field-label">switch 开关</span>
          <ProField :modelValue="switchValue" valueType="switch" mode="read" />
        </div>
      </t-col>

      <!-- 展示类 -->
      <t-col :span="6">
        <div class="field-item">
          <span class="field-label">rate 评分</span>
          <ProField :modelValue="rateValue" valueType="rate" mode="read" />
        </div>
      </t-col>

      <t-col :span="6">
        <div class="field-item">
          <span class="field-label">progress 进度</span>
          <ProField
            :modelValue="progressValue"
            valueType="progress"
            mode="read"
          />
        </div>
      </t-col>

      <t-col :span="6">
        <div class="field-item">
          <span class="field-label">color 颜色</span>
          <ProField :modelValue="colorValue" valueType="color" mode="read" />
        </div>
      </t-col>

      <t-col :span="6">
        <div class="field-item">
          <span class="field-label">image 图片</span>
          <ProField :modelValue="imageValue" valueType="image" mode="read" />
        </div>
      </t-col>

      <t-col :span="6">
        <div class="field-item">
          <span class="field-label">index 序号</span>
          <ProField :modelValue="indexValue" valueType="index" mode="read" />
        </div>
      </t-col>

      <t-col :span="6">
        <div class="field-item">
          <span class="field-label">indexBorder 带边框序号</span>
          <ProField
            :modelValue="indexValue"
            valueType="indexBorder"
            mode="read"
          />
        </div>
      </t-col>

      <t-col :span="12">
        <div class="field-item">
          <span class="field-label">code 代码</span>
          <ProField :modelValue="codeValue" valueType="code" mode="read" />
        </div>
      </t-col>
    </t-row>
  </t-space>
</template>

<style scoped>
  .field-item {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 12px;
    background: var(--td-bg-color-container);
    border-radius: 6px;
  }

  .field-label {
    font-size: 12px;
    color: var(--td-text-color-secondary);
  }
</style>
