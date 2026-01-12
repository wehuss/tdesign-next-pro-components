/**
 * 单元格渲染为表单项工具函数
 * 移植自 ant-design/pro-components 适配 TDesign Vue Next
 * 简化版：仅支持只读模式渲染
 */
import type { TableRowData } from 'tdesign-vue-next'
import type { VNode } from 'vue'
import { computed, defineComponent } from 'vue'
import { ProField } from '../../field'
import type { ProFieldValueType } from '../../field/types'
import type { ProTableColumn } from '../types'

/** 显示空文本的值列表 */
const SHOW_EMPTY_TEXT_LIST = ['', null, undefined]

/**
 * 单元格渲染为表单项的属性接口
 */
export interface CellRenderToFormItemProps<T extends TableRowData = TableRowData> {
  /** 单元格文本值 */
  text: string | number | (string | number)[]
  /** 值类型 */
  valueType: ProFieldValueType | ((record?: T, type?: string) => ProFieldValueType)
  /** 行索引 */
  index: number
  /** 行数据 */
  rowData?: T
  /** 空值显示文本 */
  columnEmptyText?: string
  /** 列配置 */
  columnProps?: ProTableColumn<T> & {
    entity?: T // 兼容性处理
  }
  /** 类型：表格或表单 */
  type?: 'table' | 'form'
}

/**
 * 获取字段属性或表单项属性
 * 支持函数形式的属性配置
 *
 * @param props 属性配置（可以是对象或函数）
 * @param args 传递给函数的参数
 * @returns 解析后的属性对象
 */
export const getFieldPropsOrFormItemProps = <T extends Record<string, unknown>>(
  props: T | ((...args: unknown[]) => T) | undefined,
  ...args: unknown[]
): T | undefined => {
  if (typeof props === 'function') {
    return props(...args)
  }
  return props
}

/**
 * 运行函数或返回原值
 * @param value 值或函数
 * @param args 函数参数
 */
const runFunction = <T, U extends unknown[]>(value: T | ((...args: U) => T), ...args: U): T => {
  if (typeof value === 'function') {
    return (value as (...args: U) => T)(...args)
  }
  return value
}

/**
 * 单元格渲染为表单项的组件
 * 只读模式渲染
 */
const CellRenderToFormItem = defineComponent({
  name: 'CellRenderToFormItem',
  props: {
    text: {},
    valueType: {} as () =>
      | ProFieldValueType
      | ((record?: unknown, type?: string) => ProFieldValueType),
    index: Number,
    rowData: Object,
    columnEmptyText: String,
    columnProps: Object as () => ProTableColumn,
    type: String as () => 'table' | 'form',
  },
  setup(props) {
    // 计算最终的值和类型
    const finalValue = computed(() => {
      // 对于 index 和 indexBorder 类型，使用索引值
      const currentValueType =
        typeof props.valueType === 'function'
          ? props.valueType(props.rowData, props.type)
          : props.valueType

      if (currentValueType === 'index' || currentValueType === 'indexBorder') {
        return props.index
      }
      return props.text
    })

    const finalValueType = computed(() => {
      return typeof props.valueType === 'function'
        ? props.valueType(props.rowData, props.type)
        : props.valueType
    })

    // 计算字段属性
    const computedFieldProps = computed(() => {
      const { columnProps, rowData: _rowData, index } = props
      if (!columnProps) return {}

      // 支持函数形式的 fieldProps
      const fieldProps = getFieldPropsOrFormItemProps(
        columnProps.form?.fieldProps as
          | Record<string, unknown>
          | ((...args: unknown[]) => Record<string, unknown>)
          | undefined,
        null,
        {
          ...columnProps,
          rowIndex: index,
        },
      )

      return fieldProps ?? {}
    })

    return () => {
      const { text, columnProps } = props
      const currentValueType = finalValueType.value

      // 如果 valueType === text，没必要多走一次 render
      if (
        (!currentValueType || ['textarea', 'text'].includes(currentValueType.toString())) &&
        // valueEnum 存在说明是个select
        !columnProps?.valueEnum
      ) {
        // 如果是''、null、undefined 显示columnEmptyText
        return SHOW_EMPTY_TEXT_LIST.includes(text as string | null | undefined)
          ? props.columnEmptyText
          : text
      }

      // 只读模式渲染
      return (
        <ProField
          mode="read"
          modelValue={finalValue.value}
          valueType={currentValueType}
          valueEnum={runFunction(columnProps?.valueEnum, props.rowData)}
          fieldProps={computedFieldProps.value}
          emptyText={props.columnEmptyText}
        />
      )
    }
  },
})

/**
 * 根据不同的类型来转化数值
 * 这是主要的导出函数，用于将单元格渲染为只读表单项
 *
 * @param config 配置参数
 * @returns 渲染的 VNode
 *
 * @example
 * ```tsx
 * const dom = cellRenderToFormItem({
 *   text: 'Hello',
 *   valueType: 'text',
 *   index: 0,
 *   rowData: { id: 1, name: 'Test' },
 * })
 * ```
 */
function cellRenderToFormItem<T extends TableRowData>(config: CellRenderToFormItemProps<T>): VNode {
  const { text, valueType, rowData, columnProps, type } = config

  // 如果 valueType === text，没必要多走一次 render
  if (
    (!valueType || ['textarea', 'text'].includes(valueType.toString())) &&
    // valueEnum 存在说明是个select
    !columnProps?.valueEnum
  ) {
    // 如果是''、null、undefined 显示columnEmptyText
    if (SHOW_EMPTY_TEXT_LIST.includes(text as string | null | undefined)) {
      return (<span>{config.columnEmptyText}</span>) as VNode
    }
    return (<span>{text}</span>) as VNode
  }

  // 如果 valueType 是函数，递归处理
  if (typeof valueType === 'function' && rowData) {
    return cellRenderToFormItem({
      ...config,
      valueType: valueType(rowData, type) || 'text',
    })
  }

  return (
    <CellRenderToFormItem
      text={config.text}
      valueType={config.valueType as ProFieldValueType}
      index={config.index}
      rowData={config.rowData as TableRowData}
      columnEmptyText={config.columnEmptyText}
      columnProps={config.columnProps as ProTableColumn<TableRowData>}
      type={config.type}
    />
  ) as VNode
}

export default cellRenderToFormItem
