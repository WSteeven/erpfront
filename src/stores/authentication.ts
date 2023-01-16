import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { UserLogin } from 'src/pages/sistema/authentication/login/domain/UserLogin'
import { ApiError } from 'shared/error/domain/ApiError'
import { rolesSistema } from 'config/utils'
import { endpoints } from 'src/config/api'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { LocalStorage } from 'quasar'
import { AxiosResponse } from 'axios'

export const useAuthenticationStore = defineStore('authentication', () => {
  // Variables locales
  const axios = AxiosHttpRepository.getInstance()
  let usuarioFueConsultado = false

  // State
  const user = ref()
  const auth = ref(false)
  const permisos = ref()
  const nombreUsuario = computed(
    () =>
      `${user.value?.nombres}${user.value?.apellidos ? ' ' + user.value.apellidos : ''
      }`
  )

  const esCoordinador = computed(() => user.value ? extraerRol(user.value.rol, rolesSistema.coordinador) : false)
  const esTecnicoLider = computed(() => user.value ? extraerRol(user.value.rol, rolesSistema.tecnico_lider) : false)
  const esBodeguero = computed(() => user.value ? extraerRol(user.value.rol, rolesSistema.bodega) : false)
  const esActivosFijos = computed(() => user.value ? extraerRol(user.value.rol, rolesSistema.activos_fijos) : false)

  function extraerRol(roles: string[], rolConsultar: string) {
    return roles.some((rol: string) => rol === rolConsultar)
  }

  // Actions
  const login = async (credentiales: UserLogin): Promise<any> => {
    try {
      const csrf_cookie = axios.getEndpoint(endpoints.csrf_cookie)
      await axios.get(csrf_cookie)

      const login = axios.getEndpoint(endpoints.login)
      const response: AxiosResponse = await axios.post(login, credentiales)

      LocalStorage.set('token', response.data.access_token)
      setUser(response.data.modelo)
      permisos.value = response.data.modelo.permisos

      return response.data.modelo
    } catch (error: any) {
      throw new ApiError(error)
    }
  }

  async function logout(): Promise<any> {
    await axios.post(axios.getEndpoint(endpoints.logout))
    LocalStorage.remove('token')
    await getUser()
  }

  const setUser = (userData: any) => {
    user.value = userData
    auth.value = Boolean(userData)
  }

  const getUser = async () => {
    try {
      const userApi = axios.getEndpoint(endpoints.api_user)
      const response = await axios.get<any>(userApi, getHeaderToken())

      setUser(response.data)

      permisos.value = response.data.permisos
      return response.data

    } catch (e) {
      setUser(null)
    }
  }

  function getHeaderToken() {
    return {
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${LocalStorage.getItem('token')}`,
      },
    }
  }

  const actualizarContrasena = async (userLogin: UserLogin) => {
    try {
      await axios.post(axios.getEndpoint(endpoints.reset_password), userLogin)
    } catch (error: any) {
      throw new ApiError(error)
    }
  }

  async function isUserLoggedIn(): Promise<boolean> {
    if (!usuarioFueConsultado) {
      await getUser()
      usuarioFueConsultado = true
    }
    return auth.value
  }

  function can(permiso: string) {
    return permisos.value?.indexOf(permiso) !== -1
  }

  return {
    user,
    login,
    nombreUsuario,
    logout,
    permisos,
    can,
    getUser,
    actualizarContrasena,
    isUserLoggedIn,
    esCoordinador,
    esTecnicoLider,
    esBodeguero,
    esActivosFijos,
    extraerRol,
  }
})
