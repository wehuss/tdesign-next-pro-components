/**
 * Table utils 统一导出
 * 移植自 ant-design/pro-components 的四个核心文件
 */

// 列排序工具
export {
  columnSort,
  getColumnSortWeight,
  type SortableColumn,
} from "./column-sort";

// 列渲染工具
export {
  columnRender,
  defaultOnFilter,
  genCopyable,
  renderColumnsTitle,
  runFunction,
  type ColumnRenderInterface,
} from "./column-render";

// 单元格到表单项转换
export {
  default as cellRenderToFormItem,
  getFieldPropsOrFormItemProps,
  type CellRenderToFormItemProps,
} from "./cell-render-to-form-item";

// ProColumns 到标准 Columns 转换
export {
  checkUndefinedOrNull,
  flattenColumns,
  genColumnKey,
  genProColumnToColumn,
  isLocaleSorter,
  omitUndefinedAndEmptyArr,
  parseDataIndex,
  parseProSortOrder,
  type ColumnToColumnParams,
} from "./gen-pro-column-to-column";
