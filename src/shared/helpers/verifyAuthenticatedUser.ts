import { useAuthenticationStore } from 'stores/authentication'
import { useAuthenticationExternalStore } from 'stores/authenticationExternal'
import { tipoAutenticacion } from 'config/utils';
import { RouteLocationNormalized } from 'vue-router';
/**
 * Checks if a user is authenticated and returns their authentication status and type.
 *
 * @returns A tuple containing two elements:
 * - A boolean indicating whether the user is authenticated.
 * - A string representing the type of authentication (e.g., 'empleado', 'usuario_externo') or null if the user is not authenticated.
 */
export function  userIsAuthenticated() {
  const store = useAuthenticationStore()
  const storeExternal = useAuthenticationExternalStore()
  if (store.user) {
  // console.log('if store.user',  true,  tipoAutenticacion.empleado, store)
    return { autenticado: true, tipoAutenticacion: tipoAutenticacion.empleado, store: store }
  } else if (storeExternal.user) {
    // console.log('else if storeExternal.user',  true,  tipoAutenticacion.usuario_externo, store)
    return { autenticado: true, tipoAutenticacion: tipoAutenticacion.usuario_externo, store: storeExternal }
  } else
    // console.log('else ',  false, null, null)
    return { autenticado: false, tipoAutenticacion: null, store: null }
}

export function permisoRequerido(ruta: RouteLocationNormalized) {
  return ruta.meta.hasOwnProperty('permissionRequired') ? ruta.meta.permissionRequired : true
}
