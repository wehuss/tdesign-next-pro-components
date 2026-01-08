/**
 * DensityIcon 密度切换组件
 * 用于切换表格的行高密度
 * 参考 ant-design/pro-components DensityIcon 组件
 */

import { ViewListIcon } from 'tdesign-icons-vue-next'
import { Button, Dropdown, Tooltip, type DropdownOption } from 'tdesign-vue-next'
import type { PropType, VNode } from 'vue'
import { defineComponent } from 'vue'

// 密度类型
export type DensitySize = 'large' | 'medium' | 'small'

// 密度选项配置
const densityOptions: DropdownOption[] = [
  { content: '宽松', value: 'large' },
  { content: '中等', value: 'medium' },
  { content: '紧凑', value: 'small' },
]

export interface DensityIconProps {
  icon?: VNode
  tableSize?: DensitySize
  onSizeChange?: (size: DensitySize) => void
}

export default defineComponent({
  name: 'DensityIcon',
  props: {
    icon: [Object, Function] as PropType<VNode>,
    tableSize: {
      type: String as PropType<DensitySize>,
      default: 'medium',
    },
    onSizeChange: {
      type: Function as PropType<(size: DensitySize) => void>,
    },
  },
  emits: ['sizeChange'],
  setup(props, { emit }) {
    const handleClick = (dropdownItem: DropdownOption) => {
      const size = dropdownItem.value as DensitySize
      emit('sizeChange', size)
      props.onSizeChange?.(size)
    }

    return () => {
      const icon = props.icon || <ViewListIcon />

      return (
        <Dropdown
          options={densityOptions.map((opt) => ({
            ...opt,
            // 标记当前选中项
            prefixIcon:
              opt.value === props.tableSize ? (
                <span style={{ color: 'var(--td-brand-color)' }}>✓</span>
              ) : (
                <span style={{ width: '14px', display: 'inline-block' }} />
              ),
          }))}
          onClick={handleClick}
          trigger="click"
          minColumnWidth={80}
        >
          <Tooltip content="表格密度">
            <Button variant="text" shape="square" icon={() => icon} />
          </Tooltip>
        </Dropdown>
      )
    }
  },
})
