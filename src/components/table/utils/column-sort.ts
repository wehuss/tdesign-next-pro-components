/**
 * 列排序工具函数
 * 移植自 ant-design/pro-components 适配 TDesign Vue Next
 */
import type { ColumnsState } from '../types'

interface SortableColumn {
  fixed?: 'left' | 'right'
  index?: number
  key?: string
}

/**
 * 列排序函数
 * @param columnsMap 列状态映射表
 * @returns 排序函数
 */
export const columnSort =
  (columnsMap: Record<string, ColumnsState>) =>
  (a: SortableColumn, b: SortableColumn) => {
    const { fixed: aFixed, index: aIndex } = a
    const { fixed: bFixed, index: bIndex } = b

    // 左固定列优先级最高
    if (
      (aFixed === 'left' && bFixed !== 'left') ||
      (bFixed === 'right' && aFixed !== 'right')
    ) {
      return -2
    }

    // 右固定列优先级最低
    if (
      (bFixed === 'left' && aFixed !== 'left') ||
      (aFixed === 'right' && bFixed !== 'right')
    ) {
      return 2
    }

    // 如果没有index，在 dataIndex 或者 key 不存在的时候他会报错
    const aKey = a.key || `${aIndex}`
    const bKey = b.key || `${bIndex}`

    // 根据用户设置的order进行排序
    if (columnsMap[aKey]?.order || columnsMap[bKey]?.order) {
      return (columnsMap[aKey]?.order || 0) - (columnsMap[bKey]?.order || 0)
    }

    // 默认按index排序
    return (a.index || 0) - (b.index || 0)
  }
