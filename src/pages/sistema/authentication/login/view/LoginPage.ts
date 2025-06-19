// Dependencias
import { computed, defineComponent, reactive, ref, watchEffect } from 'vue'

// Logica y controladores
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { UserLogin } from 'pages/sistema/authentication/login/domain/UserLogin'
import { LoginController } from '../infraestructure/LoginController'
import { useNotificaciones } from 'shared/notificaciones'
import { isAxiosError, notificarMensajesError } from 'shared/utils'
import { useRouter } from 'vue-router';
import { useConfiguracionGeneralStore } from 'stores/configuracion_general'
/* import { useCargandoStore } from 'stores/cargando' */
import { useQuasar } from 'quasar'
import {useNotificacionStore} from 'stores/notificacion';
import {useCargandoStore} from 'stores/cargando';


export default defineComponent({
  name: 'LoginPage',
  setup() {
    const configuracionGeneralStore = useConfiguracionGeneralStore()
    if (!configuracionGeneralStore.configuracion?.nombre_empresa) configuracionGeneralStore.consultarConfiguracion()

    const nombreEmpresa = computed(() => configuracionGeneralStore.configuracion?.nombre_empresa)

    const loginUser = reactive(new UserLogin())

    const loginController = new LoginController()
    useNotificacionStore().setQuasar(useQuasar())
    useCargandoStore().setQuasar(useQuasar())
    const notificaciones = useNotificaciones()
    const cargando = new StatusEssentialLoading()
    const Router = useRouter()

    watchEffect(() => document.title = nombreEmpresa.value ?? '')
    const $q = useQuasar()

    const login = async () => {

      if (!$q.loading.isActive) {
        try {
          cargando.activar()
          await loginController.login(loginUser)

          notificaciones.notificarInformacion('Bienvenido a ' + nombreEmpresa.value)

        } catch (error: any) {
          if (isAxiosError(error)) {
            const mensajes: string[] = error.erroresValidacion
            await notificarMensajesError(mensajes, notificaciones)
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

    return {
      isPwd: ref(true),
      loginUser,
      logoClaro: computed(() => configuracionGeneralStore.configuracion?.logo_claro),
      logoOscuro: computed(() => configuracionGeneralStore.configuracion?.logo_oscuro),
      enableLoginButton,
      login,
      recuperarPassword,
      nombreEmpresa,
      cargando,
    }
  },
})
