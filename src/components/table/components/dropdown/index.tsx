/**
 * TableDropdown 操作下拉组件
 * 用于表格操作列的下拉菜单
 * 参考 ant-design/pro-components Dropdown 组件
 */

import { ChevronDownIcon, EllipsisIcon } from 'tdesign-icons-vue-next'
import { Button, Dropdown, type DropdownOption } from 'tdesign-vue-next'
import type { CSSProperties, PropType, VNode } from 'vue'
import { defineComponent, h } from 'vue'
import './style.less'

// 菜单项类型
export interface TableDropdownMenuItem {
  /** 菜单项唯一标识 */
  key: string
  /** 菜单项显示内容 */
  name: string | VNode
  /** 菜单项标题（用于 tooltip） */
  title?: string
  /** 是否禁用 */
  disabled?: boolean
  /** 是否为危险操作（显示红色） */
  danger?: boolean
}

export interface TableDropdownProps {
  /** 自定义类名 */
  className?: string
  /** 自定义样式 */
  style?: CSSProperties
  /** 菜单项列表 */
  menus?: TableDropdownMenuItem[]
  /** 选择菜单项时的回调 */
  onSelect?: (key: string) => void
  /** 子元素 */
  children?: VNode
}

/**
 * 将菜单项转换为 TDesign Dropdown 选项
 */
const convertMenusToOptions = (
  menus: TableDropdownMenuItem[]
): DropdownOption[] => {
  return menus.map(item => {
    const content =
      typeof item.name === 'string'
        ? item.danger
          ? () =>
              h(
                'span',
                { class: 't-pro-table-dropdown-item-danger' },
                item.name
              )
          : item.name
        : () =>
            h(
              'span',
              { class: item.danger ? 't-pro-table-dropdown-item-danger' : '' },
              [item.name]
            )

    return {
      content,
      value: item.key,
      disabled: item.disabled,
      title: item.title,
    }
  })
}

/**
 * 下拉按钮组件
 * 带有按钮样式的下拉菜单
 */
const DropdownButton = defineComponent({
  name: 'DropdownButton',
  props: {
    className: String,
    style: Object as PropType<CSSProperties>,
    menus: {
      type: Array as PropType<TableDropdownMenuItem[]>,
      default: () => [],
    },
    onSelect: Function as PropType<(key: string) => void>,
  },
  setup(props, { slots }) {
    const handleClick = (dropdownItem: DropdownOption) => {
      props.onSelect?.(dropdownItem.value as string)
    }

    return () => {
      const dropdownOptions = convertMenusToOptions(props.menus)

      return (
        <Dropdown
          options={dropdownOptions}
          onClick={handleClick}
          trigger="click"
          class={['t-pro-table-dropdown', props.className]}
        >
          <Button style={props.style}>
            {slots.default?.()}
            <ChevronDownIcon style={{ marginLeft: '4px' }} />
          </Button>
        </Dropdown>
      )
    }
  },
})

/**
 * 表格下拉菜单组件
 * 用于表格操作列的下拉菜单，默认显示省略号图标
 *
 * @example
 * ```vue
 * <TableDropdown
 *   :menus="[
 *     { key: 'edit', name: '编辑' },
 *     { key: 'delete', name: '删除', danger: true }
 *   ]"
 *   @select="handleSelect"
 * />
 * ```
 */
const TableDropdown = defineComponent({
  name: 'TableDropdown',
  props: {
    className: String,
    style: Object as PropType<CSSProperties>,
    menus: {
      type: Array as PropType<TableDropdownMenuItem[]>,
      default: () => [],
    },
    onSelect: Function as PropType<(key: string) => void>,
  },
  emits: ['select'],
  setup(props, { slots, emit }) {
    const handleClick = (dropdownItem: DropdownOption) => {
      const key = dropdownItem.value as string
      props.onSelect?.(key)
      emit('select', key)
    }

    return () => {
      const dropdownOptions = convertMenusToOptions(props.menus)

      return (
        <Dropdown
          options={dropdownOptions}
          onClick={handleClick}
          trigger="click"
          class={['t-pro-table-dropdown', props.className]}
        >
          <a class="t-pro-table-dropdown-trigger" style={props.style}>
            {slots.default?.() || <EllipsisIcon />}
          </a>
        </Dropdown>
      )
    }
  },
})

// 添加 Button 子组件作为静态属性
type TableDropdownType = typeof TableDropdown & {
  Button: typeof DropdownButton
}
;(TableDropdown as TableDropdownType).Button = DropdownButton

export { DropdownButton }
export default TableDropdown as TableDropdownType
