import {
  AddIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  DeleteIcon,
  FileCopyIcon,
} from 'tdesign-icons-vue-next'
import { Button, Tooltip } from 'tdesign-vue-next'
import {
  computed,
  defineComponent,
  inject,
  provide,
  ref,
  type InjectionKey,
  type PropType,
  type Ref,
  type VNode,
} from 'vue'
import { useFieldContext } from '../../field-context'

// FormList 上下文
export interface FormListContextValue {
  name?: string | number
  key?: number
  listName?: (string | number)[]
}

export const FormListContextKey: InjectionKey<FormListContextValue> = Symbol('FormListContext')

export const useFormListContext = () => {
  return inject(FormListContextKey, {})
}

// 图标配置
export interface IconConfig {
  Icon?: any
  tooltipText?: string
}

// 操作守卫
export interface FormListActionGuard {
  beforeAddRow?: (
    defaultValue: any,
    insertIndex: number,
    count: number,
  ) => boolean | Promise<boolean>
  beforeRemoveRow?: (index: number, count: number) => boolean | Promise<boolean>
}

// 操作类型
export interface FormListOperation {
  add: (defaultValue?: any, insertIndex?: number) => void
  remove: (index: number | number[]) => void
  move: (from: number, to: number) => void
}

// 子项渲染函数
export type ChildrenItemFunction = (
  field: { name: number; key: number },
  index: number,
  action: FormListOperation & {
    getCurrentRowData: () => any
    setCurrentRowData: (data: any) => void
  },
  count: number,
) => VNode | VNode[]

export interface ProFormListProps {
  /** 字段名 */
  name?: string | string[]
  /** 标签 */
  label?: string | VNode
  /** 最小行数 */
  min?: number
  /** 最大行数 */
  max?: number
  /** 复制按钮配置 */
  copyIconProps?: IconConfig | false
  /** 删除按钮配置 */
  deleteIconProps?: IconConfig | false
  /** 向上排序按钮配置 */
  upIconProps?: IconConfig | false
  /** 向下排序按钮配置 */
  downIconProps?: IconConfig | false
  /** 是否开启箭头排序 */
  arrowSort?: boolean
  /** 操作守卫 */
  actionGuard?: FormListActionGuard
  /** 新增按钮配置 */
  creatorButtonProps?:
    | false
    | {
        creatorButtonText?: string | VNode
        position?: 'top' | 'bottom'
        type?: 'default' | 'primary' | 'danger' | 'warning'
        block?: boolean
        icon?: VNode
      }
  /** 新增行的默认数据 */
  creatorRecord?: Record<string, any> | (() => Record<string, any>)
  /** 自定义操作渲染 */
  actionRender?: (
    field: { name: number; key: number },
    action: FormListOperation,
    defaultActionDom: VNode[],
    count: number,
  ) => VNode[]
  /** 自定义项容器渲染 */
  itemContainerRender?: (doms: VNode | VNode[], listMeta: any) => VNode
  /** 自定义项渲染 */
  itemRender?: (dom: { listDom: VNode; action: VNode | null }, listMeta: any) => VNode
  /** 是否总是显示每行的 label */
  alwaysShowItemLabel?: boolean
  /** 额外渲染 */
  fieldExtraRender?: (
    action: FormListOperation,
    meta: { errors?: VNode[]; warnings?: VNode[] },
  ) => VNode
  /** 新增成功回调 */
  onAfterAdd?: (defaultValue: any, insertIndex: number, count: number) => void
  /** 删除成功回调 */
  onAfterRemove?: (index: number, count: number) => void
  /** 容器类名 */
  containerClassName?: string
  /** 容器样式 */
  containerStyle?: Record<string, any>
  /** 是否只读 */
  readonly?: boolean
  /** 子元素 */
  children?: ChildrenItemFunction | VNode | VNode[]
}

// 生成唯一 ID
let listKeyCounter = 0
const generateKey = () => ++listKeyCounter

export const ProFormList = defineComponent({
  name: 'ProFormList',
  props: {
    name: [String, Array] as PropType<string | string[]>,
    label: [String, Object] as PropType<string | VNode>,
    min: {
      type: Number,
      default: 0,
    },
    max: {
      type: Number,
      default: Infinity,
    },
    copyIconProps: {
      type: [Object, Boolean] as PropType<IconConfig | false>,
      default: () => ({
        tooltipText: '复制此项',
      }),
    },
    deleteIconProps: {
      type: [Object, Boolean] as PropType<IconConfig | false>,
      default: () => ({
        tooltipText: '删除此项',
      }),
    },
    upIconProps: {
      type: [Object, Boolean] as PropType<IconConfig | false>,
      default: () => ({
        tooltipText: '向上移动',
      }),
    },
    downIconProps: {
      type: [Object, Boolean] as PropType<IconConfig | false>,
      default: () => ({
        tooltipText: '向下移动',
      }),
    },
    arrowSort: {
      type: Boolean,
      default: false,
    },
    actionGuard: Object as PropType<FormListActionGuard>,
    creatorButtonProps: {
      type: [Object, Boolean] as PropType<ProFormListProps['creatorButtonProps']>,
      default: () => ({
        creatorButtonText: '添加一行',
        position: 'bottom',
      }),
    },
    creatorRecord: [Object, Function] as PropType<
      Record<string, any> | (() => Record<string, any>)
    >,
    actionRender: Function as PropType<ProFormListProps['actionRender']>,
    itemContainerRender: Function as PropType<ProFormListProps['itemContainerRender']>,
    itemRender: Function as PropType<ProFormListProps['itemRender']>,
    alwaysShowItemLabel: {
      type: Boolean,
      default: false,
    },
    fieldExtraRender: Function as PropType<ProFormListProps['fieldExtraRender']>,
    onAfterAdd: Function as PropType<ProFormListProps['onAfterAdd']>,
    onAfterRemove: Function as PropType<ProFormListProps['onAfterRemove']>,
    containerClassName: String,
    containerStyle: Object,
    readonly: {
      type: Boolean,
      default: false,
    },
    children: [Function, Object, Array] as PropType<ProFormListProps['children']>,
  },
  setup(props, { slots }) {
    const fieldContext = useFieldContext()
    const listContext = useFormListContext()

    // 列表数据
    interface ListItem {
      key: number
      data: Record<string, any>
    }
    const list: Ref<ListItem[]> = ref([])

    // 加载状态
    const loading = ref(false)

    // 计算完整的 name 路径
    const fullName = computed(() => {
      const name = props.name
      if (listContext.listName?.length) {
        return [...listContext.listName, name].flat().filter(Boolean)
      }
      return Array.isArray(name) ? name : name ? [name] : []
    })

    // 是否可以添加
    const canAdd = computed(() => list.value.length < props.max)

    // 是否可以删除
    const canDelete = computed(() => list.value.length > props.min)

    // 操作方法
    const add = async (defaultValue?: any, insertIndex?: number) => {
      if (!canAdd.value) return

      const count = list.value.length
      const newRecord =
        defaultValue ??
        (typeof props.creatorRecord === 'function'
          ? props.creatorRecord()
          : (props.creatorRecord ?? {}))

      // 检查操作守卫
      if (props.actionGuard?.beforeAddRow) {
        const success = await props.actionGuard.beforeAddRow(newRecord, insertIndex ?? count, count)
        if (!success) return
      }

      const newItem: ListItem = {
        key: generateKey(),
        data: { ...newRecord },
      }

      if (insertIndex !== undefined && insertIndex >= 0 && insertIndex <= count) {
        list.value.splice(insertIndex, 0, newItem)
      } else {
        list.value.push(newItem)
      }

      props.onAfterAdd?.(newRecord, insertIndex ?? count, count + 1)
    }

    const remove = async (index: number | number[]) => {
      const indices = Array.isArray(index) ? index : [index]
      const count = list.value.length

      for (const idx of indices.sort((a, b) => b - a)) {
        if (!canDelete.value) continue

        // 检查操作守卫
        if (props.actionGuard?.beforeRemoveRow) {
          const success = await props.actionGuard.beforeRemoveRow(idx, count)
          if (!success) continue
        }

        list.value.splice(idx, 1)
        props.onAfterRemove?.(idx, list.value.length)
      }
    }

    const move = (from: number, to: number) => {
      if (from < 0 || from >= list.value.length) return
      if (to < 0 || to >= list.value.length) return
      if (from === to) return

      const item = list.value.splice(from, 1)[0]
      list.value.splice(to, 0, item)
    }

    const operation: FormListOperation = {
      add,
      remove,
      move,
    }

    // 渲染新增按钮
    const renderCreatorButton = (position: 'top' | 'bottom') => {
      if (props.creatorButtonProps === false) return null
      if (!canAdd.value) return null
      if (props.readonly) return null

      const buttonProps = props.creatorButtonProps || {}
      const buttonPosition = buttonProps.position || 'bottom'

      if (buttonPosition !== position) return null

      const buttonText = buttonProps.creatorButtonText || '添加一行'

      return (
        <Button
          class={`pro-form-list-creator-button-${position}`}
          variant="dashed"
          block={buttonProps.block !== false}
          loading={loading.value}
          icon={buttonProps.icon || (() => <AddIcon />)}
          onClick={async () => {
            loading.value = true
            const index = position === 'top' ? 0 : list.value.length
            await add(undefined, index)
            loading.value = false
          }}
        >
          {buttonText}
        </Button>
      )
    }

    // 渲染操作按钮
    const renderActionButtons = (field: { name: number; key: number }, index: number) => {
      if (props.readonly) return null

      const count = list.value.length
      const actions: VNode[] = []

      // 复制按钮
      if (props.copyIconProps !== false && canAdd.value) {
        const copyConfig = props.copyIconProps || {}
        const CopyIcon = copyConfig.Icon || FileCopyIcon
        actions.push(
          <Tooltip content={copyConfig.tooltipText || '复制此项'} key="copy">
            <span
              class="pro-form-list-action-icon action-copy"
              onClick={async () => {
                const rowData = list.value[index]?.data || {}
                await add({ ...rowData }, index + 1)
              }}
            >
              <CopyIcon />
            </span>
          </Tooltip>,
        )
      }

      // 删除按钮
      if (props.deleteIconProps !== false && canDelete.value) {
        const deleteConfig = props.deleteIconProps || {}
        const DelIcon = deleteConfig.Icon || DeleteIcon
        actions.push(
          <Tooltip content={deleteConfig.tooltipText || '删除此项'} key="delete">
            <span class="pro-form-list-action-icon action-remove" onClick={() => remove(index)}>
              <DelIcon />
            </span>
          </Tooltip>,
        )
      }

      // 向上移动按钮
      if (props.arrowSort && props.upIconProps !== false && index > 0) {
        const upConfig = props.upIconProps || {}
        const UpIcon = upConfig.Icon || ChevronUpIcon
        actions.push(
          <Tooltip content={upConfig.tooltipText || '向上移动'} key="up">
            <span
              class="pro-form-list-action-icon action-up"
              onClick={() => move(index, index - 1)}
            >
              <UpIcon />
            </span>
          </Tooltip>,
        )
      }

      // 向下移动按钮
      if (props.arrowSort && props.downIconProps !== false && index < count - 1) {
        const downConfig = props.downIconProps || {}
        const DownIcon = downConfig.Icon || ChevronDownIcon
        actions.push(
          <Tooltip content={downConfig.tooltipText || '向下移动'} key="down">
            <span
              class="pro-form-list-action-icon action-down"
              onClick={() => move(index, index + 1)}
            >
              <DownIcon />
            </span>
          </Tooltip>,
        )
      }

      // 自定义操作渲染
      if (props.actionRender) {
        return props.actionRender(field, operation, actions, count)
      }

      if (actions.length === 0) return null

      return <div class="pro-form-list-action">{actions}</div>
    }

    // 渲染列表项
    const renderListItem = (item: ListItem, index: number) => {
      const field = { name: index, key: item.key }
      const count = list.value.length

      // 创建带有额外方法的 action
      const actionWithMethods = {
        ...operation,
        getCurrentRowData: () => item.data,
        setCurrentRowData: (data: Record<string, any>) => {
          list.value[index].data = { ...item.data, ...data }
        },
      }

      // 渲染子元素
      let children: VNode | VNode[] | undefined
      if (typeof props.children === 'function') {
        children = props.children(field, index, actionWithMethods, count)
      } else if (slots.default) {
        children = slots.default({
          field,
          index,
          action: actionWithMethods,
          count,
        })
      }

      const actionDom = renderActionButtons(field, index)

      const listMeta = {
        name: props.name,
        field,
        fields: list.value.map((_, i) => ({ name: i, key: list.value[i].key })),
        index,
        operation,
        record: item.data,
        meta: { errors: [] },
      }

      // 容器渲染
      let itemContainer = children
      if (props.itemContainerRender) {
        itemContainer = props.itemContainerRender(children as VNode[], listMeta)
      }

      // 项渲染
      if (props.itemRender) {
        return (
          <FormListContextProvider
            key={item.key}
            value={{
              name: index,
              key: item.key,
              listName: [...fullName.value, index],
            }}
          >
            {props.itemRender(
              {
                listDom: (
                  <div
                    class={['pro-form-list-container', props.containerClassName]}
                    style={props.containerStyle}
                  >
                    {itemContainer}
                  </div>
                ),
                action: actionDom,
              },
              listMeta,
            )}
          </FormListContextProvider>
        )
      }

      return (
        <FormListContextProvider
          key={item.key}
          value={{
            name: index,
            key: item.key,
            listName: [...fullName.value, index],
          }}
        >
          <div
            class={[
              'pro-form-list-item',
              {
                'pro-form-list-item-default': !props.alwaysShowItemLabel,
                'pro-form-list-item-show-label': props.alwaysShowItemLabel,
              },
            ]}
            style={{
              display: 'flex',
              alignItems: 'flex-end',
            }}
          >
            <div
              class={['pro-form-list-container', props.containerClassName]}
              style={{
                flex: 1,
                ...props.containerStyle,
              }}
            >
              {itemContainer}
            </div>
            {actionDom}
          </div>
        </FormListContextProvider>
      )
    }

    return () => (
      <div class="pro-form-list" style={{ width: '100%' }}>
        {props.label && (
          <div class="pro-form-list-label" style={{ marginBottom: '8px', fontWeight: 500 }}>
            {props.label}
          </div>
        )}
        <div
          class="pro-form-list-content"
          style={{
            width: 'max-content',
            maxWidth: '100%',
            minWidth: '100%',
          }}
        >
          {renderCreatorButton('top')}
          {list.value.map((item, index) => renderListItem(item, index))}
          {props.fieldExtraRender?.(operation, { errors: [], warnings: [] })}
          {renderCreatorButton('bottom')}
        </div>
      </div>
    )
  },
})

// FormList 上下文提供者组件
const FormListContextProvider = defineComponent({
  name: 'FormListContextProvider',
  props: {
    value: {
      type: Object as PropType<FormListContextValue>,
      required: true,
    },
  },
  setup(props, { slots }) {
    provide(FormListContextKey, props.value)
    return () => slots.default?.()
  },
})

export default ProFormList
