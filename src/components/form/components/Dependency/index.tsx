import { computed, defineComponent } from 'vue'
import { useFieldContext } from '../../FieldContext'

export const ProFormDependency = defineComponent({
  name: 'ProFormDependency',
  props: {
    name: [String, Array],
    children: Function,
  },
  setup(props, { slots }) {
    const fieldContext = useFieldContext()
    
    const dependencyValues = computed(() => {
      if (!props.name || !fieldContext.formRef?.value) {
        return {}
      }
      
      const names = Array.isArray(props.name) ? props.name : [props.name]
      const values: Record<string, any> = {}
      
      names.forEach(name => {
        values[name] = fieldContext.formRef.value.getFieldValue?.(name)
      })
      
      return values
    })

    return () => {
      if (props.children) {
        return props.children(dependencyValues.value)
      }
      return slots.default?.(dependencyValues.value)
    }
  },
})

export default ProFormDependency