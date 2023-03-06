import { computed, defineComponent, reactive } from 'vue'
import PasswordInput from 'src/@app/shared/componentes/passwordInput/view/passwordInput.vue'
import { CambiarContrasena } from '../domain/CambiarContrasena.domain'
import { CambiarContrasenaController } from '../infraestructure/CambiarContrasena.controller'
import { useNotificacionStore } from 'stores/notificacion'
import { useQuasar } from 'quasar'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import useVuelidate from '@vuelidate/core'


export default defineComponent({
  components: { PasswordInput },
  setup() {
     /*********
     * Stores
     *********/
     useNotificacionStore().setQuasar(useQuasar())
       /***********
     * Mixin
     ************/
    const mixin = new ContenedorSimpleMixin(CambiarContrasena, new CambiarContrasenaController())
    const {
      entidad: cambiarContrasena,
      disabled,
    } = mixin.useReferencias()
    const { setValidador} =
      mixin.useComportamiento()
   /*************
     * Validaciones
     **************/
   const reglas = {
    current_password: {
      required: true,
      minLength: 3,
      maxLength: 50,
    },
    password: {
      required: true,
      minLength: 3,
      maxLength: 50,
    },
    password_confirmation: {
      required: true,
      minLength: 2,
      maxLength: 25,
    },
  }
  const v$ = useVuelidate(reglas, cambiarContrasena)
  setValidador(v$.value)

    const habilitarBoton = computed(
      () =>
        cambiarContrasena.current_password &&
        cambiarContrasena.password === cambiarContrasena.password_confirmation
    )
    return {mixin,
       cambiarContrasena,
        habilitarBoton,
        disabled,
        v$, }
  },
})
