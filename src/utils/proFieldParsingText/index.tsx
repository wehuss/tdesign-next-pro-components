/**
 * ProField 解析文本工具函数
 * 移植自 ant-design/pro-components/src/utils/proFieldParsingText/index.tsx
 * 适配 TDesign Vue Next
 */
import { Space, Tag } from 'tdesign-vue-next'
import type { CSSProperties, VNodeChild } from 'vue'
import { h } from 'vue'
import type { ProFieldValueEnumMap, ProFieldValueEnumType } from '../../components/field/types'

/**
 * 获取类型的 type
 *
 * @param obj
 */
function getType(obj: any) {
  const type = Object.prototype.toString
    .call(obj)
    .match(/^\[object (.*)\]$/)?.[1]
    .toLowerCase()
  if (type === 'string' && typeof obj === 'object') return 'object' // Let "new String('')" return 'object'
  if (obj === null) return 'null' // PhantomJS has type "DOMWindow" for null
  if (obj === undefined) return 'undefined' // PhantomJS has type "DOMWindow" for undefined
  return type
}

type StatusProps = {
  class?: string
  style?: CSSProperties
  children?: VNodeChild
}

export const ProFieldTagColor = ({ color, children }: StatusProps & { color: string }) =>
  h(Tag, { color }, () => children)

export const objectToMap = (value: ProFieldValueEnumType | undefined): ProFieldValueEnumMap => {
  if (getType(value) === 'map') {
    return value as ProFieldValueEnumMap
  }
  return new Map(Object.entries(value || {}))
}

const TableStatus: {
  Success: (props: StatusProps) => any
  Danger: (props: StatusProps) => any
  Primary: (props: StatusProps) => any
  Default: (props: StatusProps) => any
  Warning: (props: StatusProps) => any
  success: (props: StatusProps) => any
  danger: (props: StatusProps) => any
  primary: (props: StatusProps) => any
  default: (props: StatusProps) => any
  warning: (props: StatusProps) => any
} = {
  Success: ({ children }) => h(Tag, { theme: 'success' }, () => children),
  Danger: ({ children }) => h(Tag, { theme: 'danger' }, () => children),
  Default: ({ children }) => h(Tag, { theme: 'default' }, () => children),
  Primary: ({ children }) => h(Tag, { theme: 'primary' }, () => children),
  Warning: ({ children }) => h(Tag, { theme: 'warning' }, () => children),
  success: ({ children }) => h(Tag, { theme: 'success' }, () => children),
  danger: ({ children }) => h(Tag, { theme: 'danger' }, () => children),
  default: ({ children }) => h(Tag, { theme: 'default' }, () => children),
  primary: ({ children }) => h(Tag, { theme: 'primary' }, () => children),
  warning: ({ children }) => h(Tag, { theme: 'warning' }, () => children),
}

type ProFieldStatusType =
  | 'success'
  | 'warning'
  | 'error'
  | 'default'
  | 'primary'
  | 'Success'
  | 'Danger'
  | 'Primary'
  | 'Default'
  | 'Warning'

/**
 * 转化 text 和 valueEnum 通过 type 来添加 Status
 *
 * @param text
 * @param valueEnum
 * @param key 用于 Vue key
 */
export const proFieldParsingText = (
  text: string | number | (string | number)[],
  valueEnumParams: ProFieldValueEnumType,
  key?: number | string,
): VNodeChild => {
  if (Array.isArray(text)) {
    return h(Space, { key, split: ',', size: 'small', wrap: true }, () =>
      text.map((value, index) => proFieldParsingText(value, valueEnumParams, index)),
    )
  }

  const valueEnum = objectToMap(valueEnumParams)

  if (!valueEnum.has(text) && !valueEnum.has(`${text}`)) {
    return (text as any)?.label || text
  }

  const domText = (valueEnum.get(text) || valueEnum.get(`${text}`)) as {
    text: VNodeChild
    theme: ProFieldStatusType
    color?: string
  }

  if (!domText) {
    return (text as any)?.label || text
  }

  const { theme, color } = domText

  const Status = TableStatus[theme as keyof typeof TableStatus]

  // 如果类型存在优先使用类型
  if (Status) {
    return Status({ children: domText.text })
  }

  // 如果不存在使用颜色
  if (color) {
    return ProFieldTagColor({
      color,
      children: domText.text,
    })
  }

  // 什么都没有使用 text
  return domText.text || (domText as any)
}
