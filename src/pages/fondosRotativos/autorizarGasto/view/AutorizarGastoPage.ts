// Dependencias

import { useAuthenticationStore } from 'stores/authentication'
import { defineComponent, ref } from 'vue'
import {
  accionesTabla,
  tabAutorizarGasto,
  estadosGastos,
  acciones,
} from 'config/utils'

// Componentes
import ConfirmarDialog from 'gestionTrabajos/trabajoAsignado/view/ConfirmarDialog.vue'
import EssentialTableTabs from 'components/tables/view/EssentialTableTabs.vue'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { Gasto } from 'pages/fondosRotativos/gasto/domain/Gasto'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { configuracionColumnasAutorizarGasto } from '../domain/configuracionColumnasAutorizarGasto'
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { AutorizarGastoController } from '../infrestructure/AutorizarGastoController'
import ModalEntidad from 'components/modales/view/ModalEntidad.vue'
import { ComportamientoModalesAutorizarGasto } from '../application/ComportamientoModalesAutorizarGasto'
import { useFondoRotativoStore } from 'stores/fondo_rotativo'
import { useNotificacionStore } from 'stores/notificacion'
import { date, useQuasar } from 'quasar'
import { useCargandoStore } from 'stores/cargando'
import { GastoController } from 'pages/fondosRotativos/gasto/infrestructure/GastoController'
import { format, parse } from '@formkit/tempo'

export default defineComponent({
  name: 'AutorizarGastoPage',
  components: {
    EssentialTableTabs,
    ConfirmarDialog,
    ModalEntidad,
  },
  setup() {
    const controller = new AutorizarGastoController()
    const gastos_controller = new GastoController()
    const tabActual = ref()
    /***********
     * Mixin
     ************/
    const mixin = new ContenedorSimpleMixin(Gasto, controller)
    const mixin_gastos = new ContenedorSimpleMixin(Gasto, gastos_controller)
    const { listado, accion } = mixin.useReferencias()
    const { listar } = mixin.useComportamiento()
    const { consultar } = mixin_gastos.useComportamiento()

    /*********
     * Stores
     *********/

    useNotificacionStore().setQuasar(useQuasar())
    useCargandoStore().setQuasar(useQuasar())
    const authenticationStore = useAuthenticationStore()
    const fondoRotativoStore = useFondoRotativoStore()
    /***************
     * Botones tabla
     ***************/
    const autorizarGastoController = new AutorizarGastoController()
    async function filtrarAutorizacionesGasto(tabSeleccionado) {
      const cargando = new StatusEssentialLoading()

      cargando.activar()

      const { result } = await autorizarGastoController.listar({
        estado: tabSeleccionado,
      })
      listado.value = result
      tabActual.value = tabSeleccionado

      cargando.desactivar()
    }
    filtrarAutorizacionesGasto(estadosGastos.PENDIENTE)

    /**Modales */
    const modales = new ComportamientoModalesAutorizarGasto()
    const estaSemanAC = ref()
    const botonVerModalGasto: CustomActionTable = {
      titulo: 'Consultar',
      icono: 'bi-eye',
      color: 'indigo',
      accion: ({ entidad }) => {
        fondoRotativoStore.id_gasto = entidad.id

        fondoRotativoStore.estaSemanAC = estaEnSemanaActual(entidad.fecha_viat)

        fondoRotativoStore.existeFactura = !!entidad.factura
        fondoRotativoStore.habilitar_observacion_autorizador =
          authenticationStore.user.id === entidad.aut_especial &&
          (entidad.estado === estadosGastos.PENDIENTE ||
            entidad.estado === estadosGastos.APROBADO)
        fondoRotativoStore.accionForm =
          authenticationStore.user.id === entidad.aut_especial &&
          entidad.estado === estadosGastos.PENDIENTE
            ? acciones.editar
            : acciones.consultar
        fondoRotativoStore.empleado_id = entidad.id_usuario
        modales.abrirModalEntidad('VisualizarGastoPage')
      },
    }

    function estaEnSemanaActual(fecha) {
      // Create Date objects for current week's start and end (Sunday - Saturday)
      const today = new Date()
      const day = today.getDay() // Get current day of the week (0-6)
      const weekStart = new Date(today.setDate(today.getDate() - day))
      weekStart.setHours(0, 0, 0, 0) // Set start of day for Sunday
      const weekEnd = new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000)
      weekEnd.setHours(23, 59, 59, 999) // Set end of day for Saturday
      // Convert target date to Date object
      const fechaDate = parse(fecha, 'YYYY-MM-DD', 'America/Guayaquil')
     // Calculate difference in milliseconds between target date and week start
      const diferenciaMilisegundos = weekStart.getTime() - fechaDate.getTime()
      const diferenciaEnDias = Math.floor(
        diferenciaMilisegundos / (1000 * 60 * 60 * 24)
      )
      // Check if target date is within current week (inclusive)
      if (diferenciaEnDias <= 8 || authenticationStore.esAdministrador) {
        return true
      } else {
        return false
      }
    }


    async function guardado() {
      filtrarAutorizacionesGasto(estadosGastos.PENDIENTE)
    }

    return {
      configuracionColumnasAutorizarGasto,
      listado,
      estadosGastos,
      tabAutorizarGasto,
      botonVerModalGasto,
      accionesTabla,
      estaSemanAC,
      guardado,
      filtrarAutorizacionesGasto,
      authenticationStore,
      modales,
    }
  },
})
