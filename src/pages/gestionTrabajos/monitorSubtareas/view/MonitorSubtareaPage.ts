import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { tabOptionsEstadosSubtareasMonitor } from 'config/tareas.utils'
import { acciones, accionesTabla, estadosTrabajos } from 'config/utils'
import { configuracionColumnasSubtarea } from 'gestionTrabajos/subtareas/domain/configuracionColumnasSubtarea'
import { useBotonesTablaSubtarea } from 'pages/gestionTrabajos/subtareas/application/BotonesTablaSubtarea'
import { ComportamientoModalesSubtarea } from 'pages/gestionTrabajos/subtareas/application/ComportamientoModalesSubtarea'
import { Subtarea } from 'pages/gestionTrabajos/subtareas/domain/Subtarea'
import { SubtareaController } from 'pages/gestionTrabajos/subtareas/infraestructure/SubtareaController'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { useSubtareaStore } from 'stores/subtarea'
import { computed, defineComponent, ref } from 'vue'

// Componentes
import EssentialTableTabs from 'components/tables/view/EssentialTableTabs.vue'
import ModalesEntidad from 'components/modales/view/ModalEntidad.vue'
import { MotivoSuspendidoController } from 'pages/gestionTrabajos/motivosSuspendidos/infraestructure/MotivoSuspendidoController'
import { MotivoPausaController } from 'pages/gestionTrabajos/motivosPausas/infraestructure/MotivoPausaController'

export default defineComponent({
  components: {
    EssentialTableTabs,
    ModalesEntidad,
  },
  setup() {
    /* *******
    * Stores
    *********/
    const subtareaStore = useSubtareaStore()

    /********
     * Mixin
     ********/
    const mixin = new ContenedorSimpleMixin(Subtarea, new SubtareaController())
    const { listado, listadosAuxiliares } = mixin.useReferencias()
    const { filtrar, listar, cargarVista, obtenerListados } = mixin.useComportamiento()

    cargarVista(async () => {
      await obtenerListados({
        motivosSuspendidos: new MotivoSuspendidoController(),
        motivosPausas: new MotivoPausaController(),
      })
    })

    /**********
    * Modales
    **********/
    const modalesSubtarea = new ComportamientoModalesSubtarea()
    const { btnIniciar, btnPausar, btnReanudar, btnSeguimiento, btnReagendar, btnRealizar, btnSuspender, btnCancelar, btnFinalizar, setFiltrarTrabajoAsignado } = useBotonesTablaSubtarea(listado, modalesSubtarea, listadosAuxiliares)
    setFiltrarTrabajoAsignado(filtrarSubtareas)

    /************
     * Variables
     ************/
    const tabActual = ref()
    const altoFijo = computed(() => !listado.value.length)

    /****************
     * Botones tabla
     ****************/
    const btnConsultarSubtarea: CustomActionTable = {
      titulo: 'Más detalles',
      icono: 'bi-eye',
      accion: ({ entidad }) => {
        // subtareaStore.codigoTarea = tarea.codigo_tarea
        subtareaStore.idSubtareaSeleccionada = entidad.id
        subtareaStore.accion = acciones.consultar
        modalesSubtarea.abrirModalEntidad('SubtareaPage')
      },
    }


    function filtrarSubtareas(estado: string) {
      console.log(estado)
      listar({ estado: estado })
      tabActual.value = estado
    }

    filtrarSubtareas(estadosTrabajos.AGENDADO)

    function aplicarFiltro(uri) {
      filtrar(uri)
    }

    return {
      mixin,
      tabActual,
      columnasSubtareas: [...configuracionColumnasSubtarea, accionesTabla],
      listado,
      tabOptionsEstadosSubtareasMonitor,
      btnConsultarSubtarea,
      btnIniciar,
      btnPausar,
      btnReanudar,
      btnRealizar,
      modalesSubtarea,
      btnSeguimiento,
      btnReagendar,
      btnSuspender,
      btnCancelar,
      btnFinalizar,
      filtrarSubtareas,
      filtrar,
      aplicarFiltro,
      altoFijo,
    }
  }
})
