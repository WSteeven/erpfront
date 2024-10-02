import { route } from 'quasar/wrappers'
import { useAuthenticationStore } from 'src/stores/authentication'
import { useAuthenticationExternalStore } from 'src/stores/authenticationExternal'

import { createMemoryHistory, createRouter, createWebHashHistory, createWebHistory, RouteLocationNormalized, } from 'vue-router'

import routes from './routes'
import { LocalStorage } from 'quasar'
import { tipoAutenticacion } from 'config/utils'
import { permisoRequerido } from 'shared/helpers/verifyAuthenticatedUser'

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
  let method_access = LocalStorage.getItem('method_access') // esto indica si el usuario accede como empleado (private) o como usuario externo (external)

  async function routerInternal(to: RouteLocationNormalized, _, next) {
    const sessionIniciada = await authentication.isUserLoggedIn()
    // Si la ruta requiere autenticacion
    if (to.matched.some((ruta) => ruta.meta.requiresAuth)) {
      if (sessionIniciada) {
        if (authentication.can('puede.acceder.' + to.name?.toString()) && permisoRequerido(to)) {
          next()
        } else if (!permisoRequerido(to)) {
          next()
        } else {
          next({ name: '404' })
        }
      } else {
        if (to.query.q == 'external') next({ name: 'LoginPostulante' }) //esto ayuda a decidir a qué login redirigir al usuario
        else next({ name: 'Login' })
      }
    } else if (
      sessionIniciada &&
      ['Login', 'ResetPassword', 'Register'].includes(to.name?.toString() ?? '')
    ) {
      next({ name: 'tablero_personal' })
    } else {
      next()
    }
  }
  async function routerExternal(to, _, next) {
    const sessionIniciada = await authenticationExternal.isUserLoggedIn()

    // Si la ruta requiere autenticacion
    if (to.matched.some((ruta) => ruta.meta.requiresAuth)) {
      if (sessionIniciada) {
        if (authentication.can('puede.acceder.' + to.name?.toString()) && permisoRequerido(to)) {
          next()
        } else if (!permisoRequerido(to)) {
          next()
        } else {
          next({ name: '404' })
        }
      } else {
        next({ name: 'LoginPostulante' })
      }
    } else if (sessionIniciada && ['LoginPostulante', 'RegistroPostulante'].includes(to.name?.toString() ?? '')) {
      next({ name: 'puestos_disponibles' })
    } else {
      next()
    }
  }
  Router.beforeEach(async (to, _, next) => {
    method_access = LocalStorage.getItem('method_access')
    switch (method_access) {
      case tipoAutenticacion.usuario_externo:
        await routerExternal(to, _, next)
        break
      case tipoAutenticacion.empleado:
        await routerInternal(to, _, next)
        break
      default:
        await routerInternal(to, _, next)
    }
  })
  return Router
})
