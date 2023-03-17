import { defineComponent, reactive } from 'vue'


import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import { useNotificacionStore } from 'stores/notificacion'
import { useQuasar } from 'quasar'
import { useVuelidate } from '@vuelidate/core'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { MotivoGasto } from '../domain/MotivoGasto'
import { MotivoGastoController } from '../infrestructure/MotivoGastoController'
import { configuracionColumnasMotivoGasto } from '../domain/configuracionColumnasMotivoGasto'



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
    const mixin = new ContenedorSimpleMixin(MotivoGasto, new MotivoGastoController())
    const { entidad: motivoGasto, disabled, accion } = mixin.useReferencias()
    const { setValidador } = mixin.useComportamiento()
    const { onGuardado, onReestablecer } = mixin.useHooks()

    /*************
    * Validaciones
    **************/
    const reglas = {
      nombre: {
        required: true,
        minLength: 3,
        maxLength: 50,
      },
    }
    const v$ = useVuelidate(reglas, motivoGasto)
    setValidador(v$.value)
    onGuardado(() => {
      //sucursal.value=''
    })
    onReestablecer(() => {
      //sucursal.value=''
    })

    return {
      mixin,
      motivoGasto,
      disabled, accion, v$,
      configuracionColumnas: configuracionColumnasMotivoGasto,
    }
  }
})


