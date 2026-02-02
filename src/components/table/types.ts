import type {
  EnhancedTableProps,
  PaginationProps,
  PrimaryTableCol,
  TableRowData,
  TNode,
} from "tdesign-vue-next";
import type { Ref, VNode } from "vue";
import type { ProFieldValueEnumType, ProFieldValueType } from "../field/types";
import type { ProFormItemProps } from "../form/components";

export type ProNode = string | ((...args: unknown[]) => VNode);

// 基础数据类型
export interface RequestData<T = Record<string, unknown>> {
  data: T[];
  success?: boolean;
  total?: number;
  errorMessage?: string;
  [key: string]: unknown;
}

export interface PaginationParams {
  current: number;
  pageSize: number;
  total?: number;
}

export interface RequestParams extends PaginationParams {
  [key: string]: unknown;
}

// 排序信息
export interface SortInfo {
  [key: string]: "asc" | "desc" | null;
}

// 筛选信息
export interface FilterInfo {
  [key: string]: (string | number)[] | null;
}

// 列配置类型
export interface ProTableColumn<
  T extends TableRowData = TableRowData,
> extends Omit<PrimaryTableCol<T>, "cell"> {
  // ProTable 扩展属性
  valueType?:
    | ProFieldValueType
    | ((record?: T, type?: string) => ProFieldValueType);
  valueEnum?: ProFieldValueEnumType;

  // 显示控制
  hideInTable?: boolean;
  // hideInForm?: boolean
  // hideInSearch?: boolean
  form?: ProTableColumnFormItem & {
    searchForm?: false | ProTableColumnFormItem;
    updateForm?: false | ProTableColumnFormItem;
    createForm?: false | ProTableColumnFormItem;
  };
  cell?:
    | string
    | TNode<{
        row: T;
        rowIndex: number;
        col: PrimaryTableCol<T>;
        colIndex: number;
        dom: VNode;
        actionRef?: ActionRef;
      }>;
  // 编辑相关
  editable?: boolean | ((text: unknown, record: T, index: number) => boolean);

  // 复制功能
  copyable?: boolean;

  // 文本渲染处理
  renderText?: (
    text: unknown,
    record: T,
    index: number,
    action?: unknown,
  ) => unknown;

  // 表单项渲染
  formItemRender?: (
    schema: unknown,
    config: {
      defaultRender: () => VNode;
      type: string;
      recordKey?: string | number;
      record?: T;
      isEditable?: boolean;
    },
    form?: unknown,
    editableUtils?: unknown,
  ) => VNode | false | null;

  // 索引标识
  index?: number;

  // 搜索相关
  // search?: boolean | SearchColumnConfig

  // 表单相关
  // formItemProps?: Record<string, unknown>
  // fieldProps?: Record<string, unknown>
}

export interface ProTableColumnFormItem extends ProFormItemProps {
  valueEnum?: ProFieldValueEnumType;
  render?: VNode;
  fieldProps?: Record<string, unknown>;
  defaultValue?: unknown | (() => unknown);
  order?: number;
}

// 列状态配置
export interface ColumnsState {
  show?: boolean;
  fixed?: "left" | "right";
  order?: number;
  disable?: boolean;
}

// 搜索配置
export interface SearchConfig {
  labelWidth?: number | "auto";
  span?: number;
  collapsed?: boolean;
  defaultCollapsed?: boolean;
  collapseRender?: boolean | ((collapsed: boolean) => VNode);
  searchText?: string;
  resetText?: string;
  submitText?: string;
  showHiddenNum?: boolean;
  /** 过滤器类型：query=查询过滤器, light=轻量过滤器 */
  filterType?: "query" | "light";
  /** 搜索触发模式：onSearch=点击搜索按钮触发, onChange=输入时即时触发 */
  searchTrigger?: "onSearch" | "onChange";
  optionRender?:
    | boolean
    | ((
        searchConfig: SearchConfig,
        formProps: unknown,
        dom: VNode[],
      ) => VNode[]);
  onCollapse?: (collapsed: boolean) => void;
}

// 工具栏配置
export interface ToolbarConfig {
  title?: string;
  subTitle?: string;
  tooltip?: string;
  search?: boolean | SearchProps;
  actions?: VNode[];
  settings?: ToolbarSetting[];
  filter?: VNode;
  multipleLine?: boolean;
}

export interface SearchProps {
  placeholder?: string;
  onSearch?: (value: string) => void;
}

export interface ToolbarSetting {
  icon?: VNode;
  tooltip?: string;
  key?: string;
  onClick?: (key?: string) => void;
}

// 操作引用类型
export interface ActionRef {
  reload: (resetPageIndex?: boolean) => Promise<void>;
  reloadAndReset: () => Promise<void>;
  reset: () => void;
  clearSelected?: () => void;
  setPageInfo: (pageInfo: Partial<PaginationParams>) => void;
  setSortInfo?: (sortInfo: SortInfo) => void;
  setFilterInfo?: (filterInfo: FilterInfo) => void;
}

// ProTable 主要属性类型
export interface ProTableProps<
  T extends TableRowData = TableRowData,
> extends Omit<EnhancedTableProps, "columns" | "pagination"> {
  // 数据相关
  request?: (
    params: T & RequestParams,
    sort?: SortInfo,
    filter?: FilterInfo,
  ) => Promise<RequestData<T>>;
  dataSource?: T[];
  params?: Partial<T>;
  postData?: (data: T[]) => T[];
  defaultData?: T[];

  // 回调函数
  onLoad?: (dataSource: T[], extra: unknown) => void;
  onRequestError?: (error: Error) => void;
  onDataSourceChange?: (dataSource: T[]) => void;

  // 请求控制
  manual?: boolean;
  manualRequest?: boolean;
  debounceTime?: number;
  polling?: number | boolean;
  revalidateOnFocus?: boolean;

  // 列配置
  columns: ProTableColumn<T>[];

  // 搜索表单
  search?: boolean | SearchConfig;

  // 工具栏
  toolbar?: boolean | ToolbarConfig;
  toolbarRender?: (actionRef: Ref<ActionRef>) => VNode;

  // 卡片配置
  cardBordered?: boolean;
  ghost?: boolean;

  // 标题相关
  headerTitle?: string;
  tooltip?: string;

  // 分页
  pagination?: boolean | PaginationProps;

  // 其他属性
  loading?: boolean;
  rowKey: string;
  // 继承 Table 的其他属性
  [key: string]: unknown;
}
