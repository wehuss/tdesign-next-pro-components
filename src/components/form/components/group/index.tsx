import { ChevronRightIcon } from 'tdesign-icons-vue-next'
import { Space } from 'tdesign-vue-next'
import { computed, defineComponent, ref, type PropType, type VNode } from 'vue'
import { useFieldContext } from '../../field-context'

export interface ProFormGroupProps {
  /** 分组标题 */
  title?: string | VNode
  /** 标题别名 */
  label?: string | VNode
  /** 提示信息 */
  tooltip?: string | VNode
  /** 是否可折叠 */
  collapsible?: boolean
  /** 默认是否折叠 */
  defaultCollapsed?: boolean
  /** 受控折叠状态 */
  collapsed?: boolean
  /** 折叠状态变化回调 */
  onCollapse?: (collapsed: boolean) => void
  /** 间距大小 */
  size?: 'small' | 'medium' | 'large' | number
  /** 排列方向 */
  direction?: 'horizontal' | 'vertical'
  /** 对齐方式 */
  align?: 'start' | 'end' | 'center' | 'baseline'
  /** 是否自动换行 */
  wrap?: boolean
  /** 标题样式 */
  titleStyle?: Record<string, any>
  /** 自定义标题渲染 */
  titleRender?: (title: VNode | string | undefined, props: any) => VNode
  /** 额外内容 */
  extra?: VNode | string
  /** 标签布局 */
  labelLayout?: 'inline' | 'twoLine'
  /** 自动聚焦第一个字段 */
  autoFocus?: boolean
  /** Space 组件的额外属性 */
  spaceProps?: Record<string, any>
  /** 样式 */
  style?: Record<string, any>
  /** 类名 */
  class?: string
}

export const ProFormGroup = defineComponent({
  name: 'ProFormGroup',
  props: {
    title: [String, Object] as PropType<string | VNode>,
    label: [String, Object] as PropType<string | VNode>,
    tooltip: [String, Object] as PropType<string | VNode>,
    collapsible: {
      type: Boolean,
      default: false,
    },
    defaultCollapsed: {
      type: Boolean,
      default: false,
    },
    collapsed: {
      type: Boolean,
      default: undefined,
    },
    onCollapse: Function as PropType<(collapsed: boolean) => void>,
    size: {
      type: [String, Number] as PropType<'small' | 'medium' | 'large' | number>,
      default: 'medium',
    },
    direction: {
      type: String as PropType<'horizontal' | 'vertical'>,
      default: 'horizontal',
    },
    align: {
      type: String as PropType<'start' | 'end' | 'center' | 'baseline'>,
      default: 'start',
    },
    wrap: {
      type: Boolean,
      default: true,
    },
    titleStyle: {
      type: Object,
      default: () => ({}),
    },
    titleRender: Function as PropType<(title: VNode | string | undefined, props: any) => VNode>,
    extra: [String, Object] as PropType<VNode | string>,
    labelLayout: {
      type: String as PropType<'inline' | 'twoLine'>,
      default: 'inline',
    },
    autoFocus: {
      type: Boolean,
      default: false,
    },
    spaceProps: {
      type: Object,
      default: () => ({}),
    },
    style: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props, { slots }) {
    const fieldContext = useFieldContext()

    // 合并 groupProps
    const mergedProps = computed(() => ({
      ...fieldContext.groupProps,
      ...props,
    }))

    // 内部折叠状态
    const internalCollapsed = ref(props.defaultCollapsed)

    // 计算实际折叠状态（支持受控和非受控）
    const isCollapsed = computed(() => {
      if (props.collapsed !== undefined) {
        return props.collapsed
      }
      return internalCollapsed.value
    })

    // 切换折叠状态
    const toggleCollapse = () => {
      if (!mergedProps.value.collapsible) return

      const newCollapsed = !isCollapsed.value
      internalCollapsed.value = newCollapsed
      props.onCollapse?.(newCollapsed)
    }

    // 计算标题
    const displayTitle = computed(() => {
      return mergedProps.value.title || mergedProps.value.label
    })

    // 计算 Space 的 size
    const spaceSize = computed(() => {
      const size = mergedProps.value.size
      if (typeof size === 'number') {
        return size
      }
      return size
    })

    // 渲染折叠图标
    const renderCollapseIcon = () => {
      if (!mergedProps.value.collapsible) return null

      return (
        <ChevronRightIcon
          style={{
            marginRight: '8px',
            transition: 'transform 0.2s',
            transform: isCollapsed.value ? 'rotate(0deg)' : 'rotate(90deg)',
          }}
        />
      )
    }

    // 渲染标题内容
    const renderTitleContent = () => {
      const title = displayTitle.value
      const tooltip = mergedProps.value.tooltip

      const titleWithIcon = (
        <span style={{ display: 'inline-flex', alignItems: 'center' }}>
          {renderCollapseIcon()}
          {title}
          {tooltip && (
            <span
              style={{
                marginLeft: '4px',
                color: 'var(--td-text-color-placeholder)',
                fontSize: '12px',
              }}
              title={typeof tooltip === 'string' ? tooltip : undefined}
            >
              {typeof tooltip === 'string' ? '?' : tooltip}
            </span>
          )}
        </span>
      )

      if (mergedProps.value.titleRender) {
        return mergedProps.value.titleRender(titleWithIcon, props)
      }

      return titleWithIcon
    }

    // 渲染标题区域
    const renderTitle = () => {
      const title = displayTitle.value
      const tooltip = mergedProps.value.tooltip
      const extra = mergedProps.value.extra

      if (!title && !tooltip && !extra) return null

      const titleContent = renderTitleContent()

      return (
        <div
          class="pro-form-group-title"
          style={{
            marginBottom: '16px',
            fontWeight: 500,
            fontSize: '14px',
            cursor: mergedProps.value.collapsible ? 'pointer' : 'default',
            userSelect: mergedProps.value.collapsible ? 'none' : 'auto',
            ...mergedProps.value.titleStyle,
          }}
          onClick={toggleCollapse}
        >
          {extra ? (
            <div
              style={{
                display: 'flex',
                width: '100%',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              {titleContent}
              <span onClick={(e) => e.stopPropagation()}>{extra}</span>
            </div>
          ) : (
            titleContent
          )}
        </div>
      )
    }

    // 渲染内容
    const renderContent = () => {
      const children = slots.default?.()

      if (!children) return null

      return (
        <Space
          direction={mergedProps.value.direction}
          size={spaceSize.value}
          align={mergedProps.value.align}
          breakLine={mergedProps.value.wrap}
          {...mergedProps.value.spaceProps}
          class={['pro-form-group-container', mergedProps.value.spaceProps?.class]}
          style={{
            rowGap: 0,
            ...mergedProps.value.spaceProps?.style,
          }}
        >
          {children}
        </Space>
      )
    }

    return () => (
      <div
        class={[
          'pro-form-group',
          {
            'pro-form-group-two-line': mergedProps.value.labelLayout === 'twoLine',
          },
        ]}
        style={mergedProps.value.style}
      >
        {renderTitle()}
        <div
          style={{
            display: mergedProps.value.collapsible && isCollapsed.value ? 'none' : undefined,
          }}
        >
          {renderContent()}
        </div>
      </div>
    )
  },
})

export default ProFormGroup
