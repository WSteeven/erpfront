// Dependencias
import { computed, defineComponent, reactive, ref } from 'vue'
import loginJson from 'src/assets/lottie/login5.json'

// Componentes
import { Vue3Lottie } from 'vue3-lottie'
import 'vue3-lottie/dist/style.css'

// Logica y controladores
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { UserLogin } from 'pages/sistema/authentication/login/domain/UserLogin'
import { LoginController } from '../infraestructure/LoginController'
import { useNotificaciones } from 'shared/notificaciones'

export default defineComponent({
  name: 'LoginPage',
  components: {
    LottiePlayer: Vue3Lottie,
  },
  setup() {
    const loginUser = reactive(new UserLogin())
    loginUser.email = 'mjaramillo@jp.com'
    loginUser.password = 'password'

    const loginController = new LoginController()

    const notificaciones = useNotificaciones()
    const cargando = new StatusEssentialLoading()

    const login = async () => {
      try {
        cargando.activar()
        const response:any = await loginController.login(loginUser)
        
        notificaciones.notificarCorrecto(response.data.mensaje)
        
      } catch (error: any) {
        notificaciones.notificarError(error.response.data.mensaje)
      } finally {
        cargando.desactivar()
      }
    }

    
    const enableLoginButton = computed(
      () => loginUser.email !== '' && loginUser.password !== ''
    )

    return {
      isPwd: ref(true),
      loginUser,
      loginJson,
      // computed
      enableLoginButton,
      // functions
      login,
    }
  },
})