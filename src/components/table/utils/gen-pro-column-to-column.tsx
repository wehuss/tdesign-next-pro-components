/**
 * 将 ProColumns 转换为标准 Table Columns 的核心逻辑
 * 移植自 ant-design/pro-components 适配 TDesign Vue Next
 */
import type { PrimaryTableCol, TableRowData } from 'tdesign-vue-next'
import type { ProTableColumn } from '../types'
import { columnRender } from './column-render'
import { columnSort } from './column-sort'

type ColumnToColumnReturnType<T extends TableRowData> = PrimaryTableCol<T>[]

interface ColumnToColumnParams<T extends TableRowData> {
  columns: ProTableColumn<T>[]
  columnsMap: Record<string, { show?: boolean }>
  columnEmptyText?: string
  type: 'table' | 'form'
  rowKey?: string
}

/**
 * 生成列的唯一key
 * @param key 用户设置的key
 * @param index 序列号
 */
export const genColumnKey = (
  key?: string | number,
  index?: number | string
): string => {
  if (key) {
    return Array.isArray(key) ? key.join('-') : key.toString()
  }
  return `${index}`
}

/**
 * 将 ProTable - column - dataIndex 转为字符串形式
 * @param dataIndex Column 中的 dataIndex
 */
export const parseDataIndex = (
  dataIndex: ProTableColumn['colKey']
): string | undefined => {
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
  sorter: ProTableColumn<T>['sorter']
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
  columnProps: ProTableColumn<T>
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
 * 转化 columns 到 pro 的格式 主要是 render 方法的自行实现
 * @param params 转换参数
 */
export function genProColumnToColumn<T extends TableRowData>(
  params: ColumnToColumnParams<T>
): ColumnToColumnReturnType<T> {
  const { columns, columnsMap, columnEmptyText = '-', type } = params

  return columns
    ?.map((columnProps, columnsIndex) => {
      const {
        colKey,
        valueEnum,
        valueType = 'text',
        children,
        sorter,
      } = columnProps as ProTableColumn<T>

      const columnKey = genColumnKey(
        colKey?.toString(),
        columnsIndex.toString()
      )

      // 这些都没有，说明是普通的表格不需要 pro 管理
      const noNeedPro = !valueEnum && !valueType && !children
      if (noNeedPro) {
        return {
          ...columnProps,
          colKey: columnKey,
        }
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

      const tempColumns: PrimaryTableCol<T> = {
        ...columnProps,
        colKey: columnKey,
        // 处理排序
        sorter: sorterConfig,
        // 自定义渲染
        cell: (_, { row, rowIndex }) => {
          return columnRender<T>({
            columnProps,
            text: row[colKey as keyof T],
            rowData: row,
            index: rowIndex,
            columnEmptyText,
            type,
            mode: 'read',
          })
        },
        // 处理子列
        children: children
          ? genProColumnToColumn({
              columns: children as ProTableColumn<T>[],
              columnsMap: params.columnsMap,
              columnEmptyText: params.columnEmptyText,
              type: params.type,
              rowKey: params.rowKey,
            })
          : undefined,
      }

      return tempColumns
    })
    ?.filter(item => {
      const config = columnsMap[item.colKey || ''] || { show: true }
      return !(item as any).hideInTable && config.show !== false
    })
    ?.sort(columnSort(columnsMap)) as ColumnToColumnReturnType<T>
}
