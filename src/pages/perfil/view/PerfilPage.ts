// Dependencias
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { gestionarNotificacionError } from 'shared/utils'
import { useAuthenticationStore } from 'stores/authentication'
import { ApiError } from 'shared/error/domain/ApiError'
import { useNotificaciones } from 'shared/notificaciones'
import { defineComponent, reactive } from 'vue'
import { endpoints } from 'config/api'

// Logica y controladores
import { Perfil } from '../domain/Perfil'

export default defineComponent({
  setup() {
    const perfil = reactive(new Perfil())
    const { notificarCorrecto } = useNotificaciones()

    const authenticationStore = useAuthenticationStore()
    perfil.hydrate(authenticationStore.user)

    async function actualizar() {
      try {
        const axios = AxiosHttpRepository.getInstance()
        const response: any = await axios.put(
          axios.getEndpoint(endpoints.perfil_usuario),
          perfil
        )
        notificarCorrecto('Perfil actualizado exitosamente!')
        authenticationStore.user = perfil
      } catch (e: any) {
        gestionarNotificacionError(new ApiError(e))
      }
    }

    return {
      perfil,
      actualizar,
    }
  },
})
