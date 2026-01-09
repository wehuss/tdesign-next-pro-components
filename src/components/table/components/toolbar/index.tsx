/**
 * TableToolBar 组件
 * 表格工具栏，包含标题、搜索、操作按钮和设置
 * 参考 ant-design/pro-components ToolBar 组件
 */

import {
  FullscreenExitIcon,
  FullscreenIcon,
  RefreshIcon,
  ViewListIcon,
} from 'tdesign-icons-vue-next'
import { Button, Dropdown, Input, Space, Tooltip, type DropdownOption } from 'tdesign-vue-next'
import type { PropType, VNode } from 'vue'
import { computed, defineComponent, ref } from 'vue'
import type { ActionRef, ColumnsState, ProTableColumn, ToolbarConfig } from '../../types'
import { renderProNode } from '../../utils/node'
import ColumnSetting from '../column-setting'
import './style.less'

// 设置项类型
export interface ToolbarSettingItem {
  icon: VNode | (() => VNode)
  tooltip?: string
  key?: string
  onClick?: (key?: string) => void
}

// 选项配置类型
export interface OptionConfig {
  density?: boolean
  fullScreen?: boolean | ((e: MouseEvent) => void)
  reload?: boolean | ((e: MouseEvent) => void)
  setting?: boolean | ToolbarSettingItem
  search?:
    | boolean
    | {
        placeholder?: string
        onSearch?: (value: string) => void
        name?: string
      }
  reloadIcon?: VNode
  densityIcon?: VNode
}

// 密度类型
export type DensityType = 'large' | 'medium' | 'small'

// 密度选项
const densityOptions: DropdownOption[] = [
  { content: '默认', value: 'medium' },
  { content: '宽松', value: 'large' },
  { content: '紧凑', value: 'small' },
]

export default defineComponent({
  name: 'TableToolBar',
  props: {
    // 标题
    headerTitle: [String, Function] as PropType<string | (() => VNode)>,
    // 副标题
    subTitle: [String, Function] as PropType<string | (() => VNode)>,
    // 标题提示
    tooltip: String,
    // 工具栏配置
    toolbar: {
      type: [Boolean, Object] as PropType<boolean | ToolbarConfig>,
      default: true,
    },
    // 自定义工具栏渲染
    toolbarRender: Function as PropType<(actionRef: ActionRef) => VNode>,
    // 列配置
    columns: {
      type: Array as PropType<ProTableColumn[]>,
      required: true,
    },
    // ActionRef
    actionRef: Object as PropType<{ value: ActionRef }>,
    // 列控制器可见性变化回调
    onColumnControllerVisibleChange: Function as PropType<(visible: boolean) => void>,
    // 列控制器可见性
    columnControllerVisible: {
      type: Boolean,
      default: false,
    },
    // 选项配置
    options: {
      type: [Object, Boolean] as PropType<OptionConfig | false>,
      default: () => ({
        reload: true,
        density: true,
        setting: true,
        fullScreen: false,
      }),
    },
    // 选中的行 keys
    selectedRowKeys: {
      type: Array as PropType<(string | number)[]>,
      default: () => [],
    },
    // 选中的行数据
    selectedRows: {
      type: Array as PropType<any[]>,
      default: () => [],
    },
    // 搜索回调
    onSearch: Function as PropType<(keyword: string) => void>,
    // 密度
    density: {
      type: String as PropType<DensityType>,
      default: 'medium',
    },
    // 列状态映射
    columnsMap: {
      type: Object as PropType<Record<string, ColumnsState>>,
      default: () => ({}),
    },
    // 列状态变化回调
    onColumnsMapChange: {
      type: Function as PropType<(map: Record<string, ColumnsState>) => void>,
    },
  },

  emits: ['update:columnControllerVisible', 'update:density'],

  setup(props, { emit }) {
    const currentDensity = ref<DensityType>(props.density)
    const isFullScreen = ref(false)
    const searchValue = ref('')

    // 处理刷新
    const handleReload = () => {
      props.actionRef?.value?.reload()
    }

    // 处理密度变化
    const handleDensityChange = (data: { value: string | number }) => {
      currentDensity.value = data.value as DensityType
      emit('update:density', data.value)
    }

    // 处理全屏
    const handleFullScreen = () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen()
        isFullScreen.value = true
      } else {
        document.exitFullscreen()
        isFullScreen.value = false
      }
    }

    // 处理搜索
    const handleSearch = (value: string) => {
      props.onSearch?.(value)
    }

    // 是否显示标题
    const showHeaderTitle = computed(() => !!props.headerTitle)

    // 渲染标题
    const renderHeaderTitle = () => (
      <div class="t-pro-table-toolbar-title">
        <span class="t-pro-table-toolbar-title-text">{renderProNode(props.headerTitle)}</span>
        {props.subTitle && (
          <span class="t-pro-table-toolbar-title-sub">{renderProNode(props.subTitle)}</span>
        )}
        {props.tooltip && (
          <Tooltip content={props.tooltip}>
            <span class="t-pro-table-toolbar-title-tip">?</span>
          </Tooltip>
        )}
      </div>
    )

    // 渲染搜索框
    const renderSearch = () => {
      const options = props.options
      if (options === false || !options || !options.search) {
        return null
      }

      const searchConfig = typeof options.search === 'object' ? options.search : {}
      const placeholder = searchConfig.placeholder || '请输入关键词'

      return (
        <Input
          v-model={searchValue.value}
          placeholder={placeholder}
          clearable
          style={{ width: '200px' }}
          onEnter={() => handleSearch(searchValue.value)}
          onClear={() => handleSearch('')}
        />
      )
    }

    // 渲染设置按钮
    const renderSettings = () => {
      const options = props.options
      if (options === false) {
        return []
      }
      if (!options) {
        return []
      }

      const settings: VNode[] = []

      // 刷新按钮
      if (options.reload !== false) {
        settings.push(
          <Tooltip content="刷新" key="reload">
            <Button
              variant="text"
              shape="square"
              icon={() => (options.reloadIcon ? options.reloadIcon : <RefreshIcon />)}
              onClick={(e) => {
                if (typeof options.reload === 'function') {
                  options.reload(e as MouseEvent)
                } else {
                  handleReload()
                }
              }}
            />
          </Tooltip>,
        )
      }

      // 密度按钮
      if (options.density !== false) {
        settings.push(
          <Dropdown
            key="density"
            options={densityOptions}
            onClick={(dropdownItem: DropdownOption) => {
              if (dropdownItem.value !== undefined) {
                handleDensityChange({
                  value: dropdownItem.value as string | number,
                })
              }
            }}
          >
            <Tooltip content="表格密度">
              <Button
                variant="text"
                shape="square"
                icon={() => (options.densityIcon ? options.densityIcon : <ViewListIcon />)}
              />
            </Tooltip>
          </Dropdown>,
        )
      }

      // 列设置按钮
      if (options.setting !== false) {
        settings.push(
          <ColumnSetting
            key="setting"
            columns={props.columns || []}
            columnsMap={props.columnsMap}
            onColumnsMapChange={props.onColumnsMapChange}
          />,
        )
      }

      // 全屏按钮
      if (options.fullScreen) {
        settings.push(
          <Tooltip content={isFullScreen.value ? '退出全屏' : '全屏'} key="fullScreen">
            <Button
              variant="text"
              shape="square"
              icon={() => (isFullScreen.value ? <FullscreenExitIcon /> : <FullscreenIcon />)}
              onClick={(e) => {
                if (typeof options.fullScreen === 'function') {
                  options.fullScreen(e as MouseEvent)
                } else {
                  handleFullScreen()
                }
              }}
            />
          </Tooltip>,
        )
      }

      return settings
    }

    return () => {
      const { toolbar, toolbarRender, actionRef } = props

      if (toolbar === false) {
        return null
      }

      // 自定义工具栏按钮
      const customActions = actionRef?.value ? toolbarRender?.(actionRef.value) : null

      // 从 toolbar 配置中获取 actions
      const toolbarConfig = typeof toolbar === 'object' ? toolbar : ({} as ToolbarConfig)
      const configActions = toolbarConfig.actions || []

      // 默认设置按钮
      const defaultSettings = renderSettings()

      // 搜索框
      const searchNode = renderSearch()

      return (
        <div class="t-pro-table-toolbar">
          <div class="t-pro-table-toolbar-container">
            <div class="t-pro-table-toolbar-left">
              {showHeaderTitle.value ? renderHeaderTitle() : null}
            </div>
            <div class="t-pro-table-toolbar-right">
              <Space size="small">
                {searchNode}
                {customActions}
                {configActions}
                {defaultSettings}
              </Space>
            </div>
          </div>
        </div>
      )
    }
  },
})
