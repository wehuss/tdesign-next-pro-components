import type { App } from 'vue'

import ProField from './components/field/component'
import ProTable from './components/table'

// 导出工具函数
export * from './components/field/component'
export * from './components/table/utils'
export * from './types'

// 导出组件
export { ProField, ProTable }

// 组件列表
const components = [ProField, ProTable]

// 全量安装函数
function install(app: App): void {
  components.forEach(component => {
    if (component.install) {
      component.install(app)
    } else if (component.name) {
      app.component(component.name, component)
    }
  })
}

// 默认导出
export default {
  install,
  version: '0.1.0',
}

// 单独导出安装函数
export { install }
