import { Col, Row } from 'tdesign-vue-next'
import { defineComponent, h, inject, provide, type InjectionKey } from 'vue'
import type { ProFormGridConfig } from '../typing'

export interface GridContextValue {
  grid?: boolean
  colProps?: Record<string, any>
}

export const GridContextKey: InjectionKey<GridContextValue> =
  Symbol('GridContext')

export const useGridContext = () => {
  return inject(GridContextKey, {} as GridContextValue)
}

export const provideGridContext = (value: GridContextValue) => {
  provide(GridContextKey, value)
}

export const GridContext = {
  provide: provideGridContext,
  inject: useGridContext,
}

export const useGridHelpers = (config: ProFormGridConfig) => {
  const { grid, rowProps } = config

  const RowWrapper = defineComponent({
    name: 'RowWrapper',
    setup(_, { slots }) {
      if (!grid) {
        return () => slots.default?.()
      }

      return () => h(Row, rowProps, slots.default?.())
    },
  })

  const ColWrapper = defineComponent({
    name: 'ColWrapper',
    props: {
      colProps: {
        type: Object,
        default: () => ({}),
      },
    },
    setup(props, { slots }) {
      const gridContext = useGridContext()

      if (!gridContext.grid) {
        return () => slots.default?.()
      }

      return () =>
        h(
          Col,
          { ...gridContext.colProps, ...props.colProps },
          slots.default?.()
        )
    },
  })

  return {
    RowWrapper,
    ColWrapper,
  }
}
