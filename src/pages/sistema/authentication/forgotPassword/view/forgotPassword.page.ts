// Dependencias
import { computed, defineComponent, reactive, ref, watchEffect } from 'vue'
import { Vue3Lottie } from 'vue3-lottie'
import 'vue3-lottie/dist/style.css'

// Logica y controladores
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { useNotificaciones } from 'shared/notificaciones'
import { ForgotPasswordController } from '../infraestructure/forgotPassword.controller'
import { ForgotPassword } from '../domain/ForgotPassword'
import { isAxiosError, notificarMensajesError } from 'shared/utils'
import { useConfiguracionGeneralStore } from 'stores/configuracion_general'

export default defineComponent({
  name: 'ForgotPassword',
  components: {
    LottiePlayer: Vue3Lottie,
  },
  setup() {
    /*********
     * Stores
     *********/
    const configuracionGeneralStore = useConfiguracionGeneralStore()
    if (!configuracionGeneralStore.configuracion?.nombre_empresa) configuracionGeneralStore.consultarConfiguracion()

    const forgotPassword = reactive(new ForgotPassword())
    const enviando = ref(false)

    const forgotPasswordController = new ForgotPasswordController()
    const notificaciones = useNotificaciones()
    const cargando = new StatusEssentialLoading()

    const nombreEmpresa = computed(() => configuracionGeneralStore.configuracion?.nombre_empresa)

    const enviarCorreoRecuperacion = async () => {
      enviando.value = true
      try {

        cargando.activar()
        await forgotPasswordController.enviarCorreoRecuperacion(forgotPassword)
        notificaciones.notificarAdvertencia('Porfavor revise su codigo de confirmacion en su  Correo Institucional')

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
    const recuperacionCuenta = async () => {
      enviando.value = true
      try {
        cargando.activar()
        await forgotPasswordController.recuperacionCuenta(forgotPassword)
        notificaciones.notificarAdvertencia('Porfavor revise su codigo de confirmacion en su  Correo Institucional')

      } catch (error: any) {
        if (isAxiosError(error)) {
          const mensajes: string[] = error.erroresValidacion
          notificarMensajesError(mensajes, notificaciones)
        }
      } finally {
        cargando.desactivar()
        enviando.value = false
      }
    }
    const enableLoginButton = computed(
      () =>
        forgotPassword.email !== ''
    )
    const enableRecoveryPasswordButton = computed(
      () =>
        forgotPassword.password !== '' &&
        forgotPassword.password === forgotPassword.password_confirmation
    )

    watchEffect(() => document.title = nombreEmpresa.value ?? '')

    return {
      forgotPassword,
      isPwd: ref(true),
      isPwdconfirm: ref(true),
      enviando,
      // computed
      enableLoginButton,
      enableRecoveryPasswordButton,
      // functions
      enviarCorreoRecuperacion,
      recuperacionCuenta,
      nombreEmpresa,
    }
  },
})
