/**
 * 将 ProColumns 转换为标准 Table Columns 的核心逻辑
 * 移植自 ant-design/pro-components 适配 TDesign Vue Next
 */
import type { PrimaryTableCellParams, PrimaryTableCol, TableRowData, TNode } from 'tdesign-vue-next'
import type { ActionRef, ColumnsState, ProTableColumn } from '../types'
import { columnRender } from './column-render'
import { columnSort } from './column-sort'

type ColumnToColumnReturnType<T extends TableRowData> = (PrimaryTableCol<T> & {
  index?: number
})[]

export interface ColumnToColumnParams<T extends TableRowData> {
  columns: ProTableColumn<T>[]
  columnsMap: Record<string, ColumnsState>
  columnEmptyText?: string
  type: 'table' | 'form'
  rowKey?: string | ((record: T, index: number) => string | number)
  childrenColumnName?: string
  /** 可编辑工具类 */
  editableUtils?: {
    isEditable: (params: { index: number } & T) => {
      isEditable: boolean
      recordKey: string | number
    }
    actionRender?: (record: T & { index: number }) => any[]
  }
  /** 操作引用 */
  actionRef?: ActionRef
  /** 边距 */
  marginSM?: number
}

/**
 * 生成列的唯一key
 * @param key 用户设置的key
 * @param index 序列号
 */
export const genColumnKey = (key?: string | number, index?: number | string): string => {
  if (key) {
    return Array.isArray(key) ? key.join('-') : key.toString()
  }
  return `${index}`
}

/**
 * 将 ProTable - column - dataIndex 转为字符串形式
 * @param dataIndex Column 中的 dataIndex
 */
export const parseDataIndex = (dataIndex: ProTableColumn['colKey']): string | undefined => {
  if (Array.isArray(dataIndex)) {
    return dataIndex.join(',')
  }
  return dataIndex?.toString()
}

/**
 * 判断是否为本地排序
 * @param sorter 排序配置
 */
export const isLocaleSorter = <T extends TableRowData>(
  sorter: ProTableColumn<T>['sorter'],
): boolean => {
  return typeof sorter === 'function'
}

/**
 * 解析排序配置
 * @param proSort 排序状态
 * @param columnProps 列配置
 */
export const parseProSortOrder = <T extends TableRowData>(
  proSort: Record<string, 'asc' | 'desc' | null>,
  columnProps: ProTableColumn<T>,
): 'asc' | 'desc' | undefined => {
  const { sorter, colKey } = columnProps

  // 如果没有排序器配置，直接返回 undefined
  if (sorter == null) return undefined

  // 如果是本地排序，不使用 proSort 中的值
  if (isLocaleSorter(sorter)) return undefined

  const dataIndex = parseDataIndex(colKey)
  if (!dataIndex) return undefined

  // 如果sorter是字符串，使用该字符串作为key
  if (typeof sorter === 'string') {
    return proSort[sorter] || undefined
  }

  return proSort[dataIndex] || undefined
}

/**
 * 检查值是否存在 为了避开 0 和 false
 * @param value 要检查的值
 */
export const checkUndefinedOrNull = (value: unknown): boolean =>
  value !== undefined && value !== null

/**
 * 移除对象中的 undefined 和空数组
 * @param obj 要处理的对象
 */
export const omitUndefinedAndEmptyArr = <T extends Record<string, unknown>>(obj: T): T => {
  const result = {} as T
  Object.keys(obj).forEach((key) => {
    const value = obj[key]
    if (value !== undefined) {
      if (Array.isArray(value) && value.length === 0) {
        return
      }
      ;(result as Record<string, unknown>)[key] = value
    }
  })
  return result
}

/**
 * 平铺所有columns, 用于判断是用的是本地筛选/排序
 * @param data 列配置
 * @returns 平铺后的列配置
 */
export const flattenColumns = <T extends TableRowData>(
  data: ProTableColumn<T>[],
): ProTableColumn<T>[] => {
  const _columns: ProTableColumn<T>[] = []

  for (let i = 0; i < data.length; i++) {
    const _curItem = data[i]
    if (_curItem.children) {
      _columns.push(...flattenColumns(_curItem.children as ProTableColumn<T>[]))
    } else {
      _columns.push(_curItem)
    }
  }

  return _columns
}

/**
 * 转化 columns 到 pro 的格式 主要是 render 方法的自行实现
 * @param params 转换参数
 * @param parents 父列配置（用于嵌套列）
 */
export function genProColumnToColumn<T extends TableRowData>(
  params: ColumnToColumnParams<T>,
  parents?: ProTableColumn<T>,
): ColumnToColumnReturnType<T> {
  const {
    columns,
    columnsMap,
    columnEmptyText = '-',
    type,
    rowKey = 'id',
    childrenColumnName = 'children',
    editableUtils,
    actionRef,
    marginSM = 8,
  } = params

  // 用于记录子行的名称路径
  const subNameRecord = new Map<string | number, string[]>()

  return columns
    ?.map((columnProps, columnsIndex) => {
      const {
        colKey,
        valueEnum,
        valueType = 'text',
        children,
        sorter,
      } = columnProps as ProTableColumn<T>

      // 生成列的唯一 key
      const columnKey = genColumnKey(
        colKey?.toString(),
        [parents?.colKey, columnsIndex].filter(Boolean).join('-'),
      )

      // 这些都没有，说明是普通的表格不需要 pro 管理
      const noNeedPro = !valueEnum && !valueType && !children
      if (noNeedPro) {
        return {
          index: columnsIndex,
          ...columnProps,
          colKey: columnKey,
        }
      }

      // 获取列状态配置
      const config = columnsMap[columnKey] || {
        fixed: columnProps.fixed,
      }

      // 生成排序配置
      let sorterConfig: boolean | ((a: T, b: T) => number) | undefined
      if (sorter) {
        if (typeof sorter === 'function') {
          // 本地排序
          sorterConfig = sorter as (a: T, b: T) => number
        } else if (typeof sorter === 'boolean') {
          // 远程排序
          sorterConfig = sorter
        } else if (typeof sorter === 'string') {
          // 自定义排序字段，当作远程排序处理
          sorterConfig = true
        }
      }

      // 从 columnProps 中排除 render 属性，因为 ProTableColumn 的 render 签名与 PrimaryTableCol 不同
      const { render: _render, ...restColumnProps } = columnProps

      const tempColumns: PrimaryTableCol<T> & { index?: number } = {
        index: columnsIndex,
        ...restColumnProps,
        colKey: columnKey,
        // 处理固定列
        fixed: config.fixed || columnProps.fixed,
        // 处理宽度
        width: columnProps.width || (columnProps.fixed ? 200 : undefined),
        // 处理排序
        sorter: sorterConfig,
        // 自定义渲染
        cell: ((_h, { row, rowIndex }) => {
          // 获取行的唯一 key
          let keyName: string | number | symbol = rowKey as string
          if (typeof rowKey === 'function') {
            keyName = rowKey(row, rowIndex)
          }

          let uniqueKey: string | number | undefined
          if (
            typeof row === 'object' &&
            row !== null &&
            Reflect.has(row as object, keyName as string)
          ) {
            uniqueKey = (row as Record<string, unknown>)[keyName as string] as string | number
            const parentInfo = subNameRecord.get(uniqueKey) || []

            // 记录子行的路径
            const childrenData = (row as Record<string, unknown>)[childrenColumnName] as
              | T[]
              | undefined
            childrenData?.forEach((item: T) => {
              const itemUniqueKey = (item as Record<string, unknown>)[keyName as string] as
                | string
                | number
              if (!subNameRecord.has(itemUniqueKey)) {
                subNameRecord.set(
                  itemUniqueKey,
                  parentInfo.concat([String(rowIndex), childrenColumnName]),
                )
              }
            })
          }

          return columnRender<T>({
            columnProps,
            text: row[colKey as keyof T],
            rowData: row,
            index: rowIndex,
            columnEmptyText,
            type,
            mode: 'read',
            actionRef,
            editableUtils,
            subName: uniqueKey ? subNameRecord.get(uniqueKey) : undefined,
            marginSM,
          })
        }) as TNode<PrimaryTableCellParams<T>>,
        // 处理子列
        children: children
          ? genProColumnToColumn(
              {
                ...params,
                columns: children as ProTableColumn<T>[],
              },
              { ...columnProps, colKey: columnKey } as ProTableColumn<T>,
            )
          : undefined,
      }

      return omitUndefinedAndEmptyArr(tempColumns as Record<string, unknown>) as
        | PrimaryTableCol<T>
        | { index?: number }
    })
    ?.filter((item) => {
      const config = columnsMap[(item as PrimaryTableCol<T>).colKey || ''] || {
        show: true,
      }
      return !(item as ProTableColumn<T>).hideInTable && config.show !== false
    })
    ?.sort(columnSort(columnsMap)) as ColumnToColumnReturnType<T>
}
