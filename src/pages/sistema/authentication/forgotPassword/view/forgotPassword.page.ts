// Dependencias
import { computed, defineComponent, reactive, ref } from 'vue'
// Componentes
import { Notificaciones } from '@/app/shared/componentes/toastification/application/notificaciones'
// Logica y controladores
import { LoginUser } from '@sistema/authentication/login/domain/loginUser.domain'
import { ForgotPasswordController } from '../infraestructure/forgotPassword.controller'
import { isAxiosError, notificarMensajesError } from '@/app/shared/utils'

export default defineComponent({
  name: 'ForgotPassword',
  components: {},
  setup() {
    const loginUser = reactive(new LoginUser())
    const enviando = ref(false)

    const forgotPasswordController = new ForgotPasswordController()

    const notificaciones = new Notificaciones()
    const enviarCorreoRecuperacion = () => {
      enviando.value = true
      forgotPasswordController
        .enviarCorreoRecuperacion(loginUser)
        .then(() => {
          notificaciones.notificarCorrecto(
            'El correo de recuperación se ha enviado con éxito!'
          )
          loginUser.email = null
        })
        .catch((error) => {
          if (isAxiosError(error)) {
            const mensajes: string[] = error.erroresValidacion
            notificarMensajesError(mensajes)
          }
        })
        .finally(() => (enviando.value = false))
    }

    const enableLoginButton = computed(
      () => loginUser.email !== '' && loginUser.password !== ''
    )

    return {
      loginUser,
      enviando,
      // computed
      enableLoginButton,
      // functions
      enviarCorreoRecuperacion,
    }
  },
})
