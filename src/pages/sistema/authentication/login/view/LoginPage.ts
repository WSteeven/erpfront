// Dependencias
import { computed, defineComponent, reactive, ref } from 'vue'

// Logica y controladores
import { UserLogin } from 'pages/sistema/authentication/login/domain/UserLogin'
import { LoginController } from '../infraestructure/LoginController'
import { Cargando } from 'components/cargando/application/cargando.application'
import { useNotificaciones } from 'src/pages/shared/notificaciones'

export default defineComponent({
  name: 'LoginPage',
  setup() {
    const loginUser = reactive(new UserLogin())
    loginUser.email = 'admin@admin.com'
    loginUser.password = 'password'

    const loginController = new LoginController()

    const notificaciones = useNotificaciones()
    const cargando = new Cargando()

    const login = async () => {
      try {
        cargando.activar()
        await loginController.login(loginUser)
        notificaciones.notificarCorrecto('Bienvenido!')
      } catch (error: any) {
        notificaciones.notificarError('No se pudo autenticar')
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
      // computed
      enableLoginButton,
      // functions
      login,
    }
  },
})
