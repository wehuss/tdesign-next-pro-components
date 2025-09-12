import type { CSSProperties } from 'vue'
import { computed, defineComponent } from 'vue'

export interface LightWrapperProps {
  light?: boolean
  customLightMode?: boolean
  size?: 'small' | 'medium' | 'large'
  style?: CSSProperties
}

export const LightWrapper = defineComponent({
  name: 'LightWrapper',
  props: {
    light: {
      type: Boolean,
      default: false,
    },
    customLightMode: {
      type: Boolean,
      default: false,
    },
    size: {
      type: String as () => 'small' | 'medium' | 'large',
      default: 'medium',
    },
    style: {
      type: Object as () => CSSProperties,
      default: () => ({}),
    },
  },
  setup(props, { slots }) {
    const wrapperStyle = computed(() => {
      const baseStyle: CSSProperties = {
        ...props.style,
      }

      if (props.light && !props.customLightMode) {
        return {
          ...baseStyle,
          padding: '4px 8px',
          border: '1px solid var(--td-border-level-1-color)',
          borderRadius: '6px',
          backgroundColor: 'var(--td-bg-color-container)',
        }
      }

      return baseStyle
    })

    return () => (
      <div style={wrapperStyle.value}>
        {slots.default?.()}
      </div>
    )
  },
})

export default LightWrapper