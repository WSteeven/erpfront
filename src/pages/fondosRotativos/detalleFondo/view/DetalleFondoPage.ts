import { defineComponent } from 'vue'
import { DetalleFondo } from '../domain/DetalleFondo'

import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import { useNotificacionStore } from 'stores/notificacion'
import { useQuasar } from 'quasar'
import { useVuelidate } from '@vuelidate/core'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { DetalleFondoController } from '../infrestructure/DetalleFondoController'
import { configuracionColumnasDetalleFondo } from '../domain/configuracionColumnasDetalleFondo'


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
    const mixin = new ContenedorSimpleMixin(DetalleFondo, new DetalleFondoController())
    const { entidad: detalleFondo, disabled, accion } = mixin.useReferencias()
    const { setValidador } = mixin.useComportamiento()

    /*************
    * Validaciones
    **************/
    const reglas = {
      descripcion: {
        required: true,
        minLength: 3,
        maxLength: 50,
      },
      autorizacion: {
        required: true,
        minLength: 3,
        maxLength: 50,
      },
      estatus: {
        required: true,
        minLength: 3,
        maxLength: 50,
      },
    }
    const v$ = useVuelidate(reglas, detalleFondo)
    setValidador(v$.value)
    return {
      mixin,
      detalleFondo,
      disabled, accion, v$,
      configuracionColumnas: configuracionColumnasDetalleFondo,
    }
  }
})


