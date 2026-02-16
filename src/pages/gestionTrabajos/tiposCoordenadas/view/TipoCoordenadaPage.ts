import { defineComponent } from 'vue'
import { TipoCoordenada } from '../domain/TipoCoordenada'
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import { useNotificacionStore } from 'stores/notificacion'
import { useQuasar } from 'quasar'
import { useVuelidate } from '@vuelidate/core'
import { required } from 'shared/i18n-validators'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { TipoCoordenadaController } from '../infraestructure/TipoCoordenadaController'
import { configuracionColumnasTiposCoordenadas } from '../domain/configuracionColumnasTiposCoordenadas'
import ErrorComponent from 'components/ErrorComponent.vue'

export default defineComponent({
  components: { TabLayout, ErrorComponent },
  setup() {
    /*********
     * Stores
     *********/
    useNotificacionStore().setQuasar(useQuasar())

    /***********
     * Mixin
     ************/
    const mixin = new ContenedorSimpleMixin(
      TipoCoordenada,
      new TipoCoordenadaController()
    )
    const {
      entidad: tipoCoordenada,
      disabled,
      accion,
    } = mixin.useReferencias()
    const { setValidador, cargarVista } =
      mixin.useComportamiento()

    cargarVista(() => {
      // No hay listados auxiliares requeridos
    })

    /*************
     * Validaciones
     **************/
    const reglas = {
      nombre: {
        required,
      },
    }

    const v$ = useVuelidate(reglas, tipoCoordenada)
    setValidador(v$.value)

    return {
      mixin,
      tipoCoordenada,
      disabled,
      accion,
      v$,
      configuracionColumnas: configuracionColumnasTiposCoordenadas,
    }
  },
})
