import { AddIcon, DeleteIcon } from 'tdesign-icons-vue-next'
import { Button } from 'tdesign-vue-next'
import { computed, defineComponent, ref } from 'vue'
import { ProFormItem } from '../FormItem'

export const ProFormList = defineComponent({
  name: 'ProFormList',
  props: {
    name: String,
    label: String,
    min: {
      type: Number,
      default: 0,
    },
    max: {
      type: Number,
      default: Infinity,
    },
    copyIconProps: Object,
    deleteIconProps: Object,
    actionGuard: Object,
    creatorButtonProps: Object,
    creatorRecord: [Object, Function],
    itemRender: Function,
    children: Function,
  },
  setup(props, { slots }) {
    const list = ref<any[]>([])

    const canAdd = computed(() => list.value.length < props.max)
    const canDelete = computed(() => list.value.length > props.min)

    const add = (record?: any) => {
      const newRecord = record || props.creatorRecord || {}
      list.value.push(typeof newRecord === 'function' ? newRecord() : newRecord)
    }

    const remove = (index: number) => {
      if (canDelete.value) {
        list.value.splice(index, 1)
      }
    }

    return () => (
      <ProFormItem name={props.name} label={props.label}>
        <div class="pro-form-list">
          {list.value.map((item, index) => (
            <div key={index} class="pro-form-list-item">
              <div class="pro-form-list-content">
                {props.children?.(item, index, { add, remove })}
              </div>
              {canDelete.value && (
                <Button
                  variant="text"
                  shape="square"
                  icon={() => <DeleteIcon />}
                  onClick={() => remove(index)}
                  {...props.deleteIconProps}
                />
              )}
            </div>
          ))}
          {canAdd.value && (
            <Button
              variant="dashed"
              block
              icon={() => <AddIcon />}
              onClick={() => add()}
              {...props.creatorButtonProps}
            >
              添加一行
            </Button>
          )}
        </div>
      </ProFormItem>
    )
  },
})

export default ProFormList