/**
 * 列排序工具函数
 * 移植自 ant-design/pro-components 适配 TDesign Vue Next
 */
import type { ColumnsState } from '../types'

/**
 * 可排序列的接口定义
 */
export interface SortableColumn {
  /** 固定位置 */
  fixed?: 'left' | 'right'
  /** 列索引 */
  index?: number
  /** 列的唯一标识 */
  key?: string
  /** 列的 colKey（TDesign 特有） */
  colKey?: string
}

/**
 * 列排序函数
 * 用于对表格列进行排序，支持固定列和自定义顺序
 *
 * 排序规则：
 * 1. 左固定列 (fixed='left') 优先级最高，排在最前面
 * 2. 右固定列 (fixed='right') 优先级最低，排在最后面
 * 3. 如果用户在 columnsMap 中设置了 order，则按 order 排序
 * 4. 否则按原始 index 排序
 *
 * @param columnsMap 列状态映射表，包含列的显示/隐藏、固定、顺序等配置
 * @returns 排序比较函数
 *
 * @example
 * ```ts
 * const columnsMap = {
 *   'name': { order: 1, show: true },
 *   'age': { order: 2, show: true },
 * }
 * const sortedColumns = columns.sort(columnSort(columnsMap))
 * ```
 */
export const columnSort =
  (columnsMap: Record<string, ColumnsState>) =>
  (a: SortableColumn, b: SortableColumn): number => {
    const { fixed: aFixed, index: aIndex } = a
    const { fixed: bFixed, index: bIndex } = b

    // 左固定列优先级最高
    // 如果 a 是左固定而 b 不是，或者 b 是右固定而 a 不是，a 排在前面
    if ((aFixed === 'left' && bFixed !== 'left') || (bFixed === 'right' && aFixed !== 'right')) {
      return -2
    }

    // 右固定列优先级最低
    // 如果 b 是左固定而 a 不是，或者 a 是右固定而 b 不是，b 排在前面
    if ((bFixed === 'left' && aFixed !== 'left') || (aFixed === 'right' && bFixed !== 'right')) {
      return 2
    }

    // 获取列的唯一标识，优先使用 key，其次使用 colKey，最后使用 index
    const aKey = a.key || a.colKey || `${aIndex}`
    const bKey = b.key || b.colKey || `${bIndex}`

    // 根据用户设置的 order 进行排序
    const aOrder = columnsMap[aKey]?.order
    const bOrder = columnsMap[bKey]?.order

    if (aOrder !== undefined || bOrder !== undefined) {
      return (aOrder ?? 0) - (bOrder ?? 0)
    }

    // 默认按 index 排序
    return (a.index ?? 0) - (b.index ?? 0)
  }

/**
 * 获取列的排序权重
 * 用于计算列在排序中的优先级
 *
 * @param column 列配置
 * @param columnsMap 列状态映射表
 * @returns 排序权重
 */
export const getColumnSortWeight = (
  column: SortableColumn,
  columnsMap: Record<string, ColumnsState>,
): number => {
  const { fixed, index, key, colKey } = column
  const columnKey = key || colKey || `${index}`

  // 固定列的基础权重
  let weight = 0
  if (fixed === 'left') {
    weight = -1000
  } else if (fixed === 'right') {
    weight = 1000
  }

  // 加上用户设置的 order 或默认的 index
  const order = columnsMap[columnKey]?.order ?? index ?? 0
  return weight + order
}
