import { defineComponent, ref } from 'vue'
import { ProductoVentas } from '../domain/ProductoVentas'

import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import { useNotificacionStore } from 'stores/notificacion'
import { useQuasar } from 'quasar'
import { useVuelidate } from '@vuelidate/core'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { ProductoVentasController } from '../infrestructure/ProductoVentasController'
import { configuracionColumnasProductoVentas } from '../domain/configuracionColumnasProductoVentas'
import { PlanesController } from 'pages/ventas-claro/planes/infrestructure/PlanesController'


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
    const mixin = new ContenedorSimpleMixin(ProductoVentas, new ProductoVentasController())
    const { entidad: producto_ventas, disabled, accion,listadosAuxiliares } = mixin.useReferencias()
    const { setValidador ,obtenerListados, cargarVista} = mixin.useComportamiento()
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
    /*************
    * Validaciones
    **************/
    const reglas = {
      plan: {
        required: true
      },
      bundle: {
        required: true,
      },
      precio: {
        required: true,
      },
    }
    const v$ = useVuelidate(reglas, producto_ventas)
    setValidador(v$.value)
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
      producto_ventas,
      filtrarPlanes,
      planes,
      disabled, accion, v$,
      configuracionColumnas: configuracionColumnasProductoVentas,
    }
  }
})


