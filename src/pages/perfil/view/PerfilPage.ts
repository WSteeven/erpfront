// Dependencias
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { useAuthenticationStore } from 'stores/authentication'
import { useNotificaciones } from 'shared/notificaciones'
import { gestionarNotificacionError } from 'shared/utils'
import { ApiError } from 'shared/error/domain/ApiError'
import { defineComponent, reactive } from 'vue'
import { endpoints } from 'config/api'

// Logica y controladores
import { Perfil } from '../domain/Perfil'

export default defineComponent({
  setup() {
    const perfil = reactive(new Perfil())

    const notificaciones = useNotificaciones()

    const authenticationStore = useAuthenticationStore()
    perfil.hydrate(authenticationStore.user)

    async function actualizar() {
      try {
        const axios = AxiosHttpRepository.getInstance()
        const response: any = await axios.put(
          axios.getEndpoint(endpoints.perfil_usuario),
          perfil
        )
        notificaciones.notificarCorrecto('Perfil actualizado exitosamente!')
        authenticationStore.user = perfil
      } catch (e: any) {
        gestionarNotificacionError(new ApiError(e), notificaciones)
      }
    }

    return {
      perfil,
      actualizar,
    }
  },
})
