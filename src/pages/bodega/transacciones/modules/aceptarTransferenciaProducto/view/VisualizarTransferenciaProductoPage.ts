// Dependencias
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { CustomActionPrompt } from 'components/tables/domain/CustomActionPrompt'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { useTransaccionEgresoStore } from 'stores/transaccionEgreso'
import { useAuthenticationStore } from 'stores/authentication'
import { acciones, tabGestionarEgresos } from 'config/utils'
import { useTransferenciaStore } from 'stores/transferencia'
import { useNotificacionStore } from 'stores/notificacion'
import { useNotificaciones } from 'shared/notificaciones'
import { useTransaccionStore } from 'stores/transaccion'
import { defineComponent, ref, UnwrapRef } from 'vue'
import { apiConfig, endpoints } from 'config/api'
import { usePedidoStore } from 'stores/pedido'
import { iconos } from 'config/iconos'
import { useRoute } from 'vue-router'
import { useQuasar } from 'quasar'

// Componentes
import EssentialSelectableTable from 'components/tables/view/EssentialSelectableTable.vue'
import SimpleLayout from 'shared/contenedor/modules/simple/view/SimpleLayout.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import CalloutComponent from 'components/CalloutComponent.vue'
import { configuracionColumnasProductosRecibidos } from '../domain/configuracionColumnasProductosRecibidos'
import { configuracionColumnasProductosRecibidosParcial } from '../domain/configuracionColumnasProductosRecibidosParcial'
import { estadosTransferenciasProductos } from 'config/tareas.utils'

export default defineComponent({
  components: { SimpleLayout, EssentialTable, EssentialSelectableTable, CalloutComponent },
  props: {
    datos: Object as () => UnwrapRef<{ mixin }>,
  },
  setup(props, { emit }) {
    /**********
     * Stores
     **********/
    useNotificacionStore().setQuasar(useQuasar())
    const store = useAuthenticationStore()
    const transaccionStore = useTransaccionStore()
    const transaccionEgresoStore = useTransaccionEgresoStore()
    const pedidoStore = usePedidoStore()
    const transferenciaStore = useTransferenciaStore()

    /*********
     * Mixin
     *********/
    const { entidad: transferencia } = props.datos?.mixin.useReferencias()
    const { consultar, editarParcial } = props.datos?.mixin.useComportamiento()
    const { onConsultado, onBeforeModificar } = props.datos?.mixin.useHooks()

    /*************
     * Variables
     *************/
    const { notificarError, notificarCorrecto, confirmar, prompt } = useNotificaciones()
    const esBodeguero = store.esBodeguero
    const esCoordinador = store.esCoordinador
    const rolSeleccionado = (store.user.roles.filter((v) => v.indexOf('BODEGA') > -1 || v.indexOf('COORDINADOR') > -1)).length > 0 ? true : false

    let esVisibleAutorizacion = ref(false)

    let esVisibleTarea = ref(false)
    let requiereFecha = ref(false) //para mostrar u ocultar fecha limite
    const route = useRoute()

    /*************
     * Funciones
     *************/
    function aprobarTransferencia() {
      const data: CustomActionPrompt = {
        titulo: 'Aprobar y firmar',
        mensaje: 'Novedades al recibir los productos.',
        accion: async (novedades) => {
          try {
            confirmar('Esta acción completará la transferencia. ¿Desea continuar?', async () => {
              const datos = {
                autorizacion_id: 2,
                novedades_transferencia_recibida: novedades,
                listado_productos: transferencia.listado_productos.filter((item) => item.recibido)
              }
              await editarParcial(transferencia.id, datos)
              notificarCorrecto('Transferencia aprobada y firmada correctamente.')
              emit('cerrar-modal', false)
              emit('guardado', 'aceptado')
            })
          } catch (e) {
            notificarError('No se pudo aprobar ni firmar la transferencia.')
          }
        },
      }
      prompt(data)

    }

    function permitirModificarCantidades() {
      transferencia.modificar_recepcion = !transferencia.modificar_recepcion
      transferencia.listado_productos.forEach((item) => item.recibido = item.cantidad)
    }

    /*******************************************************************************************
     * Botones de tabla
     ******************************************************************************************/
    const btnEditarCantidad: CustomActionTable = {
      titulo: 'Cantidad',
      icono: iconos.editar,
      accion: ({ entidad, posicion }) => {
        const config: CustomActionPrompt = {
          titulo: 'Confirmación',
          mensaje: 'Ingresa la cantidad',
          defecto: transferencia.listado_productos[posicion].recibido,
          tipo: 'number',
          validacion: (val) => !!val && val >= 0 && val <= entidad.cantidad,
          accion: (data) => transferencia.listado_productos[posicion].recibido = data
        }

        prompt(config)
      },
    }

    const btnLlego: CustomActionTable = {
      titulo: ({ entidad }) => entidad.recibido === 0 ? 'Sí se recibió' : 'No se recibió',
      icono: ({ entidad }) => entidad.recibido === 0 ? 'bi-check' : iconos.cancelar,
      color: ({ entidad }) => entidad.recibido === 0 ? 'positive' : 'negative',
      accion: ({ entidad }) => entidad.recibido = entidad.recibido === 0 ? entidad.cantidad : 0
    }

    /********
     * Hooks
     ********/
    onConsultado(() => {
      if (transferencia.autorizacion == estadosTransferenciasProductos.VALIDADO) transferencia.listado_productos.forEach((item) => item.recibido = item.cantidad)
    })

    /*******
     * Init
     *******/
    consultar(transferencia)

    return {
      mixin: props.datos?.mixin,
      transferencia,
      acciones,
      pedidoStore,
      transferenciaStore,
      esVisibleAutorizacion,
      esVisibleTarea,
      requiereFecha,
      configuracionColumnasProductosRecibidos,
      configuracionColumnasProductosRecibidosParcial,
      //rol
      rolSeleccionado,
      esBodeguero,
      esCoordinador,
      permitirModificarCantidades,
      aprobarTransferencia,
      tabGestionarEgresos,
      //rutas
      route,
      //botones de tabla
      btnEditarCantidad,
      btnLlego,
      iconos,
    }
  }
})
