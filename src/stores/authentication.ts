import { defineStore } from 'pinia'
import { endpoints } from 'src/config/api'
import { ApiError } from 'src/pages/shared/error/domain/ApiError'
import { AxiosHttpRepository } from 'src/pages/shared/http/infraestructure/AxiosHttpRepository'
import { UserLogin } from 'src/pages/sistema/authentication/login/domain/UserLogin'
import { ref } from 'vue'

export const useAuthenticationStore = defineStore('authentication', () => {
  // Variables locales
  const axios = AxiosHttpRepository.getInstance()

  // State
  const user = ref(null)
  const auth = ref(false)

  // Actions
  const login = async (credentiales: UserLogin): Promise<void> => {
    try {
      await axios.get(axios.getEndpoint(endpoints.authentication))
      await axios.post(axios.getEndpoint(endpoints.login), credentiales)
      getUser()
    } catch (error: any) {
      throw new ApiError(error)
    }
  }

  async function logout(): Promise<void> {
    const axios = AxiosHttpRepository.getInstance()
    await axios.post('/logout')
    getUser()
  }

  const setUser = (userData: any) => {
    user.value = userData
    auth.value = Boolean(userData)
    localStorage.setItem('LoggedIn', Boolean(userData).toString())
  }

  const getUser = async () => {
    try {
      const res = await axios.get<any>(axios.getEndpoint(endpoints.api_user))
      setUser(res.data)
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

  function isUserLoggedIn() {
    const res = localStorage.getItem('LoggedIn') == 'true'
    console.log('DEsde pinia')
    console.log(res)
    console.log('Fin pinia')
    return res
  }

  return {
    user,
    login,
    logout,
    getUser,
    actualizarContrasena,
    isUserLoggedIn,
  }
})
