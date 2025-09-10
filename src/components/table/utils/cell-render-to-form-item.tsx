/**
 * 单元格渲染为表单项工具函数
 * 移植自 ant-design/pro-components 适配 TDesign Vue Next
 */
import type { TableRowData } from 'tdesign-vue-next'
import type { VNode } from 'vue'
import { computed, defineComponent } from 'vue'
import { ProField } from '../../field'
import type { ProFieldMode, ProFieldValueType } from '../../field/types'
import type { ProTableColumn } from '../types'

const SHOW_EMPTY_TEXT_LIST = ['', null, undefined]

export interface CellRenderToFormItemProps<
  T extends TableRowData = TableRowData,
> {
  text: string | number | (string | number)[]
  valueType:
    | ProFieldValueType
    | ((record?: T, type?: string) => ProFieldValueType)
  index: number
  rowData?: T
  columnEmptyText?: string
  columnProps?: ProTableColumn<T> & {
    entity?: T // 兼容性处理
  }
  type?: 'table' | 'form'
  // 行的唯一 key
  recordKey?: string | number
  mode: ProFieldMode
  /**
   * 如果存在，则在表单中使用 EditableTable
   */
  prefixName?: string
  subName?: string[]
}

/**
 * 拼接用于编辑的 key
 */
export const spellNamePath = (...rest: unknown[]): (string | number)[] => {
  return rest
    .filter(index => index !== undefined)
    .map(item => {
      if (typeof item === 'number') {
        return item.toString()
      }
      return item
    })
    .flat(1) as (string | number)[]
}

/**
 * 单元格渲染为表单项的组件
 */
const CellRenderToFormItem = defineComponent({
  name: 'CellRenderToFormItem',
  props: {
    text: {},
    valueType: {} as () =>
      | ProFieldValueType
      | ((record?: unknown, type?: string) => ProFieldValueType),
    index: Number,
    rowData: Object,
    columnEmptyText: String,
    columnProps: Object as () => ProTableColumn,
    type: String as () => 'table' | 'form',
    recordKey: [String, Number],
    mode: String as () => ProFieldMode,
    prefixName: String,
    subName: Array as () => string[],
  },
  setup(props) {
    // 计算最终的值和类型
    const finalValue = computed(() => {
      // 对于 index 和 indexBorder 类型，使用索引值
      const currentValueType =
        typeof props.valueType === 'function'
          ? props.valueType(props.rowData, props.type)
          : props.valueType

      if (currentValueType === 'index' || currentValueType === 'indexBorder') {
        return props.index
      }
      return props.text
    })

    const finalValueType = computed(() => {
      return typeof props.valueType === 'function'
        ? props.valueType(props.rowData, props.type)
        : props.valueType
    })

    // 生成表单项
    const generateFormItem = () => {
      const { columnProps } = props

      // 如果有自定义的 formItemRender，则使用它
      if (columnProps?.formItemRender) {
        const fieldDom = (
          <ProField
            modelValue={finalValue.value}
            valueType={finalValueType.value}
            mode={props.mode}
            fieldProps={columnProps?.form?.fieldProps}
            valueEnum={columnProps?.valueEnum}
          />
        )

        return columnProps.formItemRender(
          {
            ...columnProps,
            index: props.index,
            isEditable: props.mode === 'edit',
            type: 'table',
          },
          {
            defaultRender: () => fieldDom,
            type: 'form',
            recordKey: props.recordKey,
            record: {
              ...props.rowData,
            },
            isEditable: props.mode === 'edit',
          },
          undefined, // form instance
          undefined // editableUtils
        )
      }

      // 默认使用 ProField
      return (
        <ProField
          modelValue={finalValue.value}
          valueType={finalValueType.value}
          mode={props.mode}
          fieldProps={columnProps?.form?.fieldProps}
          valueEnum={columnProps?.valueEnum}
          emptyText={props.columnEmptyText}
        />
      )
    }

    return () => {
      const { text, mode } = props
      const currentValueType = finalValueType.value

      // 如果 valueType === text，没必要多走一次 render
      if (
        (!currentValueType ||
          ['textarea', 'text'].includes(currentValueType.toString())) &&
        // valueEnum 存在说明是个select
        !props.columnProps?.valueEnum &&
        mode === 'read'
      ) {
        // 如果是''、null、undefined 显示columnEmptyText
        return SHOW_EMPTY_TEXT_LIST.includes(text as any)
          ? props.columnEmptyText
          : text
      }

      /** 只读模式直接返回就好了，不需要处理 formItem */
      if (mode !== 'edit') {
        return (
          <ProField
            mode="read"
            modelValue={finalValue.value}
            valueType={currentValueType}
            valueEnum={props.columnProps?.valueEnum}
            fieldProps={props.columnProps?.form?.fieldProps}
            emptyText={props.columnEmptyText}
          />
        )
      }

      return generateFormItem()
    }
  },
})

/**
 * 根据不同的类型来转化数值
 * @param config 配置参数
 */
function cellRenderToFormItem<T extends TableRowData>(
  config: CellRenderToFormItemProps<T>
): VNode {
  return <CellRenderToFormItem {...(config as any)} />
}

export default cellRenderToFormItem
