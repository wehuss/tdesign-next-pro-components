import TDesignProComponents from '@/index'
import TDesign from 'tdesign-vue-next'
import 'tdesign-vue-next/es/style/index.css'
import { createApp } from 'vue'

import App from './app'

const app = createApp(App)
app.use(TDesign)
app.use(TDesignProComponents)
app.mount('#app')
