import { computed, defineComponent, reactive, ref } from 'vue'
import { CambiarContrasena } from '../domain/CambiarContrasena.domain'
import { CambiarContrasenaController } from '../infraestructure/CambiarContrasena.controller'
import { useNotificacionStore } from 'stores/notificacion'
import { useNotificaciones } from 'shared/notificaciones'
import { useQuasar } from 'quasar'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import useVuelidate from '@vuelidate/core'
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import ButtonSubmits from 'components/buttonSubmits/buttonSubmits.vue'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { endpoints } from 'config/api'


export default defineComponent({
  components: { TabLayout, ButtonSubmits },
  setup() {
    /*********
     * Stores
     *********/
    useNotificacionStore().setQuasar(useQuasar())
    const notificaciones = useNotificaciones()
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

    async function cambiar() {
        const axios = AxiosHttpRepository.getInstance()
        const ruta = axios.getEndpoint(endpoints.cambiarContrasena)
         await axios.post(ruta, cambiarContrasena)
        .then(function (response:any) {
          notificaciones.notificarCorrecto(response.data.mensaje)
        })
        .catch((error) => {
          notificaciones.notificarError(error.response.data.errors.password[0])
        });
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
      cambiar,
    }
  },
})
