import type { App, CSSProperties, DefineComponent, Plugin } from 'vue'

// 组件安装接口
export interface InstallableComponent {
  install: (app: App) => void
}

// Pro 组件类型
export type ProComponent = DefineComponent & Plugin

// 基础组件属性
export interface BaseComponentProps {
  class?: string
  style?: string | CSSProperties
}

// 通用工具类型
export type Recordable<T = unknown> = Record<string, T>

export type Nullable<T> = T | null

export type Arrayable<T> = T | T[]

// 导出所有类型
export * from './components'
