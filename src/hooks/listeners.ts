import { getCurrentInstance, onBeforeUpdate, ref } from 'vue'

type Listeners = Record<string, (...arg: unknown[]) => unknown>

const listenerRE = /^on[A-Z]/

export default function useListeners() {
  const { vnode } = getCurrentInstance()!

  const listeners = ref<Listeners>({})

  const update = () => {
    const _listeners: Listeners = {}

    for (const key in vnode.props) {
      if (listenerRE.test(key)) {
        _listeners[key] = vnode.props[key]
      }
    }

    listeners.value = _listeners
  }

  onBeforeUpdate(update)

  update()

  return {
    listeners,
  }
}
