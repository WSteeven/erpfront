// Dependencias
import { computed, defineComponent, reactive, ref } from 'vue'
// Componentes
import PasswordInput from 'components/passwordInput/view/PasswordInput.vue'
// Logica y controladores
import { UserLogin } from 'pages/sistema/authentication/login/domain/UserLogin'
import { LoginController } from '../infraestructure/login.controller'
import { Cargando } from 'components/cargando/application/cargando.application'

export default defineComponent({
  name: 'LoginPage',
  components: { PasswordInput },
  setup() {
    const loginUser = reactive(new UserLogin())
    loginUser.email = 'admin@admin.com'
    loginUser.password = 'password'

    // pending
    const rememberSession = ref(false)

    const loginController = new LoginController()

    // const notificaciones = new Notificaciones()
    const cargando = new Cargando()

    const login = async () => {
      try {
        cargando.activar()
        await loginController.login(loginUser)
        // notificaciones.notificarCorrecto('Bienvenido a Business!')
        console.log('Bienvenido')
      } catch (error: any) {
        console.log('No se pudo autenticar')
      } finally {
        cargando.desactivar()
      }
    }

    const enableLoginButton = computed(
      () => loginUser.email !== '' && loginUser.password !== ''
    )

    return {
      loginUser,
      rememberSession,
      // computed
      enableLoginButton,
      // functions
      login,
    }
  },
})
