import { defineComponent, ref } from 'vue'

import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import { useNotificacionStore } from 'stores/notificacion'
import { useQuasar } from 'quasar'
import { useVuelidate } from '@vuelidate/core'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { PlanesController } from 'pages/ventas-claro/planes/infrestructure/PlanesController'
import { formas_pago, tipos_vendedor } from 'config/utils'
import { EscenarioVentaJP } from '../domain/EscenarioVentaJP'
import { EscenarioVentaJPController } from '../infrestructure/EscenarioVentaJPController'
import { configuracionColumnasEscenarioVentaJP } from '../domain/configuracionColumnasEscenarioVentaJP'

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
    const mixin = new ContenedorSimpleMixin(
      EscenarioVentaJP,
      new EscenarioVentaJPController()
    )
    const {
      entidad: escenario_venta_jp,
      disabled,
      accion,
      listadosAuxiliares,
    } = mixin.useReferencias()
    const { setValidador, obtenerListados, cargarVista } =
      mixin.useComportamiento()

    /*************
     * Validaciones
     **************/
    const reglas = {
      mes: {
        required: true,
      },
      vendedores: {
        required: true,
      },
      productividad_minima: {
        required: true,
      },
      vendedores_acumulados: {
        required: true,
      },
      total_ventas_adicionales: {
        required: true,
      },
      arpu_prom: {
        required: true,
      },
      altas: {
        required: true,
      },
      bajas: {
        required: true,
      },
      neta: {
        required: true,
      },
      stock: {
        required: true,
      },
      stock_que_factura: {
        required: true,
      },
    }
    const v$ = useVuelidate(reglas, escenario_venta_jp)
    setValidador(v$.value)
    const planes = ref([])
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
      escenario_venta_jp,
      tipos_vendedor,
      disabled,
      accion,
      v$,
      formas_pago,
      planes,
      filtrarPlanes,
      configuracionColumnas: configuracionColumnasEscenarioVentaJP,
    }
  },
})
