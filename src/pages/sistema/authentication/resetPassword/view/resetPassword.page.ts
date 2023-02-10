// Dependencias
import { computed, defineComponent, reactive, ref } from 'vue'
// Componentes
import { Notificaciones } from '@/app/shared/componentes/toastification/application/notificaciones'
import PasswordInput from 'src/@app/shared/componentes/passwordInput/view/passwordInput.vue'
// Logica y controladores
import { LoginUser } from '@sistema/authentication/login/domain/loginUser.domain'
import { ResetPasswordController } from '../infraestructure/resetPassword.controller'
import router from '@/router'
import { isAxiosError, notificarMensajesError } from '@/app/shared/utils'

export default defineComponent({
  name: 'ResetPassword',
  components: { PasswordInput },
  setup() {
    const loginUser = reactive(new LoginUser())
    const enviando = ref(false)

    const resetPasswordController = new ResetPasswordController()

    const notificaciones = new Notificaciones()
    const enviarCorreoRecuperacion = () => {
      enviando.value = true
      resetPasswordController
        .actualizarContrasena(loginUser)
        .then(() => {
          notificaciones.notificarCorrecto('Contraseña actualizada con éxito!')
          router.replace({ name: 'Login' })
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
      () =>
        loginUser.email !== '' &&
        loginUser.password !== '' &&
        loginUser.password === loginUser.password_confirmation
    )

    const query: any = router.currentRoute.value.query
    loginUser.token = query.token

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
