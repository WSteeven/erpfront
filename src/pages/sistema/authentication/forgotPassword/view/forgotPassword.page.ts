// Dependencias
import { computed, defineComponent, reactive, ref, watchEffect } from 'vue'
import { Vue3Lottie } from 'vue3-lottie'
import 'vue3-lottie/dist/style.css'

// Logica y controladores
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { useNotificaciones } from 'shared/notificaciones'
import { ForgotPasswordController } from '../infraestructure/forgotPassword.controller'
import { ForgotPassword } from '../domain/ForgotPassword'
import { isAxiosError, notificarMensajesError, validarEmail } from 'shared/utils'
import { useConfiguracionGeneralStore } from 'stores/configuracion_general'
import { AxiosResponse } from 'axios'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'ForgotPassword',
  components: {
    LottiePlayer: Vue3Lottie
  },
  setup() {
    const router = useRouter()
    /*********
     * Stores
     *********/
    const configuracionGeneralStore = useConfiguracionGeneralStore()
    if (!configuracionGeneralStore.configuracion?.nombre_empresa)
      configuracionGeneralStore.consultarConfiguracion()

    const forgotPassword = reactive(new ForgotPassword())
    const enviando = ref(false)
    const mostrarTengoUnCodigo = ref(false)

    const forgotPasswordController = new ForgotPasswordController()
    const notificaciones = useNotificaciones()
    const cargando = new StatusEssentialLoading()

    const nombreEmpresa = computed(
      () => configuracionGeneralStore.configuracion?.nombre_empresa
    )

    const enviarCorreoRecuperacion = async () => {
      try {
        cargando.activar()
        const response: AxiosResponse =
          await forgotPasswordController.enviarCorreoRecuperacion(
            forgotPassword
          )
        if (response.status === 200) {
          notificaciones.notificarCorrecto(response.data.mensaje)
          enviando.value = true
        } else notificaciones.notificarError(response.data.mensaje)
      } catch (error: any) {
        if (isAxiosError(error)) {
          const mensajes: string[] = error.erroresValidacion
          await notificarMensajesError(mensajes, notificaciones)
        }
        enviando.value = false
      } finally {
        cargando.desactivar()
      }
    }
    const recuperacionCuenta = async () => {
      enviando.value = true
      try {
        cargando.activar()
        const response:AxiosResponse = await forgotPasswordController.recuperacionCuenta(forgotPassword)
        if(response.status===200){
        notificaciones.notificarCorrecto(response.data.mensaje)
          await router.replace('/login')
        }
      } catch (error: any) {
        if (isAxiosError(error)) {
          const mensajes: string[] = error.erroresValidacion
          await notificarMensajesError(mensajes, notificaciones)
        }
      } finally {
        cargando.desactivar()
        mostrarTengoUnCodigo.value = true
        enviando.value = false
      }
    }
    const enableLoginButton = computed(() => validarEmail(forgotPassword.email))
    const enableRecoveryPasswordButton = computed(
      () =>
        forgotPassword.password !== '' &&
        forgotPassword.password === forgotPassword.password_confirmation
    )

    watchEffect(() => (document.title = nombreEmpresa.value ?? ''))

    return {
      forgotPassword,
      isPwd: ref(true),
      isPwdconfirm: ref(true),
      logoClaro: computed(
        () => configuracionGeneralStore.configuracion?.logo_claro
      ),
      logoOscuro: computed(
        () => configuracionGeneralStore.configuracion?.logo_oscuro
      ),
      enviando,
      mostrarTengoUnCodigo,
      // computed
      enableLoginButton,
      enableRecoveryPasswordButton,
      // functions
      enviarCorreoRecuperacion,
      recuperacionCuenta,
      nombreEmpresa
    }
  }
})
