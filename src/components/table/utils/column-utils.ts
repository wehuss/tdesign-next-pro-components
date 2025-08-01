import type { PrimaryTableCol, TableRowData } from 'tdesign-vue-next'
import type { ProColumn } from '../types'

/**
 * 将 ProColumn 转换为 TDesign Table 的列配置
 */
export function transformColumns<T = Record<string, unknown>>(
  columns: ProColumn<T>[]
): PrimaryTableCol<TableRowData>[] {
  return columns
    ?.filter(column => !column.hideInTable)
    .map(column => {
      const {
        colKey,
        title,
        width,
        minWidth,
        fixed,
        align,
        ellipsis,
        render,
        ...rest
      } = column

      // 基础列配置
      const tableColumn: PrimaryTableCol<TableRowData> = {
        colKey: colKey as string,
        title,
        width,
        minWidth,
        fixed,
        align,
        ellipsis,
        ...rest,
      }

      // 处理自定义渲染
      if (render) {
        tableColumn.cell = (_h, { row, col, rowIndex }) => {
          const columnKey = col.colKey || column.colKey
          return render({
            value: row[columnKey as string],
            record: row as T,
            index: rowIndex,
            column,
          })
        }
      }

      return tableColumn
    })
}

/**
 * 获取搜索表单需要的列
 */
export function getSearchColumns<T = Record<string, unknown>>(
  columns: ProColumn<T>[]
): ProColumn<T>[] {
  return columns
    .filter(column => !column.hideInSearch && column.search !== false)
    .sort((a, b) => (b.order || 0) - (a.order || 0))
}
