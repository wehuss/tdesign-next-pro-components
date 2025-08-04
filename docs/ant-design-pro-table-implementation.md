# Ant Design Pro Components Table 实现文档

## 架构设计

### 核心组件结构

```
src/table/
├── Table.tsx                 # 主入口组件
├── typing.ts                 # 类型定义
├── components/
│   ├── Form/                 # 搜索表单相关
│   │   ├── FormRender.tsx    # 表单渲染器
│   │   └── index.tsx         # 表单组件
│   ├── ToolBar/              # 工具栏相关
│   │   ├── index.tsx         # 工具栏主组件
│   │   ├── DensityIcon.tsx   # 密度调整
│   │   ├── FullScreenIcon.tsx # 全屏功能
│   │   └── ColumnSetting.tsx  # 列设置
│   ├── ListToolBar/          # 列表工具栏
│   │   ├── index.tsx         # 主组件
│   │   └── HeaderMenu.tsx    # 头部菜单
│   ├── Alert/                # 批量操作提示
│   └── EditableTable/        # 可编辑表格
├── hooks/
│   ├── useFetchData.ts       # 数据获取 Hook
│   ├── useActionType.ts      # 操作类型 Hook
│   └── useEditableArray.ts   # 可编辑数组 Hook
└── Store/
    └── Provide.tsx           # 状态管理
```

## 核心实现分析

### 1. 主入口组件 (Table.tsx)

#### 组件架构

```tsx
function ProTable<T, U, ValueType>(props: ProTableProps<T, U, ValueType>) {
  // 1. State 管理
  const [selectedRowKeys, setSelectedRowKeys] = useMergedState<React.Key[]>([])
  const [formSearch, setFormSearch] = useMountMergeState<Record<string, any>>()
  const [proFilter, setProFilter] = useMountMergeState<Record<string, any>>({})
  const [proSort, setProSort] = useMountMergeState<Record<string, SortOrder>>(
    {}
  )

  // 2. 数据获取
  const action = useFetchData(
    async ({ pageSize, current, keyword, ...formParams } = {} as any) => {
      // 数据请求逻辑
      const actionParams = {
        pageSize,
        current,
        ...formParams,
        ...params,
      }

      const response = await request?.(actionParams, proSort, proFilter)
      return {
        data: response?.data || [],
        success: response?.success !== false,
        total: response?.total || response?.data?.length || 0,
      }
    },
    [request, proSort, proFilter, params]
  )

  // 3. 列处理
  const tableColumn = useMemo(() => {
    return genProTableColumnToColumn({
      columns: propsColumns,
      counter,
      columnEmptyText,
      type: 'table',
      editableUtils,
    }).map(item => {
      // 处理排序、筛选等逻辑
      return item
    })
  }, [propsColumns, counter, columnEmptyText, editableUtils])

  // 4. 渲染
  return (
    <TableRender
      {...props}
      tableColumn={tableColumn}
      action={action}
      toolbarDom={toolbarDom}
      searchNode={searchNode}
      alertDom={alertDom}
    />
  )
}
```

### 2. 数据获取 Hook (useFetchData.ts)

#### 核心实现

```tsx
export function useFetchData<T>(
  getData: (params?: any) => Promise<RequestData<T>>,
  dependencies: DependencyList = [],
  options: {
    defaultPageSize?: number
    onRequestError?: (error: Error) => void
    effects?: DependencyList
  } = {}
): UseFetchDataAction<T> {
  const [list, setList] = useState<T[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [pageInfo, setPageInfo] = useState<PageInfo>({
    current: 1,
    pageSize: options.defaultPageSize || 20,
    total: 0,
  })

  // 数据获取函数
  const fetchData = useCallback(
    async (params?: any) => {
      setLoading(true)
      try {
        const { data, success, total } = await getData({
          current: pageInfo.current,
          pageSize: pageInfo.pageSize,
          ...params,
        })

        if (success !== false) {
          setList(data || [])
          setPageInfo(prev => ({
            ...prev,
            total: total || data?.length || 0,
          }))
        }
      } catch (error) {
        options.onRequestError?.(error as Error)
      } finally {
        setLoading(false)
      }
    },
    [getData, pageInfo.current, pageInfo.pageSize, options]
  )

  // 自动触发
  useEffect(() => {
    fetchData()
  }, dependencies)

  return {
    dataSource: list,
    setDataSource: setList,
    loading,
    pageInfo,
    reload: () => fetchData(),
    reset: () => {
      setPageInfo(prev => ({ ...prev, current: 1 }))
      fetchData({ current: 1 })
    },
    setPageInfo,
  }
}
```

### 3. 列处理 (genProTableColumnToColumn)

#### 列转换逻辑

```tsx
export function genProTableColumnToColumn<T>(options: {
  columns: ProTableColumns<T, any>[]
  counter: ReturnType<typeof useContainer>
  columnEmptyText: ProTableProps<any, any, any>['columnEmptyText']
  type: ProSchemaComponentTypes
  editableUtils?: UseEditableUtilType
}): (ColumnType<T> & { index?: number; isExtraColumns?: boolean })[] {
  const { columns, counter, columnEmptyText, type, editableUtils } = options

  return columns
    .filter(columnProps => {
      // 过滤不需要的列
      if (columnProps.hideInTable && type === 'table') {
        return false
      }
      return true
    })
    .map((columnProps, columnsIndex) => {
      const {
        valueEnum,
        valueType = 'text',
        dataIndex,
        title,
        render,
        renderText,
        fieldProps,
        children,
        ...rest
      } = columnProps

      // 处理 valueType
      const columnType = genColumnList(
        {
          ...columnProps,
          type,
          columnEmptyText,
        },
        {
          counter,
          editableUtils,
        }
      )

      // 生成渲染函数
      const tempColumns: ColumnType<T> & {
        index?: number
        isExtraColumns?: boolean
        extraColumn?: boolean
      } = {
        index: columnsIndex,
        ...rest,
        title,
        ...columnType,
        render: (text: any, record: T, index: number) => {
          const renderDom = columnType?.render?.(
            text,
            record,
            index,
            counter.action.current
          )

          if (render) {
            return render(renderDom, record, index, counter.action.current)
          }
          return renderDom
        },
      }

      return tempColumns
    })
}
```

### 4. 搜索表单 (Form/FormRender.tsx)

#### 表单生成逻辑

```tsx
export function FormRender<T, U = Record<string, any>>(
  props: FormRenderProps<T, U>
) {
  const {
    columns,
    type = 'form',
    formRef,
    onFormSearchSubmit,
    search,
    manualRequest,
    ...rest
  } = props

  // 生成表单项
  const searchConfig = useMemo(() => {
    return columns
      .filter(item => {
        // 过滤搜索字段
        if (item.hideInSearch) return false
        if (type === 'form' && item.hideInForm) return false
        return true
      })
      .sort((a, b) => (b.order || 0) - (a.order || 0))
      .map(item => {
        const {
          valueType = 'text',
          dataIndex,
          title,
          tooltip,
          valueEnum,
          fieldProps,
          formItemProps,
          formItemRender,
          ...rest
        } = item

        // 生成表单项配置
        const itemConfig = {
          ...rest,
          label: title,
          name: dataIndex,
          tooltip,
          valueType,
          valueEnum,
          fieldProps: {
            ...fieldProps,
            placeholder: `请输入${title}`,
          },
          formItemProps,
          formItemRender,
        }

        return itemConfig
      })
  }, [columns, type])

  // 表单提交
  const onFinish = useCallback(
    (values: Record<string, any>) => {
      // 数据转换
      const params = transformSearchParams(values, searchConfig)
      onFormSearchSubmit?.(params)
    },
    [onFormSearchSubmit, searchConfig]
  )

  return (
    <ProForm
      {...rest}
      formRef={formRef}
      onFinish={onFinish}
      submitter={{
        render: (props, dom) => {
          return renderSearchActions(dom, props, search)
        },
      }}
    >
      {searchConfig.map(item => (
        <ProFormField key={item.name as string} {...item} />
      ))}
    </ProForm>
  )
}
```

### 5. 工具栏实现 (ToolBar/index.tsx)

#### 工具栏组件

```tsx
function ToolBar<T>({
  headerTitle,
  tooltip,
  toolBarRender,
  action,
  options,
  columns,
  ...rest
}: ToolBarProps<T>) {
  const intl = useIntl()

  // 默认选项
  const optionDom = useMemo(() => {
    const defaultOptions = {
      reload: () => action?.current?.reload(),
      density: true,
      setting: true,
      search: false,
      fullScreen: () => action?.current?.fullScreen?.(),
    }

    if (options === false) {
      return []
    }

    const mergedOptions = {
      ...defaultOptions,
      fullScreen: false,
      ...options,
    }

    return renderDefaultOption<T>(
      mergedOptions,
      { ...defaultOptions, intl },
      action,
      columns
    )
  }, [action, columns, intl, options])

  // 自定义按钮
  const actions = toolBarRender
    ? toolBarRender(action?.current, { selectedRowKeys, selectedRows })
    : []

  return (
    <ListToolBar
      title={headerTitle}
      tooltip={tooltip}
      actions={actions}
      settings={optionDom}
      {...rest}
    />
  )
}
```

### 6. 列设置实现 (ColumnSetting.tsx)

#### 列设置逻辑

```tsx
function ColumnSetting<T>({
  columns,
  draggable = true,
  checkable = true,
  extra,
  children,
}: ColumnSettingProps<T>) {
  const counter = useContext(ProTableContext)
  const localColumns = useContext(ProTableContext)

  const [checkAll, setCheckAll] = useState(true)
  const [checkedList, setCheckedList] = useState<string[]>([])
  const [indeterminate, setIndeterminate] = useState(false)

  // 处理列显示/隐藏
  const onChange = useCallback(
    (list: string[]) => {
      setCheckedList(list)
      setIndeterminate(!!list.length && list.length < columns.length)
      setCheckAll(list.length === columns.length)

      // 更新列状态
      const columnKeyMap = new Map()
      list.forEach(key => columnKeyMap.set(key, { show: true }))
      columns.forEach(item => {
        const key = genColumnKey(item.key, item.dataIndex)
        if (!columnKeyMap.has(key)) {
          columnKeyMap.set(key, { show: false })
        }
      })

      localColumns.setColumnsMap(columnKeyMap)
    },
    [columns, localColumns]
  )

  return (
    <div className="pro-table-column-setting">
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {provided => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {columns.map((item, index) => (
                <ColumnSettingItem
                  key={genColumnKey(item.key, item.dataIndex)}
                  item={item}
                  index={index}
                  checked={checkedList.includes(
                    genColumnKey(item.key, item.dataIndex)
                  )}
                  onChange={onChange}
                  draggable={draggable}
                  checkable={checkable}
                />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  )
}
```

## 关键技术实现

### 1. 状态管理

#### Container Provider

```tsx
export function Container(props: ContainerProps) {
  const [columnsMap, setColumnsMap] = useState<Record<string, ColumnsState>>({})
  const [sortKeyColumns, setSortKeyColumns] = useState<string[]>([])
  const [tableSize, setTableSize] = useState<SizeType>('large')
  const [formSearch, setFormSearch] = useState<Record<string, any>>({})
  const [keyWords, setKeyWords] = useState<string | undefined>('')

  const action = useRef<ActionType>()

  const context = useMemo(
    () => ({
      action,
      columnsMap,
      setColumnsMap,
      sortKeyColumns,
      setSortKeyColumns,
      tableSize,
      setTableSize,
      formSearch,
      setFormSearch,
      keyWords,
      setKeyWords,
    }),
    [columnsMap, sortKeyColumns, tableSize, formSearch, keyWords]
  )

  return (
    <TableContext.Provider value={context}>
      {props.children}
    </TableContext.Provider>
  )
}
```

### 2. 响应式处理

#### useBreakpoint Hook

```tsx
function useBreakpoint() {
  const [screens, setScreens] = useState<Record<string, boolean>>({})

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      setScreens({
        xs: width < 576,
        sm: width >= 576 && width < 768,
        md: width >= 768 && width < 992,
        lg: width >= 992 && width < 1200,
        xl: width >= 1200 && width < 1600,
        xxl: width >= 1600,
      })
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return screens
}
```

### 3. 性能优化

#### memoization 策略

```tsx
// 列计算优化
const tableColumn = useMemo(() => {
  return genProTableColumnToColumn({
    columns: propsColumns,
    counter,
    columnEmptyText,
    type: 'table',
    editableUtils,
  })
}, [propsColumns, counter, columnEmptyText, editableUtils])

// 搜索节点优化
const searchNode = useMemo(() => {
  if (search === false) return null

  return (
    <FormRender
      columns={propsColumns}
      onFormSearchSubmit={params => {
        action.setDataSource([])
        setFormSearch(params)
      }}
      {...search}
    />
  )
}, [search, propsColumns, action, setFormSearch])
```

### 4. 类型系统

#### 泛型设计

```tsx
export interface ProTableProps<
  DataType = any,
  Params = Record<string, any>,
  ValueType = 'text',
> extends Omit<
    TableProps<DataType>,
    'columns' | 'pagination' | 'loading' | 'dataSource'
  > {
  columns?: ProTableColumns<DataType, ValueType>[]
  params?: Partial<Params>
  request?: (
    params: Params & {
      pageSize?: number
      current?: number
      keyword?: string
    },
    sort: Record<string, SortOrder>,
    filter: Record<string, (string | number)[] | null>
  ) => Promise<Partial<RequestData<DataType>>>

  // 其他属性...
}

export interface ProTableColumns<T = any, ValueType = 'text'>
  extends Omit<ColumnType<T>, 'render' | 'children' | 'title'> {
  // ProTable 特有属性
  valueType?: ValueType
  valueEnum?: Record<string, any>
  hideInTable?: boolean
  hideInForm?: boolean
  hideInSearch?: boolean

  // 渲染相关
  render?: (
    dom: ReactNode,
    entity: T,
    index: number,
    action: UseFetchDataAction<T>,
    schema: ProTableColumns<T, ValueType> & {
      type: ProSchemaComponentTypes
    }
  ) => ReactNode

  // 其他属性...
}
```

## 开发指南

### 1. 添加新的 ValueType

```tsx
// 1. 在 typing.ts 中添加类型定义
export type ProFieldValueType =
  | 'text'
  | 'custom'  // 新增的类型
  | ...;

// 2. 在 valueTypeMap.tsx 中添加处理逻辑
const valueTypeMap: Record<string, any> = {
  text: {
    render: (text) => text,
    renderFormItem: (text, props) => <Input {...props} />,
  },
  custom: {
    render: (text) => <CustomComponent value={text} />,
    renderFormItem: (text, props) => <CustomInput {...props} />,
  },
  // ...
};

// 3. 添加相应的组件实现
function CustomComponent({ value, ...props }) {
  return <div className="custom-component">{value}</div>;
}

function CustomInput({ value, onChange, ...props }) {
  return (
    <Input
      {...props}
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      prefix={<CustomIcon />}
    />
  );
}
```

### 2. 自定义工具栏功能

```tsx
// 在 ToolBar/index.tsx 中添加新功能
function renderDefaultOption<T>(
  options: OptionConfig,
  defaultOptions: OptionConfig & { intl: IntlType },
  actions: React.MutableRefObject<ActionType | undefined>,
  columns: TableColumnType<T>[]
) {
  const optionDom = []

  // 添加自定义功能
  if (options.customFeature) {
    optionDom.push(
      <Tooltip key="custom" title="自定义功能">
        <CustomIcon onClick={() => handleCustomAction(actions.current)} />
      </Tooltip>
    )
  }

  return optionDom
}
```

### 3. 扩展搜索表单

```tsx
// 添加自定义搜索组件
export function CustomSearchForm<T>({
  columns,
  onSubmit,
  ...props
}: CustomSearchFormProps<T>) {
  return (
    <ProForm layout="inline" onFinish={onSubmit} {...props}>
      {columns.map(column => {
        if (column.hideInSearch) return null

        return (
          <ProFormField
            key={column.dataIndex as string}
            name={column.dataIndex}
            label={column.title}
            valueType={column.valueType}
            {...column.fieldProps}
          />
        )
      })}

      <ProFormGroup>
        <Button type="primary" htmlType="submit">
          搜索
        </Button>
        <Button onClick={() => form.resetFields()}>重置</Button>
      </ProFormGroup>
    </ProForm>
  )
}
```

这份实现文档详细介绍了 Ant Design Pro Components Table 的内部架构和关键实现，为开发 TDesign Pro Table 提供了重要的参考和指导。
