import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import './custom.css'

// TDesign 样式
import 'tdesign-vue-next/es/style/index.css'

// TDesign 组件
import TDesign from 'tdesign-vue-next'

// 演示组件
import DemoContainer from '../components/DemoContainer.vue'

// ProField 演示
import ProFieldBasic from '../demos/pro-field/Basic.vue'
import ProFieldDate from '../demos/pro-field/Date.vue'
import ProFieldMode from '../demos/pro-field/Mode.vue'
import ProFieldMoney from '../demos/pro-field/Money.vue'
import ProFieldValueEnum from '../demos/pro-field/ValueEnum.vue'

// ProTable 演示
import ProTableBasic from '../demos/pro-table/Basic.vue'
import ProTableStatic from '../demos/pro-table/Static.vue'
import ProTableToolbar from '../demos/pro-table/Toolbar.vue'
import ProTableValueType from '../demos/pro-table/ValueType.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    // 注册 TDesign
    app.use(TDesign)

    // 注册演示容器
    app.component('DemoContainer', DemoContainer)

    // 注册 ProField 演示组件
    app.component('ProFieldBasic', ProFieldBasic)
    app.component('ProFieldMode', ProFieldMode)
    app.component('ProFieldValueEnum', ProFieldValueEnum)
    app.component('ProFieldMoney', ProFieldMoney)
    app.component('ProFieldDate', ProFieldDate)

    // 注册 ProTable 演示组件
    app.component('ProTableBasic', ProTableBasic)
    app.component('ProTableValueType', ProTableValueType)
    app.component('ProTableToolbar', ProTableToolbar)
    app.component('ProTableStatic', ProTableStatic)
  },
} satisfies Theme
