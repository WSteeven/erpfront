// Dependencias
import { computed, defineComponent, reactive, ref } from 'vue'

// Logica y controladores
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { UserLogin } from 'pages/sistema/authentication/login/domain/UserLogin'
import { LoginController } from '../infraestructure/LoginController'
import { useNotificaciones } from 'shared/notificaciones'
import { isAxiosError, notificarMensajesError } from 'shared/utils'
import { useRouter } from 'vue-router';


export default defineComponent({
  name: 'LoginPage',
  setup() {
    const loginUser = reactive(new UserLogin())

    const loginController = new LoginController()

    const notificaciones = useNotificaciones()
    const cargando = new StatusEssentialLoading()
    const Router = useRouter()

    const login = async () => {
      try {
        cargando.activar()
        await loginController.login(loginUser)

        notificaciones.notificarCorrecto('Bienvenido a JPCONSTRUCRED CIA. LTDA') //response.data.mensaje)

      } catch (error: any) {
        if (isAxiosError(error)) {
          const mensajes: string[] = error.erroresValidacion
          notificarMensajesError(mensajes, notificaciones)
        }
      } finally {
        cargando.desactivar()
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
      // loginJson,
      enableLoginButton,
      login,
      recuperarPassword
    }
  },
})
