import { boot } from 'quasar/wrappers'
import { defineAsyncComponent } from 'vue'
import * as echarts from 'echarts'

export default boot(({ app }) => {
  app.provide('echarts', echarts)
  app.component(
    'VChart',
    defineAsyncComponent(() => import('vue-echarts'))
  )
})