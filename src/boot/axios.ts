import { boot } from 'quasar/wrappers'
import axios, { AxiosInstance } from 'axios'
import { LocalStorage, Notify } from 'quasar'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance
  }
}

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// 'export default () => {}' function below (which runs individually
// for each client)
const api = axios.create({
  baseURL: process.env.API_URL,
  withCredentials: true
})

export default boot(({ app, router }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API

  // configuration of interceptors
  // aqui se configura para cuando reciba una respuesta 401 redirija automaticamente al login

  api.interceptors.response.use(
    response => response,
    error => {
      if (error.response && error.response.status === 401) {
        // Solo si no está en la raíz para que no se produzca un proceso ciclico
        if (router.currentRoute.value.path !== '/') {

          // Mostrar notificación
          Notify.create({
            type: 'negative',
            message: 'Tu sesión ha expirado. Redirigiendo al login...',
            position: 'top'
          })
          LocalStorage.remove('token') // Borrar el token almacenado

          //Recargar para redirigir al login despues de una pequeña pausa
          setTimeout(() => window.location.reload(), 1500)
        }
      }

      return Promise.reject(error)
    }
  )
})

export { api }
