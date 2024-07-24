import { useAuthenticationStore } from '../../stores/authentication';
import { useAuthenticationExternalStore } from '../../stores/authenticationExternal';
import { tipoAutenticacion } from '../../config/utils';
/**
 * Checks if a user is authenticated and returns their authentication status and type.
 *
 * @returns A tuple containing two elements:
 * - A boolean indicating whether the user is authenticated.
 * - A string representing the type of authentication (e.g., 'empleado', 'usuario_externo') or null if the user is not authenticated.
 */
export function userIsAuthenticated() {
  const store = useAuthenticationStore()
  const storeExternal = useAuthenticationExternalStore()
  if (store.user) {
    return { autenticado: true, tipoAutenticacion: tipoAutenticacion.empleado }
  } else if (storeExternal.user) {
    return { autenticado: true, tipoAutenticacion: tipoAutenticacion.usuario_externo }
  } else
    return { autenticado: false, tipoAutenticacion: null }
}
