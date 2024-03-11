import { defineComponent, ref } from 'vue'
import { TipoChargeBack } from '../domain/TipoChargeBack'

import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import { useNotificacionStore } from 'stores/notificacion'
import { useQuasar } from 'quasar'
import { useVuelidate } from '@vuelidate/core'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { TipoChargeBackController } from '../infrestructure/TipoChargeBackController'
import { configuracionColumnasTipoChargeBack } from '../domain/configuracionColumnasTipoChargeBack'
import { maskFecha } from 'config/utils'

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
    const mixin = new ContenedorSimpleMixin(TipoChargeBack, new TipoChargeBackController())
    const {
      entidad: tipochargeback,
      disabled,
      accion,
      listadosAuxiliares,
    } = mixin.useReferencias()
    const { setValidador, obtenerListados, cargarVista } =
      mixin.useComportamiento()
    const precio_producto = ref(0)
    const comision_vendedor = ref(0)
    /*************
     * Validaciones
     **************/
    const reglas = {
      nombre: {
        required: true,
      },
    }
    const v$ = useVuelidate(reglas, tipochargeback)
    setValidador(v$.value)


    return {
      mixin,
      tipochargeback,
      disabled,
      accion,
      v$,
      configuracionColumnas: configuracionColumnasTipoChargeBack,

      maskFecha,
      precio_producto,
      comision_vendedor,
    }
  },
})
