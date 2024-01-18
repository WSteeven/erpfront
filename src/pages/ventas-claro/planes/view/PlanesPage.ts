import { defineComponent, ref } from 'vue'
import { Planes } from '../domain/Planes'

import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import { useNotificacionStore } from 'stores/notificacion'
import { useQuasar } from 'quasar'
import { useVuelidate } from '@vuelidate/core'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { PlanesController } from '../infrestructure/PlanesController'
import { configuracionColumnasPlanes } from '../domain/configuracionColumnasPlanes'


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
    const mixin = new ContenedorSimpleMixin(Planes, new PlanesController())
    const { entidad: planes, disabled, accion,listadosAuxiliares } = mixin.useReferencias()
    const { setValidador ,obtenerListados, cargarVista} = mixin.useComportamiento()


    /*************
    * Validaciones
    **************/
    const reglas = {
      nombre: {
        required: true
      },

    }
    const v$ = useVuelidate(reglas, planes)
    setValidador(v$.value)

    return {
      mixin,
      planes,
      disabled, accion, v$,
      configuracionColumnas: configuracionColumnasPlanes,
    }
  }
})


