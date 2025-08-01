import type { App } from 'vue'

// 组件导入
import ProTable from './components/table'

// 样式导入
import 'tdesign-vue-next/es/style/index.css'

// 组件列表
const components = [ProTable]

// 全量安装
const install = (app: App): void => {
  components.forEach(component => {
    // app.use(component)
  })
}

// 按需导出
export { install, ProTable }

// 全量导出
export default {
  install,
  version: '__VERSION__',
}

// 全局类型声明
declare module 'vue' {
  export interface GlobalComponents {
    TProTable: typeof ProTable
  }
}
