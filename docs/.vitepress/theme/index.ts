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
import ProFieldAllTypes from '../demos/pro-field/AllTypes.vue'
import ProFieldBasic from '../demos/pro-field/Basic.vue'
import ProFieldDate from '../demos/pro-field/Date.vue'
import ProFieldMode from '../demos/pro-field/Mode.vue'
import ProFieldMoney from '../demos/pro-field/Money.vue'
import ProFieldValueEnum from '../demos/pro-field/ValueEnum.vue'

// ProForm 演示
import ProFormBasic from '../demos/pro-form/Basic.vue'
import ProFormDependency from '../demos/pro-form/Dependency.vue'
import ProFormFormItems from '../demos/pro-form/FormItems.vue'
import ProFormLayout from '../demos/pro-form/Layout.vue'
import ProFormList from '../demos/pro-form/List.vue'
import ProFormValidation from '../demos/pro-form/Validation.vue'

// ProTable 演示
import ProTableActionRef from '../demos/pro-table/ActionRef.vue'
import ProTableActions from '../demos/pro-table/Actions.vue'
import ProTableBasic from '../demos/pro-table/Basic.vue'
import ProTablePagination from '../demos/pro-table/Pagination.vue'
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
    app.component('ProFieldAllTypes', ProFieldAllTypes)

    // 注册 ProForm 演示组件
    app.component('ProFormBasic', ProFormBasic)
    app.component('ProFormFormItems', ProFormFormItems)
    app.component('ProFormLayout', ProFormLayout)
    app.component('ProFormDependency', ProFormDependency)
    app.component('ProFormList', ProFormList)
    app.component('ProFormValidation', ProFormValidation)

    // 注册 ProTable 演示组件
    app.component('ProTableBasic', ProTableBasic)
    app.component('ProTableValueType', ProTableValueType)
    app.component('ProTableToolbar', ProTableToolbar)
    app.component('ProTableStatic', ProTableStatic)
    app.component('ProTablePagination', ProTablePagination)
    app.component('ProTableActions', ProTableActions)
    app.component('ProTableActionRef', ProTableActionRef)
  },
} satisfies Theme
