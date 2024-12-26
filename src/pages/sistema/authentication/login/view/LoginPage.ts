// Dependencias
import { computed, defineComponent, reactive, ref } from 'vue'

// Logica y controladores
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { UserLogin } from 'pages/sistema/authentication/login/domain/UserLogin'
import { LoginController } from '../infraestructure/LoginController'
import { useNotificaciones } from 'shared/notificaciones'
import { isAxiosError, notificarMensajesError } from 'shared/utils'
import { useRouter } from 'vue-router'
import { useConfiguracionGeneralStore } from 'stores/configuracion_general'
import { useQuasar } from 'quasar'

export default defineComponent({
  name: 'LoginPage',
  setup() {
    const configuracionGeneralStore = useConfiguracionGeneralStore()
    if (!configuracionGeneralStore.configuracion?.nombre_empresa)
      configuracionGeneralStore.consultarConfiguracion()

    const nombreEmpresa = computed(
      () => configuracionGeneralStore.configuracion?.nombre_empresa
    )

    const loginUser = reactive(new UserLogin())

    const loginController = new LoginController()

    const notificaciones = useNotificaciones()
    const cargando = new StatusEssentialLoading()
    const Router = useRouter()

    const isPwd = ref(true)

    const $q = useQuasar()

    const login = async () => {
      if (!$q.loading.isActive) {
        try {
          cargando.activar()
          await loginController.login(loginUser)

          notificaciones.notificarInformacion(
            'Bienvenido a ' + nombreEmpresa.value
          )
        } catch (error: any) {
          if (isAxiosError(error)) {
            const mensajes: string[] = error.erroresValidacion
            notificarMensajesError(mensajes, notificaciones)
          }
        } finally {
          cargando.desactivar()
        }
      }
    }

    const recuperarPassword = () => {
      Router.replace('/recuperar-contrasena')
    }

    const enableLoginButton = computed(
      () => loginUser.name !== '' && loginUser.password !== ''
    )

    const togglePasswordVisibility = () => {
      isPwd.value = !isPwd.value
    }

    return {
      isPwd,
      loginUser,
      enableLoginButton,
      login,
      recuperarPassword,
      nombreEmpresa,
      togglePasswordVisibility,
      logoClaro: computed(
        () => configuracionGeneralStore.configuracion?.logo_claro
      ),
      logoOscuro: computed(
        () => configuracionGeneralStore.configuracion?.logo_oscuro
      )
    }
  }
})
