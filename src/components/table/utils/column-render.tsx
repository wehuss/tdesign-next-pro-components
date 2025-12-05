/**
 * 列渲染工具函数
 * 移植自 ant-design/pro-components 适配 TDesign Vue Next
 */
import type { TableRowData } from 'tdesign-vue-next'
import type { VNode } from 'vue'
import { h } from 'vue'
import { isNil } from '../../../utils'
import type { ProFieldValueType } from '../../field/types'
import type { ActionRef, ProTableColumn } from '../types'
import cellRenderToFormItem from './cell-render-to-form-item'

/** 转化列的定义 */
export interface ColumnRenderInterface<T extends TableRowData = TableRowData> {
  columnProps: ProTableColumn<T>
  text: unknown
  rowData: T
  index: number
  columnEmptyText?: string
  type: 'table' | 'form'
  mode?: 'read' | 'edit'
  actionRef?: ActionRef
  /** 可编辑工具类 */
  editableUtils?: {
    isEditable: (params: { index: number } & T) => {
      isEditable: boolean
      recordKey: string | number
    }
    actionRender?: (record: T & { index: number }) => VNode[]
    /** 获取真实索引 */
    getRealIndex?: (record: T) => number
  }
  /** 计数器，用于性能优化 */
  counter?: {
    action?: ActionRef
    rootDomRef?: unknown
    prefixName?: string
  }
  /** 子表名称，用于嵌套表格 */
  subName?: string[]
  /** 样式间距 */
  marginSM?: number
}

/**
 * 增加了 icon 的功能 render title
 * @param item 列配置
 */
export const renderColumnsTitle = (
  item: ProTableColumn<TableRowData>
): string | VNode => {
  const { title } = item

  // 获取 ellipsis 配置
  const ellipsis =
    typeof item?.ellipsis === 'boolean'
      ? item?.ellipsis
      : (item?.ellipsis as { showTitle?: boolean })?.showTitle

  if (title && typeof title === 'function') {
    // TDesign 的 title 函数需要传入参数，这里暂时简化处理
    return title as unknown as VNode
  }

  // 如果有 tooltip，可以添加提示图标
  // 目前简化处理，直接返回标题
  // 后续可以添加 LabelIconTip 组件支持
  if (ellipsis && typeof title === 'string') {
    return h(
      'span',
      {
        style: {
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        },
        title: title,
      },
      title
    )
  }

  return title as string
}

/** 判断是否为不可编辑的单元格 */
export function isNotEditableCell<T extends TableRowData>(
  text: unknown,
  rowData: T,
  index: number,
  editable?: boolean | ((text: unknown, record: T, index: number) => boolean)
): boolean {
  if (typeof editable === 'boolean') {
    return editable === false
  }
  return editable?.(text, rowData, index) === false
}

/**
 * 获取具有可复制功能的 DOM
 * @param dom 原始 DOM
 * @param columnProps 列配置
 * @param _text 原始文本（保留用于后续复制功能实现）
 */
export const genCopyable = <T extends TableRowData>(
  dom: VNode,
  columnProps?: ProTableColumn<T>,
  _text?: unknown
): VNode => {
  // 检查是否需要复制功能
  if (!columnProps?.copyable) {
    return dom
  }

  // TDesign 暂不支持内置复制功能
  // 这里可以添加复制按钮和逻辑
  // 目前简化处理，直接返回原 DOM
  // 后续可以添加 Tooltip + 复制图标的实现
  return dom
}

/**
 * 检查是否为合并单元格
 * @param renderDom 渲染的 DOM
 */
export const isMergeCell = (renderDom: any): boolean => {
  return (
    renderDom &&
    typeof renderDom === 'object' &&
    renderDom.colSpan !== undefined
  )
}

/**
 * 默认的 filter 方法
 * @param value 过滤值
 * @param record 行数据
 * @param dataIndex 数据索引
 * @returns 是否匹配
 */
export const defaultOnFilter = (
  value: string,
  record: any,
  dataIndex: string | string[]
): boolean => {
  let recordElement: any

  if (Array.isArray(dataIndex)) {
    recordElement = dataIndex.reduce((obj, key) => obj?.[key], record)
  } else {
    recordElement = record[dataIndex]
  }

  const itemValue = String(recordElement) as string
  return String(itemValue) === String(value)
}

/**
 * 运行函数或返回原值
 * @param value 值或函数
 * @param args 函数参数
 */
export const runFunction = <T, U extends unknown[]>(
  value: T | ((...args: U) => T),
  ...args: U
): T => {
  if (typeof value === 'function') {
    return (value as (...args: U) => T)(...args)
  }
  return value
}

/**
 * 这个组件负责单元格的具体渲染
 * @param config 渲染配置
 */
export function columnRender<T extends TableRowData = TableRowData>(
  config: ColumnRenderInterface<T>
): unknown {
  const {
    columnProps,
    text,
    rowData,
    index,
    columnEmptyText = '-',
    type = 'table',
    actionRef,
    editableUtils,
    counter,
    subName = [],
    marginSM = 8,
  } = config

  // 获取 prefixName（用于可编辑表格）
  const prefixName = counter?.prefixName

  // 获取 renderText 函数的结果
  const { renderText = (val: unknown) => val } = columnProps
  const renderTextStr = renderText(text, rowData, index, actionRef)

  // 判断是否为可编辑状态
  const editableResult = editableUtils?.isEditable?.({ ...rowData, index })
  const isEditable = editableResult?.isEditable ?? false
  const recordKey = editableResult?.recordKey

  const editable = columnProps?.editable as
    | boolean
    | ((text: unknown, record: T, index: number) => boolean)
    | undefined

  const mode =
    isEditable && !isNotEditableCell(text, rowData, index, editable)
      ? 'edit'
      : 'read'

  // 使用 cellRenderToFormItem 来处理字段渲染
  const textDom = cellRenderToFormItem<T>({
    text: renderTextStr as string | number | (string | number)[],
    valueType: (columnProps.valueType as ProFieldValueType) || 'text',
    index,
    rowData,
    columnEmptyText,
    columnProps: {
      ...columnProps,
      // 兼容性处理 - 同时支持 entry 和 entity
      entity: rowData,
    },
    type,
    recordKey,
    mode,
    prefixName,
    subName,
  })

  // 生成可复制的 DOM（只读模式下）
  const dom: VNode =
    mode === 'edit' ? textDom : genCopyable(textDom, columnProps, renderTextStr)

  /** 如果是编辑模式，并且有自定义的 formItemRender，直接使用 */
  if (mode === 'edit') {
    // 处理操作列
    if (columnProps.valueType === 'option') {
      return h(
        'div',
        {
          style: {
            display: 'flex',
            alignItems: 'center',
            gap: `${marginSM}px`,
            justifyContent:
              columnProps.align === 'center' ? 'center' : 'flex-start',
          },
        },
        [
          editableUtils?.actionRender?.({
            ...rowData,
            index: columnProps.index ?? index,
          }),
        ]
      )
    }
    return dom
  }

  // 如果没有自定义渲染函数，直接返回处理后的 DOM
  if (!columnProps.render) {
    const isVueNode =
      dom && typeof dom === 'object' && 'type' in dom && dom.type
    const isSimpleValue = ['string', 'number'].includes(typeof dom)

    return !isNil(dom) && (isVueNode || isSimpleValue) ? dom : null
  }

  // 使用自定义渲染函数
  const renderDom = columnProps.render(
    dom,
    rowData,
    index,
    {
      ...(actionRef ?? {}),
      ...(editableUtils ?? {}),
    },
    {
      ...columnProps,
      isEditable,
      type: 'table',
    }
  )

  // 如果是合并单元格的，直接返回对象
  if (isMergeCell(renderDom)) {
    return renderDom
  }

  // 处理操作列的数组渲染
  if (
    renderDom &&
    columnProps.valueType === 'option' &&
    Array.isArray(renderDom)
  ) {
    return h(
      'div',
      {
        style: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          gap: '8px',
        },
      },
      renderDom
    )
  }

  return renderDom as VNode
}
