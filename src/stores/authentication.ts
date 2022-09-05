import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { UserLogin } from 'src/pages/sistema/authentication/login/domain/UserLogin'
import { ApiError } from 'shared/error/domain/ApiError'
import { endpoints } from 'src/config/api'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthenticationStore = defineStore('authentication', () => {
  // Variables locales
  const axios = AxiosHttpRepository.getInstance()
  let usuarioFueConsultado = false

  // State
  const user = ref()
  const auth = ref(false)
  const permisos = ref()

  // Actions 
  const login = async (credentiales: UserLogin): Promise<void> => {
    try {
      await axios.get(axios.getEndpoint(endpoints.authentication))
      await axios.post(axios.getEndpoint(endpoints.login), credentiales)
      await getUser()
    } catch (error: any) {
      throw new ApiError(error)
    }
  }

  async function logout(): Promise<void> {
    const axios = AxiosHttpRepository.getInstance()
    await axios.post('/logout')
    await getUser()
  }

  const setUser = (userData: any) => {
    user.value = userData
    auth.value = Boolean(userData)
  }

  const getUser = async () => {
    try {
      const res = await axios.get<any>(axios.getEndpoint(endpoints.api_user))
      setUser(res.data)
      if (auth.value) await getPermisos()
    } catch (e) {
      setUser(null)
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

  // Permisos
  const getPermisos = async () => {
    try {
      const res = await axios.get<any>(axios.getEndpoint(endpoints.permisos))
      permisos.value = res.data
    } catch (error: any) {
      throw new ApiError(error)
    }
  }

  function can(permiso: string) {
    return permisos.value.indexOf(permiso) !== -1
  }

  return {
    user,
    login,
    logout,
    permisos,
    can,
    getUser,
    actualizarContrasena,
    isUserLoggedIn,
  }
})
