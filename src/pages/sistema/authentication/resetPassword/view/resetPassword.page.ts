// Dependencias
import { computed, defineComponent, reactive, ref } from 'vue'
import { Vue3Lottie } from 'vue3-lottie'
import 'vue3-lottie/dist/style.css'
// Logica y controladores
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { useNotificaciones } from 'shared/notificaciones'
import { ResetPassword} from '../domain/ResetPassword'
import { ResetPasswordController } from '../infraestructure/resetPassword.controller'
import { isAxiosError, notificarMensajesError } from 'shared/utils'
import { useAuthenticationStore } from 'stores/authentication'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'ResetPassword',
  components: {  LottiePlayer: Vue3Lottie },
  setup() {
    const resetPassword = reactive(new ResetPassword())
    const Router = useRouter()
    const enviando = ref(false)
    const store = useAuthenticationStore();
    const resetPasswordController = new ResetPasswordController()
    const notificaciones = useNotificaciones()
    const cargando = new StatusEssentialLoading()
    resetPassword.nombreUsuario = store.getNombreusuario();
    if (resetPassword.nombreUsuario === undefined) {
      Router.replace('/login')
    }
    async function resetearPassword() {
      enviando.value = true
      try {

        cargando.activar()
        await resetPasswordController.actualizarContrasena(resetPassword)
        notificaciones.notificarCorrecto('Contraseña actualizada correctamente')

      } catch (error: any) {
        if (isAxiosError(error)) {
          const mensajes: string[] = error.erroresValidacion
          notificarMensajesError(mensajes, notificaciones)
        }
      } finally {
        cargando.desactivar()
        enviando.value = true
      }
    }

    const enableLoginButton = computed(
      () =>
      resetPassword.password_old !== '' &&
      resetPassword.password !== '' &&
      resetPassword.password === resetPassword.password_confirmation
    )



    return {
      resetPassword,
      isPwd: ref(true),
      enviando,
      // computed
      enableLoginButton,
      // functions
      resetearPassword,
    }
  },
})
