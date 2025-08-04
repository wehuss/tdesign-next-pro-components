import type { PageInfo, PaginationProps } from 'tdesign-vue-next'
import type { PaginationParams } from '../types'

/**
 * 合并分页配置，参考 ant-design/pro-components 的实现
 * @param pagination 用户传入的分页配置
 * @param pageInfo 内部分页状态
 * @param onPageInfoChange 分页变化回调
 */
export function mergePagination(
  pagination: boolean | PaginationProps | undefined,
  pageInfo: PaginationParams,
  onPageInfoChange: (pageInfo: PaginationParams) => void
): PaginationProps | false {
  // 如果禁用分页
  if (pagination === false) {
    return false
  }

  const { current, pageSize, total } = pageInfo
  const defaultPaginationConfig: PaginationProps =
    typeof pagination === 'object' ? pagination : {}

  return {
    // 显示总数信息
    totalContent: true,
    // 显示页码跳转器
    showJumper: true,
    // 显示每页条数选择器
    showPageSize: true,
    // 每页条数选项
    pageSizeOptions: [10, 30, 50, 100],
    // 总数
    total,
    // 合并用户配置
    ...defaultPaginationConfig,
    current:
      pagination !== true && defaultPaginationConfig.current !== undefined
        ? defaultPaginationConfig.current
        : current,
    pageSize:
      pagination !== true && defaultPaginationConfig.pageSize !== undefined
        ? defaultPaginationConfig.pageSize
        : pageSize,
    // 页码变化回调
    onChange: pageInfo => {
      const { current: _current, pageSize } = pageInfo
      // 触发用户自定义的 onChange
      if (typeof pagination === 'object' && pagination.onChange) {
        pagination.onChange(pageInfo)
      }

      // 页面大小变化时，重置到第一页
      if (pageSize !== pageSize) {
        onPageInfoChange({
          current: 1,
          pageSize,
          total,
        })
      } else if (_current !== current) {
        // 仅页码变化
        onPageInfoChange({
          current: _current,
          pageSize,
          total,
        })
      }
    },
    // 每页条数变化回调
    onPageSizeChange: (pageSize: number, pageInfo: PageInfo) => {
      if (typeof pagination === 'object' && pagination.onPageSizeChange) {
        pagination.onPageSizeChange(pageSize, pageInfo)
      }

      // 页面大小变化时，重置到第一页
      onPageInfoChange({
        current: 1,
        pageSize,
        total,
      })
    },
  }
}

/**
 * 检查分页信息是否发生变化
 */
export function isPaginationChanged(
  current: PaginationParams,
  prev: PaginationParams
): boolean {
  return (
    current.current !== prev.current ||
    current.pageSize !== prev.pageSize ||
    current.total !== prev.total
  )
}

/**
 * 生成默认分页配置
 */
export function getDefaultPagination(
  pagination?: boolean | PaginationProps
): PaginationParams {
  if (pagination === false) {
    return { current: 1, pageSize: 30, total: 0 }
  }

  const config = typeof pagination === 'object' ? pagination : {}
  return {
    current: config.defaultCurrent || config.current || 1,
    pageSize: config.defaultPageSize || config.pageSize || 30,
    total: 0,
  }
}

/**
 * 检查是否应该触发数据请求
 * 参考 ant-design 的逻辑，避免不必要的请求
 */
export function shouldFetchData(options: {
  current: PaginationParams
  prev: PaginationParams
  dataLength: number
  hasRequest: boolean
}): boolean {
  const { current, prev, dataLength, hasRequest } = options

  // 没有请求函数，不需要请求
  if (!hasRequest) {
    return false
  }

  // 页码或页面大小没有变化，不需要请求
  if (current.current === prev.current && current.pageSize === prev.pageSize) {
    return false
  }

  // 如果数据长度大于页面大小，说明是前端分页，不需要请求
  if (dataLength > current.pageSize) {
    return false
  }

  return true
}
