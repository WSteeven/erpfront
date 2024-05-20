import { route } from 'quasar/wrappers'
import { useAuthenticationStore } from 'src/stores/authentication'
import { useAuthenticationExternalStore } from 'src/stores/authenticationExternal'

import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router'

import routes from './routes'

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation
 *
 * The function below can be async too either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
    ? createWebHistory
    : createWebHashHistory

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE),
  })

  const authentication = useAuthenticationStore()
  const authenticationExternal = useAuthenticationExternalStore()

  Router.beforeEach(async (to, _, next) => {
    const sessionIniciada = to.name.toLowerCase().indexOf('puesto'.toLowerCase()) !== -1? await authenticationExternal.isUserLoggedIn(): await authentication.isUserLoggedIn()
    // Si la ruta requiere autenticacion
    if (to.matched.some((ruta) => ruta.meta.requiresAuth)) {
      if (sessionIniciada) {
        if (authentication.can('puede.ver.' + to.name?.toString())) {
          next()
        } else {
          next({ name: '404' })
        }
      } else {
        next({ name: 'Login' })
      }
    } else if (
      sessionIniciada &&
      ['Login', 'ResetPassword', 'Register'].includes(to.name?.toString() ?? '')
    ) {
      next({ name: 'tablero_personal' })
    } else {
      next()
    }
  })
  return Router
})
