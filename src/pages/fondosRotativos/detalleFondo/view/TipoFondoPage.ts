import { defineComponent, reactive } from 'vue'
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
    const { onGuardado, onReestablecer } = mixin.useHooks()

    /*************
    * Validaciones
    **************/
    const reglas = {
      descripcion: {
        required: true,
        minLength: 3,
        maxLength: 50,
      },
      transcriptor: {
        required: true,
        minLength: 3,
        maxLength: 50,
      },
    }
    const v$ = useVuelidate(reglas, detalleFondo)
    setValidador(v$.value)
    onGuardado(() => {
      //sucursal.value=''
    })
    onReestablecer(() => {
      //sucursal.value=''
    })

    return {
      mixin,
      detalleFondo,
      disabled, accion, v$,
      configuracionColumnas: configuracionColumnasDetalleFondo,
    }
  }
})


