// Dependencias
import { computed, defineComponent, reactive, ref } from 'vue'
import { Vue3Lottie } from 'vue3-lottie'
import 'vue3-lottie/dist/style.css'
// Logica y controladores
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { useNotificaciones } from 'shared/notificaciones'
import { ResetPassword } from '../domain/ResetPassword'
import { ResetPasswordController } from '../infraestructure/resetPassword.controller'
import { isAxiosError, notificarMensajesError } from 'shared/utils'
import { useAuthenticationStore } from 'stores/authentication'
import { useRouter } from 'vue-router'
import { useConfiguracionGeneralStore } from 'stores/configuracion_general'
import { useQuasar } from 'quasar'
import { useNotificacionStore } from 'stores/notificacion'
import { useCargandoStore } from 'stores/cargando'

export default defineComponent({
  name: 'ResetPassword',
  components: { LottiePlayer: Vue3Lottie },
  setup() {
    const resetPassword = reactive(new ResetPassword())
    const Router = useRouter()
    const enviando = ref(false)
    const store = useAuthenticationStore()
    const resetPasswordController = new ResetPasswordController()
    const notificaciones = useNotificaciones()
    const cargando = new StatusEssentialLoading()
    resetPassword.nombreUsuario = store.getNombreusuario()
    if (resetPassword.nombreUsuario === undefined) {
      Router.replace('/login')
    }
    useNotificacionStore().setQuasar(useQuasar())
    useCargandoStore().setQuasar(useQuasar())

    const configuracionGeneralStore = useConfiguracionGeneralStore()

    const reglasContrasena = computed(() => {
      const pwd = resetPassword.password ?? ''

      return {
        longitud: pwd.length >= 8,
        contieneNumero: /\d/.test(pwd),
        contieneLetra: /[a-zA-Z]/.test(pwd),
        contieneEspecial: /[@.\-/*]/.test(pwd)
        // diferenteContrasenaAnterior: pwd!== resetPassword.password_old && pwd!=='',
      }
    })

    // Función para resetear el formulario
    function resetFormulario() {
      resetPassword.password = ''
      resetPassword.password_confirmation = ''
    }

    async function resetearPassword() {
      enviando.value = true
      try {
        cargando.activar()

        const nuevaContrasena = resetPassword.password
        const contrasenaAnterior = resetPassword.password_old

        if (!contrasenaAnterior || !nuevaContrasena) {
          notificaciones.notificarError(
            'Debe llenar todos los campos de contraseña.'
          )
          return
        }

        // Reglas
        const regex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@.\-/*]).{8,}$/
        if (!regex.test(nuevaContrasena)) {
          notificaciones.notificarError(
            'La nueva contraseña debe tener al menos 8 caracteres, 1 número, 1 letra (mayúscula o minúscula) y 1 carácter especial (@.-/*).'
          )
          resetFormulario()
          return
        }

        // Verificar si la nueva contraseña es igual a la anterior
        if (nuevaContrasena === contrasenaAnterior) {
          notificaciones.notificarError(
            'La nueva contraseña no puede ser igual a la anterior.'
          )
          resetFormulario()
          return
        }

        // Llamar al controlador para actualizar la contraseña
        await resetPasswordController.actualizarContrasena(resetPassword)
        notificaciones.notificarCorrecto('Contraseña actualizada correctamente')
      } catch (error: any) {
        if (isAxiosError(error)) {
          const mensajes: string[] = error.erroresValidacion
          await notificarMensajesError(mensajes, notificaciones)
        }
      } finally {
        cargando.desactivar()
        enviando.value = false
      }
    }

    const enableLoginButton = computed(
      () =>
        resetPassword.password_old !== '' &&
        resetPassword.password !== '' &&
        resetPassword.password === resetPassword.password_confirmation
    )

    return {
      resetPassword,
      isPwd: ref(true),
      isPwdold: ref(true),
      isPwdConfirm: ref(true),
      enviando,
      // computed
      enableLoginButton,
      reglasContrasena,
      // functions
      resetearPassword,
      logoClaro: computed(
        () => configuracionGeneralStore.configuracion?.logo_claro
      ),
      logoOscuro: computed(
        () => configuracionGeneralStore.configuracion?.logo_oscuro
      )
    }
  }
})
