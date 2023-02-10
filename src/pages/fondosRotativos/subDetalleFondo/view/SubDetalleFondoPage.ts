import { defineComponent, reactive } from 'vue'

import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import { useNotificacionStore } from 'stores/notificacion'
import { useQuasar } from 'quasar'
import { useVuelidate } from '@vuelidate/core'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { SubDetalleFondo } from '../domain/SubDetalleFondo'
import { SubDetalleFondoController } from '../infrestructure/SubDetalleFondoController'
import { configuracionColumnasSubDetalleFondo } from '../domain/configuracionColumnasSubDetalleFondo'



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
    const mixin = new ContenedorSimpleMixin(SubDetalleFondo, new SubDetalleFondoController())
    const { entidad: subDetalleFondo, disabled, accion } = mixin.useReferencias()
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
    const v$ = useVuelidate(reglas, subDetalleFondo)
    setValidador(v$.value)
    onGuardado(() => {
      //sucursal.value=''
    })
    onReestablecer(() => {
      //sucursal.value=''
    })

    return {
      mixin,
      subDetalleFondo,
      disabled, accion, v$,
      configuracionColumnas: configuracionColumnasSubDetalleFondo,
    }
  }
})


