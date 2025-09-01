import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { ApiError } from 'shared/error/domain/ApiError'
import { endpoints } from 'src/config/api'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { LocalStorage } from 'quasar'
import { AxiosError, AxiosResponse } from 'axios'
import { Empleado } from 'pages/recursosHumanos/empleados/domain/Empleado'
import { Postulante } from 'pages/recursosHumanos/seleccion_contratacion_personal/postulante/domain/Postulante'
import { ForgotPassword } from 'sistema/authentication/forgotPassword/domain/ForgotPassword'
import { ResetPassword } from 'sistema/authentication/resetPassword/domain/ResetPassword'
import { UserLoginPostulante } from 'pages/recursosHumanos/seleccion_contratacion_personal/login-postulante/domain/UserLoginPostulante'
import { tipoAutenticacion } from 'config/utils'

export const useAuthenticationExternalStore = defineStore('authentication_external', () => {
  // Variables locales
  const axios = AxiosHttpRepository.getInstance()
  let usuarioFueConsultado = false

  // State
  const user = ref()
  const auth = ref(false)
  const roles = ref()
  const permisos = ref()
  const nombre_usuario = ref() // Para resetear clave
  const nombreUsuario = computed(
    () =>
      `${user.value?.nombres}${user.value?.apellidos ? ' ' + user.value.apellidos : ''
      }`
  )

  function extraerRol(roles: string[], rolConsultar: string) {
    return roles.some((rol: string) => rol === rolConsultar)
  }

  // Actions
  /**
   * Este metodo realiza el inicio de sesion de un usuario externo
   * @param credentiales
   * @returns
   */
  const login = async (
    credentiales: UserLoginPostulante
  ): Promise<Empleado> => {
    try {
      const login = axios.getEndpoint(endpoints.login_externos)
      const response: AxiosResponse = await axios.post(login, credentiales)

      LocalStorage.set('token', response.data.access_token)
      LocalStorage.set('method_access', tipoAutenticacion.usuario_externo)
      setUser(response.data.modelo)
      roles.value = response.data.modelo.roles
      permisos.value = response.data.modelo.permisos

      return response.data.modelo
    } catch (error: unknown) {
      console.log(error)

      const axiosError = error as AxiosError
      throw new ApiError(axiosError)
    }
  }

  const registro = async (credentiales: Postulante): Promise<UserLoginPostulante> => {
    try {
      const registrar = axios.getEndpoint(endpoints.registro)
      const response: AxiosResponse = await axios.post(registrar,credentiales)
      LocalStorage.set('token', response.data.access_token)
      LocalStorage.set('method_access', tipoAutenticacion.usuario_externo)
      setUser(response.data.modelo)
      return response.data.modelo
    } catch (error) {
      const axiosError = error as AxiosError
      throw new ApiError(axiosError)
    }
  }

  const loginTerceros = async (driver) => {
    try {
      const url = axios.getEndpoint(endpoints.login_externos)
      // const url = login + driver
      const response: AxiosResponse = await axios.post(url, { driver, oauth: 1 })
      console.log('login terceros', response)
      LocalStorage.set('token', response.data.access_token)
      LocalStorage.set('method_access', tipoAutenticacion.usuario_externo)
      window.location.href = response.data.url
    } catch (error) {
      console.log(error)
      const axiosError = error as AxiosError
      throw new ApiError(axiosError)
    }
  }

  const enviarCorreoRecuperacion = async (userLogin: ForgotPassword) => {
    try {
      await axios.post(
        axios.getEndpoint(endpoints.enviar_correo_recuperacion),
        userLogin
      )
    } catch (error: unknown) {
      const axiosError = error as AxiosError
      throw new ApiError(axiosError)
    }
  }

  const recuperacionCuenta = async (userLogin: ForgotPassword) => {
    try {
      await axios.post(
        axios.getEndpoint(endpoints.recuperacion_cuenta),
        userLogin
      )
    } catch (error: unknown) {
      const axiosError = error as AxiosError
      throw new ApiError(axiosError)
    }
  }
      /**
       * La función "cerrar sesión" cierra la sesión del usuario enviando una solicitud POST al endpoint
   * de cierre de sesión, eliminando el token del almacenamiento local y actualizando el título del
   * documento.
   */
  async function logout() {
    await axios.post(axios.getEndpoint(endpoints.logout_postulante))
    LocalStorage.remove('token')
    LocalStorage.remove('method_access')
    await getUser()
    document.title = 'JPCONSTRUCRED'
  }

  const setUser = (userData: Postulante | null) => {
    user.value = userData
    auth.value = Boolean(userData)
  }


  const setNombreusuario = (email: string) => {
    nombre_usuario.value = email
  }
  const getNombreusuario = () => {
    return nombre_usuario.value
  }

  const getUser = async () => {
    try {
      const userApi = axios.getEndpoint(endpoints.api_user_postulante)
      const response = await axios.get<AxiosResponse>(userApi)
      setUser(response.data.data)
      //permisos.value = response.data.permisos
      return response.data.data
    } catch (e) {
      setUser(null)
    }
  }

  const actualizarContrasena = async (userReset: ResetPassword) => {
    try {
      await axios.post(axios.getEndpoint(endpoints.reset_password), userReset)
    } catch (error: unknown) {
      const axiosError = error as AxiosError
      throw new ApiError(axiosError)
    }
  }

  async function isUserLoggedIn(): Promise<boolean> {
    // console.log('authExternal...', auth.value)
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
    nombre_usuario,
    login,
    loginTerceros,
    enviarCorreoRecuperacion,
    recuperacionCuenta,
    nombreUsuario,
    logout,
    roles,
    permisos,
    can,
    getUser,
    getNombreusuario,
    setNombreusuario,
    actualizarContrasena,
    isUserLoggedIn,
    extraerRol,
    registro,
    setUser,

    // verificar si es cierto Rol
    esRecursosHumanos:false,
  }
}
)
