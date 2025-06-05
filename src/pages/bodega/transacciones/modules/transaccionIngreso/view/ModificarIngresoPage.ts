import EssentialTable from 'components/tables/view/EssentialTable.vue'
import { Transaccion } from 'pages/bodega/transacciones/domain/Transaccion'
import { useTransaccionStore } from 'stores/transaccion'
import { computed, defineComponent, reactive } from 'vue'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { configuracionColumnasProductosSeleccionados } from 'pages/bodega/transacciones/modules/transaccionIngreso/domain/configuracionColumnasProductosSeleccionados'
import { useAuthenticationStore } from 'stores/authentication'

export default defineComponent({
  components: { EssentialTable },
  setup() {
    const transaccionStore = useTransaccionStore()
    const transaccion = reactive(new Transaccion())
    const store = useAuthenticationStore()

    if (transaccionStore.transaccion) {
      transaccion.hydrate(transaccionStore.transaccion)
    }

    const botonEliminar: CustomActionTable = {
      titulo: 'Quitar',
      color: 'negative',
      icono: 'bi-x',
      accion: ({ entidad, posicion }) => {
        quitarElemento(entidad, posicion)
      },
      visible: () => store.esCoordinadorBodega
    }

    /**********************************
     * FUNCIONES
     **********************************/
    async function quitarElemento(entidad: any, posicion: number) {
      // se guarda luego de setear la cantidad
      const eliminado = await transaccionStore.quitarItemIngreso(entidad)
      if (eliminado) {
        transaccion.listadoProductosTransaccion.splice(posicion, 1)
        // emit('cerrar-modal', false)
      }
    }

    const configuracionColumnasProductosSeleccionadosAccion = computed(() => [
      ...configuracionColumnasProductosSeleccionados,
      {
        name: 'condiciones',
        field: 'condiciones',
        label: 'Estado del producto',
        align: 'left'
      },
      {
        name: 'cantidad',
        field: 'cantidad',
        label: 'Cantidad',
        align: 'left',
        type: 'number',
        sortable: false
      },
      {
        name: 'acciones',
        field: 'acciones',
        label: 'Acciones',
        align: 'center'
      }
    ])

    return {
      transaccion,
      configuracionColumnasProductosSeleccionadosAccion,

      //botones
      botonEliminar
    }
  }
})
