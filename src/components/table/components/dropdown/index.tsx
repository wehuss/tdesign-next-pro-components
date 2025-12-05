/**
 * TableDropdown 操作下拉组件
 * 用于表格操作列的下拉菜单
 * 参考 ant-design/pro-components Dropdown 组件
 */

import { ChevronDownIcon, EllipsisIcon } from 'tdesign-icons-vue-next'
import { Button, Dropdown, type DropdownOption } from 'tdesign-vue-next'
import type { PropType, VNode } from 'vue'
import { defineComponent } from 'vue'
import './style.less'

// 菜单项类型
export interface TableDropdownMenuItem {
  key: string
  name: string | VNode
  title?: string
  disabled?: boolean
  danger?: boolean
}

export interface TableDropdownProps {
  className?: string
  style?: Record<string, string>
  menus?: TableDropdownMenuItem[]
  onSelect?: (key: string) => void
  children?: VNode
}

// 下拉按钮组件
const DropdownButton = defineComponent({
  name: 'DropdownButton',
  props: {
    className: String,
    style: Object as PropType<Record<string, string>>,
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
      const dropdownOptions: DropdownOption[] = props.menus.map(item => ({
        content: typeof item.name === 'string' ? item.name : () => item.name,
        value: item.key,
        disabled: item.disabled,
      }))

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

// 主下拉组件
const TableDropdown = defineComponent({
  name: 'TableDropdown',
  props: {
    className: String,
    style: Object as PropType<Record<string, string>>,
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
      const dropdownOptions: DropdownOption[] = props.menus.map(item => ({
        content: typeof item.name === 'string' ? item.name : () => item.name,
        value: item.key,
        disabled: item.disabled,
      }))

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

// 添加 Button 子组件
;(TableDropdown as any).Button = DropdownButton

export { DropdownButton }
export default TableDropdown
