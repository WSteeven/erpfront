import { computed, defineComponent, reactive, ref } from 'vue'
import { CambiarContrasena } from '../domain/CambiarContrasena.domain'
import { CambiarContrasenaController } from '../infraestructure/CambiarContrasena.controller'
import { useNotificacionStore } from 'stores/notificacion'
import { useQuasar } from 'quasar'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import useVuelidate from '@vuelidate/core'
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'

export default defineComponent({
  components: { TabLayout },
  setup() {
    /*********
     * Stores
     *********/
    useNotificacionStore().setQuasar(useQuasar())
    /***********
     * Mixin
     ************/
    const mixin = new ContenedorSimpleMixin(
      CambiarContrasena,
      new CambiarContrasenaController()
    )
    const { entidad: cambiarContrasena, disabled } = mixin.useReferencias()
    const { setValidador } = mixin.useComportamiento()
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
    const onSubmit = () => {
      //mixin.onSubmit()
    }
    return {
      mixin,
      onSubmit,
      isPwdCurent: ref(true),
      isPwd: ref(true),
      isPwdConfirmation: ref(true),
      cambiarContrasena,
      habilitarBoton,
      disabled,
      v$,
    }
  },
})
