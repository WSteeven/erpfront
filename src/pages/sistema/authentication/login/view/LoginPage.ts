// Dependencias
import { computed, defineComponent, reactive, ref } from 'vue'
// import loginJson from 'src/assets/lottie/login7.json'

// Componentes
import { Vue3Lottie } from 'vue3-lottie'
import 'vue3-lottie/dist/style.css'

// Logica y controladores
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { UserLogin } from 'pages/sistema/authentication/login/domain/UserLogin'
import { LoginController } from '../infraestructure/LoginController'
import { useNotificaciones } from 'shared/notificaciones'
import { isAxiosError, notificarMensajesError } from 'shared/utils'

export default defineComponent({
  name: 'LoginPage',
  components: {
    LottiePlayer: Vue3Lottie,
  },
  setup() {
    const loginUser = reactive(new UserLogin())

    const loginController = new LoginController()

    const notificaciones = useNotificaciones()
    const cargando = new StatusEssentialLoading()

    const login = async () => {
      try {
        cargando.activar()
        console.log('logenado')
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


    const enableLoginButton = computed(
      () => loginUser.name !== '' && loginUser.password !== ''
    )

    return {
      isPwd: ref(true),
      loginUser,
      // loginJson,
      enableLoginButton,
      login,
    }
  },
})
