/**
 * ListToolBar 列表工具栏组件
 * 用于列表页面的工具栏，支持标题、搜索、操作按钮和设置
 * 参考 ant-design/pro-components ListToolBar 组件
 */

import { Input, Space, Tabs, Tooltip } from 'tdesign-vue-next'
import type { PropType, VNode } from 'vue'
import { computed, defineComponent, ref } from 'vue'
import HeaderMenu, { type ListToolBarMenuItem } from '../header-menu'
import './style.less'

// 设置项类型
export interface ListToolBarSetting {
  icon: VNode | (() => VNode)
  tooltip?: string
  key?: string
  onClick?: (key?: string) => void
}

// Tab 配置
export interface ListToolBarTab {
  key: string
  tab: string | VNode
  disabled?: boolean
}

export interface ListToolBarTabs {
  activeKey?: string
  defaultActiveKey?: string
  onChange?: (activeKey: string) => void
  items?: ListToolBarTab[]
}

// 菜单配置
export interface ListToolBarMenu {
  type?: 'inline' | 'dropdown' | 'tab'
  activeKey?: string | number
  defaultActiveKey?: string | number
  items?: ListToolBarMenuItem[]
  onChange?: (activeKey?: string | number) => void
}

// 搜索配置
export interface ListToolBarSearchProps {
  placeholder?: string
  onSearch?: (value: string) => Promise<false | void> | false | void
}

export interface ListToolBarProps {
  prefixCls?: string
  className?: string
  style?: Record<string, string>
  title?: string | VNode
  subTitle?: string | VNode
  tooltip?: string
  search?: ListToolBarSearchProps | VNode | boolean
  onSearch?: (keyWords: string) => void
  actions?: VNode[]
  settings?: (VNode | ListToolBarSetting)[]
  multipleLine?: boolean
  filter?: VNode
  tabs?: ListToolBarTabs
  menu?: ListToolBarMenu
}

// 获取设置项 DOM
const getSettingItem = (setting: VNode | ListToolBarSetting) => {
  // 如果是 VNode，直接返回
  if (setting && typeof setting === 'object' && 'type' in setting) {
    return setting
  }

  // 如果是配置对象
  const settingConfig = setting as ListToolBarSetting
  const { icon, tooltip, onClick, key } = settingConfig

  const iconNode = typeof icon === 'function' ? icon() : icon

  if (tooltip) {
    return (
      <Tooltip content={tooltip}>
        <span
          class="t-pro-list-toolbar-setting-item"
          onClick={() => onClick?.(key)}
        >
          {iconNode}
        </span>
      </Tooltip>
    )
  }

  return (
    <span
      class="t-pro-list-toolbar-setting-item"
      onClick={() => onClick?.(key)}
    >
      {iconNode}
    </span>
  )
}

export default defineComponent({
  name: 'ListToolBar',
  props: {
    prefixCls: {
      type: String,
      default: 't-pro-list-toolbar',
    },
    className: String,
    style: Object as PropType<Record<string, string>>,
    title: [String, Object] as PropType<string | VNode>,
    subTitle: [String, Object] as PropType<string | VNode>,
    tooltip: String,
    search: [Object, Boolean] as PropType<
      ListToolBarSearchProps | VNode | boolean
    >,
    onSearch: Function as PropType<(keyWords: string) => void>,
    actions: Array as PropType<VNode[]>,
    settings: Array as PropType<(VNode | ListToolBarSetting)[]>,
    multipleLine: {
      type: Boolean,
      default: false,
    },
    filter: Object as PropType<VNode>,
    tabs: Object as PropType<ListToolBarTabs>,
    menu: Object as PropType<ListToolBarMenu>,
  },
  setup(props) {
    const searchValue = ref('')

    // 是否有标题
    const hasTitle = computed(() => {
      return props.menu || props.title || props.subTitle || props.tooltip
    })

    // 渲染搜索框
    const renderSearch = () => {
      if (!props.search) return null

      // 如果是 VNode
      if (typeof props.search === 'object' && 'type' in props.search) {
        return props.search
      }

      // 如果是 boolean true，使用默认配置
      const searchConfig = typeof props.search === 'object' ? props.search : {}
      const placeholder = searchConfig.placeholder || '请输入'

      return (
        <Input
          v-model={searchValue.value}
          placeholder={placeholder}
          clearable
          style={{ width: '200px' }}
          onEnter={async () => {
            const result = await searchConfig.onSearch?.(searchValue.value)
            if (result !== false) {
              props.onSearch?.(searchValue.value)
            }
          }}
          onClear={() => {
            searchValue.value = ''
            props.onSearch?.('')
          }}
        />
      )
    }

    // 渲染过滤器
    const renderFilter = () => {
      if (!props.filter) return null
      return <div class={`${props.prefixCls}-filter`}>{props.filter}</div>
    }

    // 渲染标题
    const renderTitle = () => {
      if (!props.title && !props.subTitle && !props.tooltip) return null

      return (
        <div class={`${props.prefixCls}-title`}>
          {props.title && (
            <span class={`${props.prefixCls}-title-text`}>{props.title}</span>
          )}
          {props.subTitle && (
            <span class={`${props.prefixCls}-title-sub`}>{props.subTitle}</span>
          )}
          {props.tooltip && (
            <Tooltip content={props.tooltip}>
              <span class={`${props.prefixCls}-title-tip`}>?</span>
            </Tooltip>
          )}
        </div>
      )
    }

    // 渲染左侧内容
    const renderLeft = () => {
      const hasMenu =
        props.menu && props.menu.items && props.menu.items.length > 0

      if (!hasMenu && (hasTitle.value || !props.search)) {
        return <div class={`${props.prefixCls}-left`}>{renderTitle()}</div>
      }

      return (
        <div
          class={[
            `${props.prefixCls}-left`,
            {
              [`${props.prefixCls}-left-has-tabs`]: props.menu?.type === 'tab',
              [`${props.prefixCls}-left-has-dropdown`]:
                props.menu?.type === 'dropdown',
              [`${props.prefixCls}-left-has-inline-menu`]:
                props.menu?.type === 'inline',
            },
          ]}
        >
          {hasTitle.value && !hasMenu && renderTitle()}
          {hasMenu && (
            <HeaderMenu {...props.menu} prefixCls={props.prefixCls} />
          )}
          {!hasTitle.value && props.search && (
            <div class={`${props.prefixCls}-search`}>{renderSearch()}</div>
          )}
        </div>
      )
    }

    // 渲染右侧内容
    const renderRight = () => {
      const hasRight =
        (hasTitle.value && props.search) ||
        (!props.multipleLine && props.filter) ||
        (props.actions && props.actions.length > 0) ||
        (props.settings && props.settings.length > 0)

      if (!hasRight) return null

      return (
        <div class={`${props.prefixCls}-right`}>
          {!props.multipleLine && renderFilter()}
          {hasTitle.value && props.search && (
            <div class={`${props.prefixCls}-search`}>{renderSearch()}</div>
          )}
          {props.actions && props.actions.length > 0 && (
            <Space size="small">
              {props.actions.map((action, index) => (
                <span key={index}>{action}</span>
              ))}
            </Space>
          )}
          {props.settings && props.settings.length > 0 && (
            <div class={`${props.prefixCls}-setting-items`}>
              {props.settings.map((setting, index) => (
                <div key={index} class={`${props.prefixCls}-setting-item`}>
                  {getSettingItem(setting)}
                </div>
              ))}
            </div>
          )}
        </div>
      )
    }

    // 渲染 Tab 栏
    const renderTabBar = () => {
      if (!props.multipleLine) return null

      const filtersNode = renderFilter()

      if (props.tabs?.items && props.tabs.items.length > 0) {
        return (
          <div class={`${props.prefixCls}-extra-line`}>
            <Tabs
              value={props.tabs.activeKey || props.tabs.defaultActiveKey}
              onChange={props.tabs.onChange}
              style={{ width: '100%' }}
            >
              {props.tabs.items.map(item => (
                <Tabs.TabPanel
                  key={item.key}
                  value={item.key}
                  label={item.tab}
                  disabled={item.disabled}
                />
              ))}
            </Tabs>
            {filtersNode}
          </div>
        )
      }

      if (filtersNode) {
        return <div class={`${props.prefixCls}-extra-line`}>{filtersNode}</div>
      }

      return null
    }

    return () => {
      const { prefixCls, className, style } = props

      return (
        <div class={[prefixCls, className]} style={style}>
          <div class={`${prefixCls}-container`}>
            {renderLeft()}
            {renderRight()}
          </div>
          {renderTabBar()}
        </div>
      )
    }
  },
})
