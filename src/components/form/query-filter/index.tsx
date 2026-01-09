import { ChevronDownIcon, ChevronUpIcon, RefreshIcon, SearchIcon } from 'tdesign-icons-vue-next'
import { Button, FormItem, Space } from 'tdesign-vue-next'
import type { VNode } from 'vue'
import { computed, defineComponent, onMounted, onUnmounted, ref, watch } from 'vue'
import { BaseForm } from '../base-form/base-form'
import { FlexCol, FlexRow } from '../helpers/flex-grid'
import './style.less'

// 配置表单列变化的容器宽度断点
const BREAKPOINTS = {
  vertical: [
    [513, 1, 'vertical'],
    [785, 2, 'vertical'],
    [1057, 3, 'vertical'],
    [Infinity, 4, 'vertical'],
  ],
  default: [
    [513, 1, 'vertical'],
    [701, 2, 'vertical'],
    [1062, 3, 'inline'],
    [1352, 3, 'inline'],
    [Infinity, 4, 'inline'],
  ],
  inline: [
    [513, 1, 'vertical'],
    [701, 2, 'vertical'],
    [1062, 3, 'inline'],
    [1352, 3, 'inline'],
    [Infinity, 4, 'inline'],
  ],
}

export type SpanConfig =
  | number
  | {
      xs: number
      sm: number
      md: number
      lg: number
      xl: number
      xxl: number
    }

export interface QueryFilterProps {
  // 查询表单特有属性
  defaultCollapsed?: boolean
  collapsed?: boolean
  /** 表单数据 */
  data?: Record<string, any>
  collapseRender?:
    | ((collapsed: boolean, showCollapseButton: boolean, hiddenNum?: number) => VNode)
    | false
  optionRender?: ((searchConfig: any, formProps: any, dom: VNode[]) => VNode[]) | false
  searchText?: string
  resetText?: string
  submitButtonProps?: any
  resetButtonProps?: any
  // 布局相关
  layout?: 'vertical' | 'inline'
  span?: SpanConfig
  labelWidth?: number | 'auto'
  defaultColsNumber?: number
  defaultFormItemsNumber?: number
  searchGutter?: number
  split?: boolean
  // 是否显示隐藏数量
  showHiddenNum?: boolean
  // 是否忽略规则
  ignoreRules?: boolean
  // 是否保留隐藏字段
  preserve?: boolean
  // 容器样式
  containerStyle?: Record<string, any>
  // 事件回调
  onCollapse?: (collapsed: boolean) => void
  onSearch?: (values: any) => void
  onReset?: (values: any) => void
}

// 获取 span 配置
const getSpanConfig = (
  layout: string | undefined,
  width: number,
  span?: SpanConfig,
): { span: number; layout: string } => {
  if (span && typeof span === 'number') {
    return { span, layout: layout || 'inline' }
  }

  const spanConfig = BREAKPOINTS[(layout as 'default' | 'vertical') || 'default']
  const breakPoint = spanConfig.find((item) => width < (item[0] as number) + 16)

  if (!breakPoint) {
    return { span: 8, layout: 'inline' }
  }

  return {
    span: 24 / (breakPoint[1] as number),
    layout: breakPoint[2] as string,
  }
}

export const QueryFilter = defineComponent({
  name: 'QueryFilter',
  props: {
    // QueryFilter 特有属性
    defaultCollapsed: {
      type: Boolean,
      default: true,
    },
    collapsed: {
      type: Boolean,
      default: undefined,
    },
    collapseRender: {
      type: [Function, Boolean],
      default: undefined,
    },
    optionRender: {
      type: [Function, Boolean],
      default: undefined,
    },
    searchText: {
      type: String,
      default: '搜索',
    },
    resetText: {
      type: String,
      default: '重置',
    },
    submitButtonProps: {
      type: Object,
      default: () => ({}),
    },
    resetButtonProps: {
      type: Object,
      default: () => ({}),
    },
    layout: {
      type: String,
      default: 'inline',
    },
    span: {
      type: [Number, Object],
    },
    labelWidth: {
      type: [Number, String],
      default: 80,
    },
    defaultColsNumber: {
      type: Number,
    },
    defaultFormItemsNumber: {
      type: Number,
    },
    searchGutter: {
      type: Number,
      default: 24,
    },
    split: {
      type: Boolean,
      default: false,
    },
    showHiddenNum: {
      type: Boolean,
      default: false,
    },
    ignoreRules: {
      type: Boolean,
      default: false,
    },
    preserve: {
      type: Boolean,
      default: true,
    },
    containerStyle: {
      type: Object,
      default: () => ({}),
    },
    onCollapse: {
      type: Function,
    },
    onSearch: {
      type: Function,
    },
    onReset: {
      type: Function,
    },
    data: {
      type: Object,
      default: undefined,
    },
  },
  emits: ['update:collapsed', 'collapse', 'search', 'reset', 'finish'],
  setup(props, { slots, emit, expose }) {
    const formRef = ref()
    const containerRef = ref<HTMLDivElement>()
    const containerWidth = ref(1024)
    const internalCollapsed = ref(props.collapsed ?? props.defaultCollapsed)

    // 监听外部 collapsed 变化
    watch(
      () => props.collapsed,
      (newVal) => {
        if (newVal !== undefined) {
          internalCollapsed.value = newVal
        }
      },
    )

    // 计算 span 配置
    const spanSize = computed(() =>
      getSpanConfig(props.layout, containerWidth.value + 16, props.span as SpanConfig),
    )

    // 计算显示数量
    const showLength = computed(() => {
      if (props.defaultFormItemsNumber !== undefined) {
        return props.defaultFormItemsNumber
      }
      if (props.defaultColsNumber !== undefined) {
        const oneRowControlsNumber = 24 / spanSize.value.span - 1
        return props.defaultColsNumber > oneRowControlsNumber
          ? oneRowControlsNumber
          : props.defaultColsNumber
      }
      return Math.max(1, 24 / spanSize.value.span - 1)
    })

    // 切换折叠状态
    const toggleCollapsed = () => {
      const newCollapsed = !internalCollapsed.value
      internalCollapsed.value = newCollapsed
      emit('update:collapsed', newCollapsed)
      ;(props.onCollapse as any)?.(newCollapsed)
      emit('collapse', newCollapsed)
    }

    // 处理搜索 - 接收来自表单提交的值
    const handleSearch = async (values?: any) => {
      try {
        const formValues = values || formRef.value?.getFieldsValue?.() || {}
        emit('search', formValues)
        emit('finish', formValues)
      } catch (error) {
        console.error('Query filter search error:', error)
      }
    }

    // 处理重置
    const handleReset = () => {
      formRef.value?.reset?.()
      const values = formRef.value?.getFieldsValue?.() || {}
      ;(props.onReset as any)?.(values)
      emit('reset', values)
    }

    // 监听容器宽度变化
    let resizeObserver: ResizeObserver | null = null

    onMounted(() => {
      if (containerRef.value) {
        containerWidth.value = containerRef.value.offsetWidth

        resizeObserver = new ResizeObserver((entries) => {
          for (const entry of entries) {
            if (entry.contentRect.width > 17) {
              containerWidth.value = entry.contentRect.width
            }
          }
        })
        resizeObserver.observe(containerRef.value)
      }
    })

    onUnmounted(() => {
      resizeObserver?.disconnect()
    })

    // 暴露方法
    expose({
      submit: handleSearch,
      reset: handleReset,
      validate: () => formRef.value?.validate(),
      getFieldsValue: () => formRef.value?.getFieldsValue(),
      setFieldsValue: (values: any) => formRef.value?.setFieldsValue(values),
    })

    // 内容渲染 - 参照 raw/src/form/layouts/QueryFilter/index.tsx 的逻辑
    const contentRender = (items: VNode[], _submitter: VNode | null) => {
      // 扁平化 items 数组 - Vue 的 slot 可能会返回嵌套数组
      const flatItems = (items || [])
        .flatMap((item: any) => {
          // console.log("item", item);
          // 如果 item 是数组，则展开
          if (Array.isArray(item)) {
            return item
          }
          // console.log("item?.type?.toString()", item?.type?.toString());
          // 如果 item 有 children 且是 Fragment，展开 children
          if (item?.type?.toString() === 'Symbol(v-fgt)' && item?.children) {
            return Array.isArray(item.children) ? item.children : [item.children]
          }
          return [item]
        })
        .filter(Boolean)

      // console.log("flatItems", flatItems);

      // 处理表单项
      let totalSpan = 0
      let totalSize = 0
      let currentSpan = 0
      let firstRowFull = false
      let hiddenCount = 0

      // 先计算每个item的属性和隐藏状态
      const processedItems = flatItems.map((item: any, index: number) => {
        const colSize = item?.props?.colSize ?? 1
        const colSpan = Math.min(spanSize.value.span * colSize, 24)

        // 累计总 span 和 size
        totalSpan += colSpan
        totalSize += colSize

        // 检查第一行是否被填满
        if (index === 0) {
          firstRowFull = colSpan === 24 && !item?.props?.hidden
        }

        // 计算是否隐藏：
        // 1. 如果 item 自己设置了 hidden
        // 2. 如果处于折叠状态，且 (第一个占满一行 或 超过显示长度) 且不是第一个
        const hidden: boolean =
          item?.props?.hidden ||
          (internalCollapsed.value && (firstRowFull || totalSize > showLength.value) && index > 0)

        if (hidden) {
          hiddenCount++
          if (!props.preserve) {
            return null
          }
        }

        // 处理换行：如果当前行剩余空间放不下，折行
        if (24 - (currentSpan % 24) < colSpan && !hidden) {
          currentSpan += 24 - (currentSpan % 24)
        }

        if (!hidden) {
          currentSpan += colSpan
        }

        const itemKey = item?.key || item?.props?.name || index

        return (
          <FlexCol key={itemKey} span={colSpan} hidden={hidden}>
            {item}
          </FlexCol>
        )
      })

      // 计算 offset - 使用 currentSpan（已处理换行）
      const submitterSpan = spanSize.value.span
      const offsetSpan = (currentSpan % 24) + submitterSpan
      const offset = offsetSpan > 24 ? 24 - submitterSpan : 24 - offsetSpan

      // 是否需要显示折叠按钮
      const needCollapseRender = totalSpan >= 24 || totalSize > showLength.value

      // 默认操作按钮 - 直接调用 handleSearch 而不是通过 formRef.submit
      // 这样可以确保正确触发搜索事件
      const defaultActions = [
        <Button
          key="search"
          theme="primary"
          icon={() => <SearchIcon />}
          onClick={async () => {
            // 获取表单值并直接调用搜索处理
            const values = formRef.value?.getFieldsValue?.() || {}
            await handleSearch(values)
          }}
          {...props.submitButtonProps}
        >
          {props.searchText}
        </Button>,
        <Button
          key="reset"
          variant="outline"
          icon={() => <RefreshIcon />}
          onClick={handleReset}
          {...props.resetButtonProps}
        >
          {props.resetText}
        </Button>,
      ]

      // 折叠按钮
      const collapseButton =
        props.collapseRender !== false && needCollapseRender ? (
          typeof props.collapseRender === 'function' ? (
            (props.collapseRender as any)(
              internalCollapsed.value,
              needCollapseRender,
              props.showHiddenNum ? hiddenCount : undefined,
            )
          ) : (
            <Button
              key="collapse"
              variant="text"
              onClick={toggleCollapsed}
              style={{ paddingLeft: '8px' }}
            >
              {internalCollapsed.value ? '展开' : '收起'}
              {props.showHiddenNum && hiddenCount > 0 && (
                <span style={{ marginLeft: '4px' }}>({hiddenCount})</span>
              )}
              {internalCollapsed.value ? (
                <ChevronDownIcon style={{ marginLeft: '4px' }} />
              ) : (
                <ChevronUpIcon style={{ marginLeft: '4px' }} />
              )}
            </Button>
          )
        ) : null

      // 操作区域
      const actionsNode =
        props.optionRender !== false
          ? typeof props.optionRender === 'function'
            ? (props.optionRender as any)(
                { resetText: props.resetText, searchText: props.searchText },
                props,
                defaultActions,
              )
            : defaultActions
          : null

      return (
        <FlexRow gap={24} class="pro-query-filter-row">
          {processedItems}
          {actionsNode && (
            <FlexCol key="submitter" span={submitterSpan} offset={offset}>
              <FormItem labelWidth={0} class="pro-query-filter-actions">
                <Space>
                  {actionsNode}
                  {collapseButton}
                </Space>
              </FormItem>
            </FlexCol>
          )}
        </FlexRow>
      )
    }

    return () => (
      <div ref={containerRef} class="pro-query-filter-container" style={props.containerStyle}>
        <BaseForm
          ref={formRef}
          layout={spanSize.value.layout as 'vertical' | 'inline'}
          isKeyPressSubmit
          class="pro-query-filter"
          data={props.data}
          onFinish={handleSearch}
          onReset={handleReset}
          contentRender={contentRender}
          submitter={false}
          fieldProps={{
            style: { width: '100%' },
          }}
          v-slots={{
            default: slots.default,
          }}
        />
      </div>
    )
  },
})

export default QueryFilter
