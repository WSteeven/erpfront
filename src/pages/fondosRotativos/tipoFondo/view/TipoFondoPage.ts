import { defineComponent } from 'vue'
import { TipoFondo } from '../domain/TipoFondo'

import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import { useNotificacionStore } from 'stores/notificacion'
import { useQuasar } from 'quasar'
import { useVuelidate } from '@vuelidate/core'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { TipoFondoController } from '../infrestructure/TipoFonfoController'
import { configuracionColumnasTipoFondo } from '../domain/configuracionColumnasTipoFondo'

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
    const mixin = new ContenedorSimpleMixin(TipoFondo, new TipoFondoController())
    const { entidad: tipoFondo, disabled, accion } = mixin.useReferencias()
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
    const v$ = useVuelidate(reglas, tipoFondo)
    setValidador(v$.value)
    onGuardado(() => {
      //sucursal.value=''
    })
    onReestablecer(() => {
      //sucursal.value=''
    })

    return {
      mixin,
      tipoFondo,
      disabled, accion, v$,
      configuracionColumnas: configuracionColumnasTipoFondo,
    }
  }
})


