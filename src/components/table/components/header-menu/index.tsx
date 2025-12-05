/**
 * HeaderMenu 头部菜单组件
 * 用于 ListToolBar 的菜单切换功能
 * 参考 ant-design/pro-components HeaderMenu 组件
 */

import { ChevronDownIcon } from 'tdesign-icons-vue-next'
import { Dropdown, Space, Tabs, type DropdownOption } from 'tdesign-vue-next'
import type { PropType, VNode } from 'vue'
import { computed, defineComponent, ref, watch } from 'vue'
import './style.less'

// 菜单项类型
export interface ListToolBarMenuItem {
  key: string | number
  label: string | VNode
  disabled?: boolean
}

export interface ListToolBarHeaderMenuProps {
  type?: 'inline' | 'dropdown' | 'tab'
  activeKey?: string | number
  defaultActiveKey?: string | number
  items?: ListToolBarMenuItem[]
  onChange?: (activeKey?: string | number) => void
  prefixCls?: string
}

export default defineComponent({
  name: 'HeaderMenu',
  props: {
    type: {
      type: String as PropType<'inline' | 'dropdown' | 'tab'>,
      default: 'inline',
    },
    activeKey: [String, Number] as PropType<string | number>,
    defaultActiveKey: [String, Number] as PropType<string | number>,
    items: {
      type: Array as PropType<ListToolBarMenuItem[]>,
      default: () => [],
    },
    onChange: Function as PropType<(activeKey?: string | number) => void>,
    prefixCls: {
      type: String,
      default: 't-pro-list-toolbar',
    },
  },
  setup(props) {
    // 内部状态
    const internalActiveKey = ref<string | number | undefined>(
      props.activeKey ?? props.defaultActiveKey
    )

    // 监听外部 activeKey 变化
    watch(
      () => props.activeKey,
      newVal => {
        if (newVal !== undefined) {
          internalActiveKey.value = newVal
        }
      }
    )

    // 当前激活的菜单项
    const activeItem = computed(() => {
      return (
        props.items?.find(item => item.key === internalActiveKey.value) ||
        props.items?.[0]
      )
    })

    // 处理菜单项点击
    const handleClick = (key: string | number) => {
      internalActiveKey.value = key
      props.onChange?.(key)
    }

    // 渲染 inline 类型菜单
    const renderInlineMenu = () => {
      return (
        <div
          class={[`${props.prefixCls}-menu`, `${props.prefixCls}-inline-menu`]}
        >
          {props.items?.map((item, index) => (
            <div
              key={item.key ?? index}
              class={[
                `${props.prefixCls}-inline-menu-item`,
                {
                  [`${props.prefixCls}-inline-menu-item-active`]:
                    activeItem.value?.key === item.key,
                  [`${props.prefixCls}-inline-menu-item-disabled`]:
                    item.disabled,
                },
              ]}
              onClick={() => {
                if (!item.disabled) {
                  handleClick(item.key)
                }
              }}
            >
              {item.label}
            </div>
          ))}
        </div>
      )
    }

    // 渲染 tab 类型菜单
    const renderTabMenu = () => {
      return (
        <Tabs
          value={String(internalActiveKey.value)}
          onChange={key => handleClick(key as string)}
        >
          {props.items?.map(item => (
            <Tabs.TabPanel
              key={String(item.key)}
              value={String(item.key)}
              label={item.label}
              disabled={item.disabled}
            />
          ))}
        </Tabs>
      )
    }

    // 渲染 dropdown 类型菜单
    const renderDropdownMenu = () => {
      const dropdownOptions: DropdownOption[] =
        props.items?.map((item, index) => ({
          content:
            typeof item.label === 'string' ? item.label : () => item.label,
          value: item.key ?? index,
          disabled: item.disabled,
        })) || []

      return (
        <div
          class={[`${props.prefixCls}-menu`, `${props.prefixCls}-dropdownmenu`]}
        >
          <Dropdown
            trigger="click"
            options={dropdownOptions}
            onClick={(dropdownItem: DropdownOption) => {
              if (dropdownItem.value !== undefined) {
                handleClick(dropdownItem.value as string | number)
              }
            }}
          >
            <Space class={`${props.prefixCls}-dropdownmenu-label`}>
              {activeItem.value?.label}
              <ChevronDownIcon />
            </Space>
          </Dropdown>
        </div>
      )
    }

    return () => {
      if (!props.items || props.items.length === 0) {
        return null
      }

      switch (props.type) {
        case 'tab':
          return renderTabMenu()
        case 'dropdown':
          return renderDropdownMenu()
        case 'inline':
        default:
          return renderInlineMenu()
      }
    }
  },
})
