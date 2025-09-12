import { defineComponent } from 'vue'

export const ProFormFieldSet = defineComponent({
  name: 'ProFormFieldSet',
  props: {
    title: String,
    tooltip: String,
    extra: String,
    size: {
      type: String as () => 'small' | 'medium' | 'large',
      default: 'medium',
    },
    titleStyle: Object,
    contentStyle: Object,
  },
  setup(props, { slots }) {
    return () => (
      <fieldset class="pro-form-fieldset">
        {props.title && (
          <legend class="pro-form-fieldset-title" style={props.titleStyle}>
            {props.title}
            {props.tooltip && <span class="pro-form-fieldset-tooltip">{props.tooltip}</span>}
            {props.extra && <span class="pro-form-fieldset-extra">{props.extra}</span>}
          </legend>
        )}
        <div class="pro-form-fieldset-content" style={props.contentStyle}>
          {slots.default?.()}
        </div>
      </fieldset>
    )
  },
})

export default ProFormFieldSet