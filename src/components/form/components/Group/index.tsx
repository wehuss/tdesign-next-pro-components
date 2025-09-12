import { Space } from 'tdesign-vue-next'
import { defineComponent } from 'vue'

export const ProFormGroup = defineComponent({
  name: 'ProFormGroup',
  props: {
    title: String,
    size: {
      type: String as () => 'small' | 'medium' | 'large',
      default: 'medium',
    },
    direction: {
      type: String as () => 'horizontal' | 'vertical',
      default: 'horizontal',
    },
    align: {
      type: String as () => 'start' | 'end' | 'center' | 'baseline',
    },
    wrap: {
      type: Boolean,
      default: true,
    },
    titleStyle: Object,
    titleRender: Function,
  },
  setup(props, { slots }) {
    return () => (
      <div class="pro-form-group">
        {(props.title || props.titleRender) && (
          <div class="pro-form-group-title" style={props.titleStyle}>
            {props.titleRender ? props.titleRender(props.title) : props.title}
          </div>
        )}
        <Space
          direction={props.direction}
          size={props.size}
          align={props.align}
          breakLine={props.wrap}
        >
          {slots.default?.()}
        </Space>
      </div>
    )
  },
})

export default ProFormGroup