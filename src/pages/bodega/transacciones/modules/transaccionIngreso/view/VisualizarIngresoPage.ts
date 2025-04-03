//Dependencias
import { configuracionColumnasTransaccionIngreso } from 'pages/bodega/transacciones/domain/configuracionColumnasTransaccionIngreso'
import { defineComponent } from 'vue'
import { configuracionColumnasProductosSeleccionados } from '../domain/configuracionColumnasProductosSeleccionados'
import { acciones } from 'config/utils'

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import EssentialSelectableTable from 'components/tables/view/EssentialSelectableTable.vue'

//Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { TransaccionIngresoController } from 'pages/bodega/transacciones/infraestructure/TransaccionIngresoController'
import { Transaccion } from 'pages/bodega/transacciones/domain/Transaccion'
import { useNotificacionStore } from 'stores/notificacion'
import { useQuasar } from 'quasar'

//Controladores
import { useAuthenticationStore } from 'stores/authentication'
import { useTransaccionStore } from 'stores/transaccion'
import { useTransferenciaStore } from 'stores/transferencia'

export default defineComponent({
  components: { TabLayout, EssentialTable, EssentialSelectableTable },
  emits: ['cerrar-modal'],
  setup() {
    const mixin = new ContenedorSimpleMixin(Transaccion, new TransaccionIngresoController())
    const { entidad: transaccion } = mixin.useReferencias()
    //stores
    useNotificacionStore().setQuasar(useQuasar())
    const store = useAuthenticationStore()
    const transaccionStore = useTransaccionStore()
    const transferenciaStore = useTransferenciaStore()
    if (transaccionStore.transaccion) {
      transaccion.hydrate(transaccionStore.transaccion)
    }

    const esBodeguero = store.esBodeguero
    const esCoordinador = store.esCoordinador
    const rolSeleccionado = (store.user.roles.filter((v) => v.indexOf('BODEGA') > -1 || v.indexOf('COORDINADOR') > -1)).length > 0

    // console.log('rol seleccionado: ', rolSeleccionado)



    const configuracionColumnasProductosSeleccionadosDespachado = [...configuracionColumnasProductosSeleccionados, {
      name: 'cantidad',
      field: 'cantidad',
      label: 'Cantidad',
      align: 'left',
      sortable: false,
    },
    ]



    return {
      mixin, transaccion,
      configuracionColumnas: configuracionColumnasTransaccionIngreso,
      acciones,

      //stores
      transferenciaStore,


      configuracionColumnasProductosSeleccionadosDespachado,

      //rol
      rolSeleccionado,
      esBodeguero,
      esCoordinador,

    }
  }
})
