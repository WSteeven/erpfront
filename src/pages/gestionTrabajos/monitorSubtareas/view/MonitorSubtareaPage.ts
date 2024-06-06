// Dependencias
import { configuracionColumnasSubtarea } from 'gestionTrabajos/subtareas/domain/configuracionColumnasSubtarea'
import { useBotonesTablaSubtarea } from 'pages/gestionTrabajos/subtareas/application/BotonesTablaSubtarea'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { Subtarea } from 'pages/gestionTrabajos/subtareas/domain/Subtarea'
import { tabOptionsEstadosSubtareasMonitor } from 'config/tareas.utils'
import { acciones, accionesTabla, estadosTrabajos } from 'config/utils'
import { computed, defineComponent, ref } from 'vue'
import { useSubtareaStore } from 'stores/subtarea'
import { useCargandoStore } from 'stores/cargando'
import { useQuasar } from 'quasar'

// Componentes
import EssentialTableTabs from 'components/tables/view/EssentialTableTabs.vue'
import ModalesEntidad from 'components/modales/view/ModalEntidad.vue'

// Logica y controladores
import { CausaIntervencionController } from 'pages/gestionTrabajos/causasIntervenciones/infraestructure/CausaIntervencionController'
import { MotivoSuspendidoController } from 'pages/gestionTrabajos/motivosSuspendidos/infraestructure/MotivoSuspendidoController'
import { ComportamientoModalesSubtarea } from 'pages/gestionTrabajos/subtareas/application/ComportamientoModalesSubtarea'
import { MotivoPausaController } from 'pages/gestionTrabajos/motivosPausas/infraestructure/MotivoPausaController'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { SubtareaController } from 'pages/gestionTrabajos/subtareas/infraestructure/SubtareaController'

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
    useCargandoStore().setQuasar(useQuasar())

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
        causasIntervenciones: new CausaIntervencionController(),
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
      const campos = 'id,codigo_tarea,codigo_subtarea,titulo,estado,grupo,empleado_responsable,empleado_responsable_id,coordinador,tipo_trabajo,cantidad_adjuntos,fecha_solicitud,es_ventana,fecha_hora_creacion,fecha_inicio_trabajo,hora_inicio_trabajo,hora_fin_trabajo,fecha_hora_asignacion,fecha_hora_agendado,fecha_hora_ejecucion,fecha_hora_realizado,fecha_hora_finalizacion,dias_ocupados,fecha_hora_suspendido,motivo_suspendido,fecha_hora_cancelado,motivo_cancelado,subtarea_dependiente,canton,cliente,cliente_id,proyecto,proyecto_id,puede_ejecutar,puede_suspender,es_responsable,tarea_id'
      listar({ estado: estado, campos })
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
