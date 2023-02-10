import { computed, defineComponent, reactive } from 'vue'
import PasswordInput from 'src/@app/shared/componentes/passwordInput/view/passwordInput.vue'
import { CambiarContrasena } from '../domain/CambiarContrasena.domain'
import { CambiarContrasenaController } from '../infraestructure/CambiarContrasena.controller'
import { ActualizarContrasena } from '../application/ActualizarContrasena.application'

export default defineComponent({
  components: { PasswordInput },
  setup() {
    const cambiarContrasena = reactive(new CambiarContrasena())
    const controller = new CambiarContrasenaController()

    const actualizarContrasena = () => {
      new ActualizarContrasena(cambiarContrasena, controller).execute()
    }

    const habilitarBoton = computed(
      () =>
        cambiarContrasena.current_password &&
        cambiarContrasena.password === cambiarContrasena.password_confirmation
    )
    return { cambiarContrasena, actualizarContrasena, habilitarBoton }
  },
})
