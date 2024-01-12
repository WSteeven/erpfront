import { defineComponent, ref } from 'vue'
import { Comision } from '../domain/Comision'

import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import { useNotificacionStore } from 'stores/notificacion'
import { useQuasar } from 'quasar'
import { useVuelidate } from '@vuelidate/core'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { ComisionController } from '../infrestructure/ComisionController'
import { configuracionColumnasComision } from '../domain/configuracionColumnasComision'
import { PlanesController } from 'pages/ventas-claro/planes/infrestructure/PlanesController'
import { formas_pago } from 'config/utils'


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
    const mixin = new ContenedorSimpleMixin(Comision, new ComisionController())
    const { entidad: comision, disabled, accion,listadosAuxiliares } = mixin.useReferencias()
    const { setValidador ,obtenerListados, cargarVista} = mixin.useComportamiento()

    /*************
    * Validaciones
    **************/
    const reglas = {
      plan: {
        required: true
      },
      forma_pago:{
        required: true
      },
      comision:{
        required: true
      }
    }
    const v$ = useVuelidate(reglas, comision)
    setValidador(v$.value)
    const planes= ref([]);
    cargarVista(async () => {
      await obtenerListados({
        planes: {
          controller: new PlanesController(),
          params: { campos: 'id,nombre' },
        },
      })
        planes.value = listadosAuxiliares.planes

    })
    function filtrarPlanes(val, update) {
      if (val === '') {
        update(() => {
          planes.value = listadosAuxiliares.planes
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        planes.value = listadosAuxiliares.planes.filter(
          (v) =>
            v.nombres.toLowerCase().indexOf(needle) > -1 ||
            v.apellidos.toLowerCase().indexOf(needle) > -1
        )
      })
    }
    return {
      mixin,
      comision,
      disabled, accion, v$,
      formas_pago,
      filtrarPlanes,
      configuracionColumnas: configuracionColumnasComision,
    }
  }
})


