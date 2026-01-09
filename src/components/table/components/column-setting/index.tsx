/**
 * ColumnSetting 列设置组件
 * 用于控制表格列的显示/隐藏、固定位置和排序
 * 参考 ant-design/pro-components ColumnSetting 组件
 */

import { ChevronDownIcon, ChevronUpIcon, LockOnIcon, SettingIcon } from 'tdesign-icons-vue-next'
import {
  Button,
  Checkbox,
  Popup,
  Space,
  Tooltip,
  Tree,
  type TreeNodeModel,
  type TreeNodeValue,
} from 'tdesign-vue-next'
import type { PropType, VNode } from 'vue'
import { computed, defineComponent, ref, watch } from 'vue'
import type { ColumnsState, ProTableColumn } from '../../types'
import './style.less'

export interface ColumnSettingProps {
  columns: ProTableColumn[]
  columnsMap?: Record<string, ColumnsState>
  onColumnsMapChange?: (columnsMap: Record<string, ColumnsState>) => void
  checkable?: boolean
  draggable?: boolean
  showListItemOption?: boolean
  checkedReset?: boolean
  listsHeight?: number
  extra?: VNode
  children?: VNode
  settingIcon?: VNode
}

// 生成列的唯一 key
const genColumnKey = (key: string | number | undefined, index: number | string): string => {
  if (key !== undefined && key !== null) {
    return String(key)
  }
  return String(index)
}

export default defineComponent({
  name: 'ColumnSetting',
  props: {
    columns: {
      type: Array as PropType<ProTableColumn[]>,
      required: true,
    },
    columnsMap: {
      type: Object as PropType<Record<string, ColumnsState>>,
      default: () => ({}),
    },
    onColumnsMapChange: {
      type: Function as PropType<(columnsMap: Record<string, ColumnsState>) => void>,
    },
    checkable: {
      type: Boolean,
      default: true,
    },
    draggable: {
      type: Boolean,
      default: true,
    },
    showListItemOption: {
      type: Boolean,
      default: true,
    },
    checkedReset: {
      type: Boolean,
      default: true,
    },
    listsHeight: {
      type: Number,
      default: 280,
    },
    extra: [Object, Function] as PropType<VNode>,
    settingIcon: [Object, Function] as PropType<VNode>,
  },
  emits: ['columnsMapChange'],
  setup(props, { emit, slots }) {
    const visible = ref(false)
    const localColumnsMap = ref<Record<string, ColumnsState>>({
      ...props.columnsMap,
    })
    const defaultColumnsMap = ref<Record<string, ColumnsState>>({})

    // 监听外部 columnsMap 变化
    watch(
      () => props.columnsMap,
      (newVal) => {
        localColumnsMap.value = { ...newVal }
      },
      { deep: true },
    )

    // 初始化默认列配置
    watch(
      () => props.columns,
      (columns) => {
        const map: Record<string, ColumnsState> = {}
        columns.forEach((col, index) => {
          const key = genColumnKey(col.colKey, index)
          map[key] = {
            show: true,
            fixed: col.fixed as 'left' | 'right' | undefined,
            order: index,
          }
        })
        defaultColumnsMap.value = map
        // 如果 localColumnsMap 为空，使用默认值
        if (Object.keys(localColumnsMap.value).length === 0) {
          localColumnsMap.value = { ...map }
        }
      },
      { immediate: true },
    )

    // 更新列配置
    const updateColumnsMap = (newMap: Record<string, ColumnsState>) => {
      localColumnsMap.value = newMap
      emit('columnsMapChange', newMap)
      props.onColumnsMapChange?.(newMap)
    }

    // 处理列显示/隐藏
    const handleColumnChange = (
      value: TreeNodeValue[],
      context: {
        node: TreeNodeModel
        e?: any
        trigger: 'node-click' | 'setItem'
      },
    ) => {
      const key = context.node.value as string
      const newMap = { ...localColumnsMap.value }
      newMap[key] = {
        ...newMap[key],
        show: value.includes(key),
      }
      updateColumnsMap(newMap)
    }

    // 处理全选/取消全选
    const handleCheckAll = (checked: boolean) => {
      const newMap: Record<string, ColumnsState> = {}
      props.columns.forEach((col, index) => {
        const key = genColumnKey(col.colKey, index)
        newMap[key] = {
          ...localColumnsMap.value[key],
          show: checked,
        }
      })
      updateColumnsMap(newMap)
    }

    // 处理固定列
    const handleFixColumn = (key: string, fixed: 'left' | 'right' | undefined) => {
      const newMap = { ...localColumnsMap.value }
      newMap[key] = {
        ...newMap[key],
        fixed,
      }
      updateColumnsMap(newMap)
    }

    // 处理拖拽排序
    const handleDrop = (context: {
      dragNode: TreeNodeModel
      dropNode: TreeNodeModel
      dropPosition: number
    }) => {
      const { dragNode, dropNode, dropPosition } = context
      const dragKey = dragNode.value as string
      const dropKey = dropNode.value as string

      const newMap = { ...localColumnsMap.value }
      const keys = Object.keys(newMap).sort(
        (a, b) => (newMap[a].order || 0) - (newMap[b].order || 0),
      )

      const dragIndex = keys.indexOf(dragKey)
      const dropIndex = keys.indexOf(dropKey)

      if (dragIndex < 0 || dropIndex < 0) return

      // 移除拖拽项
      keys.splice(dragIndex, 1)

      // 计算新位置
      let newIndex = dropIndex
      if (dropPosition === 1) {
        newIndex = dropIndex + 1
      } else if (dropPosition === -1) {
        newIndex = dropIndex
      }

      // 插入到新位置
      keys.splice(newIndex, 0, dragKey)

      // 更新 order
      keys.forEach((key, index) => {
        newMap[key] = {
          ...newMap[key],
          order: index,
        }
      })

      updateColumnsMap(newMap)
    }

    // 重置列配置
    const handleReset = () => {
      updateColumnsMap({ ...defaultColumnsMap.value })
    }

    // 计算选中的 keys
    const checkedKeys = computed(() => {
      return props.columns
        .map((col, index) => genColumnKey(col.colKey, index))
        .filter((key) => localColumnsMap.value[key]?.show !== false)
    })

    // 计算是否全选
    const isAllChecked = computed(() => {
      return checkedKeys.value.length === props.columns.length
    })

    // 计算是否部分选中
    const isIndeterminate = computed(() => {
      return checkedKeys.value.length > 0 && checkedKeys.value.length < props.columns.length
    })

    // 按固定位置分组的列
    const groupedColumns = computed(() => {
      const leftList: { key: string; col: ProTableColumn; index: number }[] = []
      const rightList: { key: string; col: ProTableColumn; index: number }[] = []
      const normalList: { key: string; col: ProTableColumn; index: number }[] = []

      props.columns.forEach((col, index) => {
        const key = genColumnKey(col.colKey, index)
        const state = localColumnsMap.value[key]
        const fixed = state?.fixed || col.fixed

        const item = { key, col, index }
        if (fixed === 'left') {
          leftList.push(item)
        } else if (fixed === 'right') {
          rightList.push(item)
        } else {
          normalList.push(item)
        }
      })

      // 按 order 排序
      const sortByOrder = (a: { key: string }, b: { key: string }) => {
        const orderA = localColumnsMap.value[a.key]?.order ?? 0
        const orderB = localColumnsMap.value[b.key]?.order ?? 0
        return orderA - orderB
      }

      leftList.sort(sortByOrder)
      normalList.sort(sortByOrder)
      rightList.sort(sortByOrder)

      return { leftList, normalList, rightList }
    })

    // 渲染树节点
    const renderTreeData = (list: { key: string; col: ProTableColumn; index: number }[]) => {
      return list.map(({ key, col }) => ({
        value: key,
        label: col.title || col.colKey || key,
      }))
    }

    // 渲染固定列操作按钮
    const renderFixedOptions = (key: string) => {
      if (!props.showListItemOption) return null

      const state = localColumnsMap.value[key]
      const fixed = state?.fixed

      return (
        <span class="t-pro-table-column-setting-item-option">
          <Tooltip content="固定在左侧">
            <span
              class={['t-pro-table-column-setting-item-option-icon', { active: fixed === 'left' }]}
              onClick={(e) => {
                e.stopPropagation()
                handleFixColumn(key, fixed === 'left' ? undefined : 'left')
              }}
            >
              <ChevronUpIcon />
            </span>
          </Tooltip>
          <Tooltip content="不固定">
            <span
              class={['t-pro-table-column-setting-item-option-icon', { active: !fixed }]}
              onClick={(e) => {
                e.stopPropagation()
                handleFixColumn(key, undefined)
              }}
            >
              <LockOnIcon />
            </span>
          </Tooltip>
          <Tooltip content="固定在右侧">
            <span
              class={['t-pro-table-column-setting-item-option-icon', { active: fixed === 'right' }]}
              onClick={(e) => {
                e.stopPropagation()
                handleFixColumn(key, 'right')
              }}
            >
              <ChevronDownIcon />
            </span>
          </Tooltip>
        </span>
      )
    }

    // 渲染列表
    const renderColumnList = (
      title: string,
      list: { key: string; col: ProTableColumn; index: number }[],
      showTitle = true,
    ) => {
      if (list.length === 0) return null

      return (
        <div class="t-pro-table-column-setting-list">
          {showTitle && <div class="t-pro-table-column-setting-list-title">{title}</div>}
          <Tree
            // @ts-expect-error
            data={renderTreeData(list)}
            checkable={props.checkable}
            draggable={props.draggable && list.length > 1}
            value={checkedKeys.value}
            expandAll
            hover
            onChange={handleColumnChange}
            onDrop={handleDrop}
            style={{ maxHeight: `${props.listsHeight}px`, overflow: 'auto' }}
            v-slots={{
              label: ({ node }: { node: TreeNodeModel }) => (
                <div class="t-pro-table-column-setting-item">
                  <span class="t-pro-table-column-setting-item-title">{node.label}</span>
                  {renderFixedOptions(node.value as string)}
                </div>
              ),
            }}
          />
        </div>
      )
    }

    // 渲染弹出内容
    const renderContent = () => {
      const { leftList, normalList, rightList } = groupedColumns.value
      const hasFixed = leftList.length > 0 || rightList.length > 0

      return (
        <div class="t-pro-table-column-setting-content">
          {renderColumnList('固定在左侧', leftList)}
          {renderColumnList('不固定', normalList, hasFixed)}
          {renderColumnList('固定在右侧', rightList)}
        </div>
      )
    }

    // 渲染标题
    const renderTitle = () => {
      return (
        <div class="t-pro-table-column-setting-title">
          {props.checkable && (
            <Checkbox
              checked={isAllChecked.value}
              indeterminate={isIndeterminate.value}
              onChange={handleCheckAll}
            >
              列展示
            </Checkbox>
          )}
          <Space>
            {props.checkedReset && (
              <Button variant="text" theme="primary" size="small" onClick={handleReset}>
                重置
              </Button>
            )}
            {props.extra}
          </Space>
        </div>
      )
    }

    return () => {
      const trigger = slots.default?.() || (
        <Tooltip content="列设置">
          <Button
            variant="text"
            shape="square"
            icon={() => (props.settingIcon ? props.settingIcon : <SettingIcon />)}
          />
        </Tooltip>
      )

      return (
        <Popup
          v-model:visible={visible.value}
          trigger="click"
          placement="bottom-right"
          showArrow={false}
          overlayClassName="t-pro-table-column-setting-overlay"
          content={() => (
            <div class="t-pro-table-column-setting">
              {renderTitle()}
              {renderContent()}
            </div>
          )}
        >
          {trigger}
        </Popup>
      )
    }
  },
})
