<script setup lang="ts">
import {
  ProForm,
  ProFormDependency,
  ProFormDigit,
  ProFormSelect,
  ProFormSwitch,
  ProFormText,
  ProFormTextArea,
} from '@/components/form'
import { MessagePlugin } from 'tdesign-vue-next'
import { h, ref } from 'vue'

const formRef = ref()
const formData = ref({
  userType: 'personal',
  hasCompany: false,
  country: '',
  province: '',
})

const handleFinish = (values: any) => {
  console.log('表单数据:', values)
  MessagePlugin.success('提交成功')
}

// 省份数据
const provinceOptions: Record<string, Array<{ label: string; value: string }>> = {
  china: [
    { label: '北京', value: 'beijing' },
    { label: '上海', value: 'shanghai' },
    { label: '广东', value: 'guangdong' },
    { label: '浙江', value: 'zhejiang' },
  ],
  usa: [
    { label: '加利福尼亚', value: 'california' },
    { label: '纽约', value: 'newyork' },
    { label: '德克萨斯', value: 'texas' },
  ],
  japan: [
    { label: '东京', value: 'tokyo' },
    { label: '大阪', value: 'osaka' },
    { label: '京都', value: 'kyoto' },
  ],
}

// 根据用户类型获取不同的字段配置
const getUserTypeFields = (userType: string) => {
  if (userType === 'enterprise') {
    return {
      showCompanyFields: true,
      label: '企业名称',
      placeholder: '请输入企业名称',
    }
  }
  return {
    showCompanyFields: false,
    label: '姓名',
    placeholder: '请输入姓名',
  }
}
</script>

<template>
  <ProForm ref="formRef" @finish="handleFinish">
    <!-- 基础联动：根据用户类型显示不同字段 -->
    <ProFormSelect
      name="userType"
      label="用户类型"
      v-model="formData.userType"
      :field-props="{ placeholder: '请选择用户类型' }"
      :options="[
        { label: '个人用户', value: 'personal' },
        { label: '企业用户', value: 'enterprise' },
      ]"
    />

    <!-- 使用 ProFormDependency 实现联动 -->
    <ProFormDependency
      :name="['userType']"
      :children="
        (values: Record<string, any>) => {
          const config = getUserTypeFields(values.userType)
          return h(ProFormText, {
            name: 'name',
            label: config.label,
            fieldProps: { placeholder: config.placeholder },
            rules: [{ required: true, message: `请输入${config.label}` }],
          })
        }
      "
    />

    <!-- 企业用户显示额外字段 -->
    <ProFormDependency
      :name="['userType']"
      :children="
        (values: Record<string, any>) => {
          if (values.userType === 'enterprise') {
            return [
              h(ProFormText, {
                name: 'taxNumber',
                label: '税号',
                fieldProps: { placeholder: '请输入企业税号' },
              }),
              h(ProFormDigit, {
                name: 'employeeCount',
                label: '员工人数',
                fieldProps: { placeholder: '请输入员工人数', min: 1 },
              }),
            ]
          }
          return null
        }
      "
    />

    <!-- 开关联动：控制是否显示公司信息 -->
    <ProFormSwitch name="hasCompany" label="是否有公司" v-model="formData.hasCompany" />

    <ProFormDependency
      :name="['hasCompany']"
      :children="
        (values: Record<string, any>) => {
          if (values.hasCompany) {
            return h(ProFormText, {
              name: 'companyName',
              label: '公司名称',
              fieldProps: { placeholder: '请输入公司名称' },
            })
          }
          return null
        }
      "
    />

    <!-- 级联联动：国家 -> 省份 -->
    <ProFormSelect
      name="country"
      label="国家"
      v-model="formData.country"
      :field-props="{ placeholder: '请选择国家' }"
      :options="[
        { label: '中国', value: 'china' },
        { label: '美国', value: 'usa' },
        { label: '日本', value: 'japan' },
      ]"
    />

    <ProFormDependency
      :name="['country']"
      :children="
        (values: Record<string, any>) => {
          const options = provinceOptions[values.country] || []
          return h(ProFormSelect, {
            name: 'province',
            label: '省份/州',
            fieldProps: {
              placeholder: values.country ? '请选择省份/州' : '请先选择国家',
              disabled: !values.country,
            },
            options: options,
          })
        }
      "
    />

    <!-- 多字段联动：根据多个字段值计算 -->
    <ProFormDigit name="price" label="单价" :field-props="{ placeholder: '请输入单价', min: 0 }" />

    <ProFormDigit
      name="quantity"
      label="数量"
      :field-props="{ placeholder: '请输入数量', min: 1 }"
    />

    <ProFormDependency
      :name="['price', 'quantity']"
      :children="
        (values: Record<string, any>) => {
          const total = (values.price || 0) * (values.quantity || 0)
          return h(
            'div',
            {
              style: {
                marginBottom: '16px',
                padding: '8px',
                background: '#f5f5f5',
                borderRadius: '4px',
              },
            },
            `总价: ¥${total.toFixed(2)}`,
          )
        }
      "
    />

    <!-- 条件验证：根据其他字段值决定是否必填 -->
    <ProFormSelect
      name="contactMethod"
      label="联系方式"
      :field-props="{ placeholder: '请选择联系方式' }"
      :options="[
        { label: '邮箱', value: 'email' },
        { label: '电话', value: 'phone' },
        { label: '微信', value: 'wechat' },
      ]"
    />

    <ProFormDependency
      :name="['contactMethod']"
      :children="
        (values: Record<string, any>) => {
          const method = values.contactMethod
          if (method === 'email') {
            return h(ProFormText, {
              name: 'contactValue',
              label: '邮箱地址',
              fieldProps: { placeholder: '请输入邮箱地址' },
              rules: [
                { required: true, message: '请输入邮箱地址' },
                { email: true, message: '请输入有效的邮箱地址' },
              ],
            })
          } else if (method === 'phone') {
            return h(ProFormText, {
              name: 'contactValue',
              label: '电话号码',
              fieldProps: { placeholder: '请输入电话号码' },
              rules: [
                { required: true, message: '请输入电话号码' },
                { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号' },
              ],
            })
          } else if (method === 'wechat') {
            return h(ProFormText, {
              name: 'contactValue',
              label: '微信号',
              fieldProps: { placeholder: '请输入微信号' },
              rules: [{ required: true, message: '请输入微信号' }],
            })
          }
          return null
        }
      "
    />

    <!-- 备注 -->
    <ProFormTextArea
      name="remark"
      label="备注"
      :field-props="{
        placeholder: '请输入备注信息',
        autosize: { minRows: 2, maxRows: 4 },
      }"
    />
  </ProForm>
</template>
