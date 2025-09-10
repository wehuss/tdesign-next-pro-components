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
  text: any
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
  }
  /** 计数器，用于性能优化 */
  counter?: {
    action?: ActionRef
    rootDomRef?: any
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
  item: ProTableColumn<any>
): string | VNode => {
  const { title } = item

  if (title && typeof title === 'function') {
    // TDesign 的 title 函数需要传入参数，这里暂时简化处理
    return title as any
  }

  return title as string
}

/** 判断是否为不可编辑的单元格 */
export function isNotEditableCell<T extends TableRowData>(
  text: any,
  rowData: T,
  index: number,
  editable?: boolean | ((text: any, record: T, index: number) => boolean)
): boolean {
  if (typeof editable === 'boolean') {
    return editable === false
  }
  return editable?.(text, rowData, index) === false
}

/**
 * 获取具有可复制功能的 DOM
 * @param dom 原始 DOM
 */
export const genCopyable = (dom: VNode): VNode => {
  // TDesign 暂不支持复制功能，直接返回原 DOM
  // 后续可以添加复制按钮和逻辑
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
 * 这个组件负责单元格的具体渲染
 * @param config 渲染配置
 */
export function columnRender<T extends TableRowData = TableRowData>(
  config: ColumnRenderInterface<T>
): any {
  const {
    columnProps,
    text,
    rowData,
    index,
    columnEmptyText = '-',
    type = 'table',
    actionRef,
    editableUtils,
    subName = [],
    marginSM = 8,
  } = config

  // 获取 renderText 函数的结果
  const { renderText } = columnProps
  const renderTextStr = renderText
    ? renderText(text, rowData, index, actionRef as unknown)
    : text

  // 判断是否为可编辑状态
  const isEditable = editableUtils?.isEditable?.({ ...rowData, index })
  const editable = columnProps?.editable as
    | boolean
    | ((text: unknown, record: T, index: number) => boolean)
    | undefined
  const mode =
    isEditable?.isEditable && !isNotEditableCell(text, rowData, index, editable)
      ? 'edit'
      : 'read'

  // 使用 cellRenderToFormItem 来处理字段渲染
  const textDom = cellRenderToFormItem<T>({
    text: renderTextStr,
    valueType: (columnProps.valueType as ProFieldValueType) || 'text',
    index,
    rowData,
    columnEmptyText,
    columnProps: {
      ...columnProps,
      // 兼容性处理
      entity: rowData,
    },
    type,
    recordKey: isEditable?.recordKey,
    mode,
    prefixName: undefined, // 表格中不需要前缀
    subName,
  })

  // 生成可复制的 DOM
  const dom: VNode = mode === 'edit' ? textDom : genCopyable(textDom)

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
            gap: marginSM,
            justifyContent:
              columnProps.align === 'center' ? 'center' : 'flex-start',
          },
        },
        [
          editableUtils?.actionRender?.({
            ...rowData,
            index: columnProps.index || index,
          }),
        ]
      )
    }
    return dom
  }

  // 如果没有自定义渲染函数，直接返回处理后的 DOM
  if (!columnProps.render) {
    const isVueNode = dom && typeof dom === 'object' && dom.type
    const isSimpleValue = ['string', 'number'].includes(typeof dom)

    return !isNil(dom) && (isVueNode || isSimpleValue) ? dom : null
  }

  // 使用自定义渲染函数
  const renderDom = columnProps.render(
    dom,
    rowData,
    index,
    actionRef as unknown,
    {
      ...columnProps,
      isEditable: isEditable?.isEditable,
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
          gap: 8,
        },
      },
      renderDom
    )
  }

  return renderDom as VNode
}
