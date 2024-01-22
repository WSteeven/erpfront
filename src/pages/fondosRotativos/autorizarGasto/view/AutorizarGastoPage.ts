// Dependencias

import { useAuthenticationStore } from 'stores/authentication'
import { useNotificaciones } from 'shared/notificaciones'
import { computed, defineComponent, ref } from 'vue'
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
import { AprobarGastoController } from '../infrestructure/AprobarGastoController'
import ModalEntidad from 'components/modales/view/ModalEntidad.vue'
import { ComportamientoModalesAutorizarGasto } from '../application/ComportamientoModalesAutorizarGasto'
import { useFondoRotativoStore } from 'stores/fondo_rotativo'
import { useNotificacionStore } from 'stores/notificacion'
import { useQuasar } from 'quasar'
import { useCargandoStore } from 'stores/cargando'
import { GastoController } from 'pages/fondosRotativos/gasto/infrestructure/GastoController'
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
        fondoRotativoStore.existeFactura =
          entidad.factura == null ? false : true
        fondoRotativoStore.id_gasto = entidad.id
        fondoRotativoStore.estaSemanAC = estaEnSemanaActual(entidad.fecha_viat)
        fondoRotativoStore.existeFactura = entidad.tiene_factura
        fondoRotativoStore.accionForm =
          authenticationStore.user.id === entidad.aut_especial &&
            entidad.estado === estadosGastos.PENDIENTE
            ? acciones.editar
            : acciones.consultar
        modales.abrirModalEntidad('VisualizarGastoPage')
      },
    }

    function estaEnSemanaActual(fecha) {
      const fechaActual = new Date()
      const dia = String(fechaActual.getDate()).padStart(2, '0')
      const mes = String(fechaActual.getMonth() + 1).padStart(2, '0') // Los meses comienzan desde 0
      const anio = fechaActual.getFullYear()
      const fechaFormateada = `${dia}-${mes}-${anio}`
      const fechaInicio = convertir_fecha(fechaFormateada)
      const fechaFin = convertir_fecha(fecha)

      // Calcula la diferencia en días
      const diferenciaDias = fechaInicio.getDate() - fechaFin.getDate()
      if (diferenciaDias <= 8 || authenticationStore.esAdministrador) {
        return true
      } else {
        return false
      }
    }

    function convertir_fecha(fecha) {
      const dateParts = fecha.split('-') // Dividir el string en partes usando el guión como separador
      const dia = parseInt(dateParts[0], 10) // Obtener el día como entero
      const mes = parseInt(dateParts[1], 10) - 1 // Obtener el mes como entero (restar 1 porque en JavaScript los meses comienzan desde 0)
      const anio = parseInt(dateParts[2], 10)
      const fecha_convert = new Date(anio, mes, dia, 0)
      return fecha_convert
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
