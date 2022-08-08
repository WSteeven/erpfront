// Dependencias
import { computed, defineComponent, reactive, ref } from 'vue'
// Componentes
import { Notificaciones } from '@/app/shared/componentes/toastification/application/notificaciones'
import PasswordInput from 'src/@app/shared/componentes/passwordInput/view/passwordInput.vue'
// Logica y controladores
import { RegisterController } from '../infraestructure/register.controller'
import { isAxiosError, notificarMensajesError } from '@/app/shared/utils'
import { RegisterUser } from '../domain/registerUser.domain'
import router from '@/router'

export default defineComponent({
  name: 'Register',
  components: { PasswordInput },
  setup() {
    const registerUser = reactive(new RegisterUser())

    const registerController = new RegisterController()
    const notificaciones = new Notificaciones()

    const enviando = ref(false)

    const enviarCorreoRecuperacion = () => {
      enviando.value = true
      registerController
        .registrarUsuario(registerUser)
        .then(() => {
          notificaciones.notificarCorrecto(
            'El usuario ha sido registrado con éxito!'
          )
          router.replace({ name: 'MisNegocios' })
        })
        .catch((error) => {
          if (isAxiosError(error)) {
            const mensajes: string[] = error.erroresValidacion
            notificarMensajesError(mensajes)
          }
        })
        .finally(() => (enviando.value = false))
    }

    const enableLoginButton = computed(
      () =>
        registerUser.name !== '' &&
        registerUser.lastname !== '' &&
        registerUser.email !== '' &&
        registerUser.password !== '' &&
        registerUser.password === registerUser.password_confirmation
    )

    return {
      registerUser,
      enviando,
      // computed
      enableLoginButton,
      // functions
      enviarCorreoRecuperacion,
    }
  },
})
