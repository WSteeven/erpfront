// Dependencias
import { isAxiosError, notificarMensajesError } from 'shared/utils'
import {
  computed,
  defineComponent,
  onMounted,
  reactive,
  ref,
  watchEffect
} from 'vue'
import { useQuasar, LocalStorage } from 'quasar'

import { useRouter } from 'vue-router'

// Componentes

//Logica y controladores
import { useConfiguracionGeneralStore } from 'stores/configuracion_general'
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { useNotificaciones } from 'shared/notificaciones'
import { UserLogin } from 'sistema/authentication/login/domain/UserLogin'
import { LoginPostulanteController } from '../infraestructure/LoginPostulanteController'
import { apiConfig } from 'config/api'

export default defineComponent({
  name: 'LoginPostulante',

  setup() {
    const configuracionGeneralStore = useConfiguracionGeneralStore()
    if (!configuracionGeneralStore.configuracion?.nombre_empresa)
      configuracionGeneralStore.consultarConfiguracion()

    const nombreEmpresa = computed(
      () => configuracionGeneralStore.configuracion?.nombre_empresa
    )

    const loginUser = reactive(new UserLogin())

    const loginController = new LoginPostulanteController()

    const notificaciones = useNotificaciones()
    const cargando = new StatusEssentialLoading()
    const Router = useRouter()

    watchEffect(() => (document.title = nombreEmpresa.value ?? ''))
    const $q = useQuasar()
    onMounted(async () => {
      try {
        cargando.activar()
        const token = LocalStorage.getItem('token')
        if (token !== null) {
          await loginController.obtenerSesionUser()
        }
      } catch (error: any) {
        console.log('montar errror', error)

        if (isAxiosError(error)) {
          // const mensajes: string[] = error.erroresValidacion
          console.log('montar errror', error.mensaje)
          //notificarMensajesError(mensajes, notificaciones)
        }
      } finally {
        cargando.desactivar()
      }
    })
    const login = async () => {
      if (!$q.loading.isActive) {
        try {
          cargando.activar()
          await loginController.login(loginUser)

          notificaciones.notificarCorrecto(
            'Bienvenido a ' + nombreEmpresa.value
          )
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

    const registro = () => {
      Router.replace('/registro-postulante')
    }

    const loginTerceros = async driver => {
      if (!$q.loading.isActive) {
        try {
          cargando.activar()
          await loginController.loginterceros(driver)
          notificaciones.notificarCorrecto(
            'Bienvenido a ' + nombreEmpresa.value
          )
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

    const enableLoginButton = computed(
      () => loginUser.name !== '' && loginUser.password !== ''
    )
    // const url = `${apiConfig.URL_BASE}/api/auth/facebook`
    // console.log(url)

    function loginWithProvider(provider: string) {
      const apiUrl = `${apiConfig.URL_BASE}/api/auth/${provider}`
      console.log(apiUrl)
      window.location.href = apiUrl
    }

    return {
      isPwd: ref(true),
      loginUser,
      loginTerceros,
      registro,
      logoClaro: computed(
        () => configuracionGeneralStore.configuracion?.logo_claro
      ),
      logoOscuro: computed(
        () => configuracionGeneralStore.configuracion?.logo_oscuro
      ),
      enableLoginButton,
      login,
      recuperarPassword,
      nombreEmpresa,
      cargando,

      // funciones
      loginWithProvider
    }
  }
})
