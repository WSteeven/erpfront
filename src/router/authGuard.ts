import { RouteLocationNormalized, NavigationGuardNext } from 'vue-router'
import { LocalStorage } from 'quasar'
import { tipoAutenticacion } from 'config/utils'
import { permisoRequerido } from 'shared/helpers/verifyAuthenticatedUser'
import { useAuthenticationStore } from 'src/stores/authentication'
import { useAuthenticationExternalStore } from 'src/stores/authenticationExternal'

const INTERNAL = 'private'
const EXTERNAL = 'external'
type AuthStrategy = 'private' | 'external'

const strategyMap = {
  [tipoAutenticacion.empleado]: INTERNAL,
  [tipoAutenticacion.usuario_externo]: EXTERNAL
} as components

function getStrategy(): AuthStrategy {
  const method = LocalStorage.getItem('method_access')
  return strategyMap[method] || INTERNAL
}

async function checkInternal(
  to: RouteLocationNormalized,
  _: any,
  next: NavigationGuardNext
) {
  const auth = useAuthenticationStore()
  const loggedIn = await auth.isUserLoggedIn()

  if (to.meta.requiresAuth) {
    if (loggedIn) {
      if (auth.can(`puede.acceder.${to.name}`) && permisoRequerido(to)) {
        next()
      } else if (!permisoRequerido(to)) {
        next()
      } else {
        next({ name: '404' })
      }
    } else {
      next(
        to.query.q === EXTERNAL
          ? { name: 'LoginPostulante', query: { redirect: to.fullPath } }
          : { name: 'Login', query: { redirect: to.fullPath } }
      )
    }
  } else if (
    loggedIn &&
    ['Login', 'ResetPassword', 'Register'].includes(to.name?.toString() ?? '')
  ) {
    next({ name: 'intranet' })
  } else {
    next()
  }
}

async function checkExternal(
  to: RouteLocationNormalized,
  _: any,
  next: NavigationGuardNext
) {
  const auth = useAuthenticationExternalStore()
  const loggedIn = await auth.isUserLoggedIn()

  if (to.meta.requiresAuth) {
    if (loggedIn) {
      if (auth.can(`puede.acceder.${to.name}`) && permisoRequerido(to)) {
        next()
      } else if (!permisoRequerido(to)) {
        next()
      } else {
        next({ name: '404' })
      }
    } else {
      next({ name: 'LoginPostulante', query: { redirect: to.fullPath } })
    }
  } else if (
    loggedIn &&
    ['LoginPostulante', 'RegistroPostulante'].includes(
      to.name?.toString() ?? ''
    )
  ) {
    next({ name: 'puestos_disponibles' })
  } else {
    next()
  }
}

export async function authGuard(
  to: RouteLocationNormalized,
  _: any,
  next: NavigationGuardNext
) {
  const strategy = getStrategy()

  return strategy === EXTERNAL
    ? checkExternal(to, _, next)
    : checkInternal(to, _, next)
}
