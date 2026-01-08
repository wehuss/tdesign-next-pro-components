/**
 * 单元格渲染为表单项工具函数
 * 移植自 ant-design/pro-components 适配 TDesign Vue Next
 */
import type { TableRowData } from 'tdesign-vue-next'
import type { VNode } from 'vue'
import { computed, defineComponent } from 'vue'
import { ProField } from '../../field'
import type { ProFieldMode, ProFieldValueType } from '../../field/types'
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
  /** 行的唯一 key */
  recordKey?: string | number
  /** 渲染模式 */
  mode: ProFieldMode
  /**
   * 如果存在，则在表单中使用 EditableTable
   */
  prefixName?: string
  /** 子表名称路径 */
  subName?: string[]
  /** 可编辑工具类 */
  editableUtils?: {
    isEditable: (params: { index: number } & T) => {
      isEditable: boolean
      recordKey: string | number
    }
    actionRender?: (record: T & { index: number }) => VNode[]
    getRealIndex?: (record: T) => number
  }
}

/**
 * 拼接用于编辑的 key
 * 用于生成表单项的 name 路径
 *
 * @param rest 路径片段
 * @returns 拼接后的路径数组
 *
 * @example
 * ```ts
 * spellNamePath('users', 0, 'name') // ['users', '0', 'name']
 * spellNamePath(undefined, 'name') // ['name']
 * ```
 */
export const spellNamePath = (...rest: unknown[]): (string | number)[] => {
  return rest
    .filter((index) => index !== undefined)
    .map((item) => {
      if (typeof item === 'number') {
        return item.toString()
      }
      return item
    })
    .flat(1) as (string | number)[]
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
 * 支持只读模式和编辑模式的渲染
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
    recordKey: [String, Number],
    mode: String as () => ProFieldMode,
    prefixName: String,
    subName: Array as () => string[],
    editableUtils: Object as () => CellRenderToFormItemProps['editableUtils'],
  },
  setup(props) {
    // 获取真实索引（用于可编辑表格）
    const realIndex = computed(() => {
      if (props.editableUtils?.getRealIndex && props.rowData) {
        return props.editableUtils.getRealIndex(props.rowData as TableRowData)
      }
      return props.index ?? 0
    })

    // 计算表单项名称路径（保留用于后续可编辑表格功能）
    const _formItemName = computed(() => {
      const key = props.recordKey ?? props.index
      const columnKey = props.columnProps?.colKey ?? props.index

      return spellNamePath(
        props.prefixName,
        props.prefixName ? props.subName : [],
        props.prefixName ? realIndex.value : key,
        columnKey,
      )
    })

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
          isEditable: props.mode === 'edit',
        },
      )

      return fieldProps ?? {}
    })

    // 生成表单项
    const generateFormItem = () => {
      const { columnProps, rowData, index, recordKey, editableUtils } = props

      // 如果有自定义的 formItemRender，则使用它
      if (columnProps?.formItemRender) {
        const fieldDom = (
          <ProField
            modelValue={finalValue.value}
            valueType={finalValueType.value}
            mode={props.mode}
            fieldProps={computedFieldProps.value}
            valueEnum={runFunction(columnProps?.valueEnum, rowData)}
          />
        )

        const result = columnProps.formItemRender(
          {
            ...columnProps,
            index,
            isEditable: props.mode === 'edit',
            type: 'table',
          },
          {
            defaultRender: () => fieldDom,
            type: 'form',
            recordKey,
            record: {
              ...rowData,
            },
            isEditable: props.mode === 'edit',
          },
          undefined, // form instance
          editableUtils,
        )

        // 如果返回 false 或 null，不渲染
        if (result === false || result === null) {
          return null
        }

        return result
      }

      // 默认使用 ProField
      return (
        <ProField
          modelValue={finalValue.value}
          valueType={finalValueType.value}
          mode={props.mode}
          fieldProps={computedFieldProps.value}
          valueEnum={runFunction(columnProps?.valueEnum, rowData)}
          emptyText={props.columnEmptyText}
        />
      )
    }

    return () => {
      const { text, mode, columnProps } = props
      const currentValueType = finalValueType.value

      // 如果 valueType === text，没必要多走一次 render
      if (
        (!currentValueType || ['textarea', 'text'].includes(currentValueType.toString())) &&
        // valueEnum 存在说明是个select
        !columnProps?.valueEnum &&
        mode === 'read'
      ) {
        // 如果是''、null、undefined 显示columnEmptyText
        return SHOW_EMPTY_TEXT_LIST.includes(text as string | null | undefined)
          ? props.columnEmptyText
          : text
      }

      // 如果 valueType 是函数，递归处理
      if (typeof props.valueType === 'function' && props.rowData) {
        const resolvedValueType = props.valueType(props.rowData, props.type) || 'text'
        return (
          <ProField
            mode={props.mode}
            modelValue={finalValue.value}
            valueType={resolvedValueType}
            valueEnum={runFunction(columnProps?.valueEnum, props.rowData)}
            fieldProps={computedFieldProps.value}
            emptyText={props.columnEmptyText}
          />
        )
      }

      /** 只读模式直接返回就好了，不需要处理 formItem */
      if (mode !== 'edit') {
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

      return generateFormItem()
    }
  },
})

/**
 * 根据不同的类型来转化数值
 * 这是主要的导出函数，用于将单元格渲染为表单项
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
 *   mode: 'read',
 * })
 * ```
 */
function cellRenderToFormItem<T extends TableRowData>(config: CellRenderToFormItemProps<T>): VNode {
  const { text, valueType, rowData, columnProps, type } = config

  // 如果 valueType === text，没必要多走一次 render
  if (
    (!valueType || ['textarea', 'text'].includes(valueType.toString())) &&
    // valueEnum 存在说明是个select
    !columnProps?.valueEnum &&
    config.mode === 'read'
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
      recordKey={config.recordKey}
      mode={config.mode}
      prefixName={config.prefixName}
      subName={config.subName}
      editableUtils={
        config.editableUtils as CellRenderToFormItemProps<TableRowData>['editableUtils']
      }
    />
  ) as VNode
}

export default cellRenderToFormItem
