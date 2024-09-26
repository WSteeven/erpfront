import { boot } from 'quasar/wrappers'
import { App } from 'vue'
import globals from './globals'

/* export default boot(({ app }: { app: App }) => {
    app.provide('globals', globals)
}) */

declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        $globals: typeof globals
    }
}

export default boot(({ app }: { app: App }) => {
    app.config.globalProperties.$globals = globals
}) 
