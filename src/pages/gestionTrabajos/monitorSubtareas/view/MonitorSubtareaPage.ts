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
import { defineComponent } from 'vue'

// Componentes
import EssentialTableTabs from 'components/tables/view/EssentialTableTabs.vue'
import ModalesEntidad from 'components/modales/view/ModalEntidad.vue'

export default defineComponent({
  components: {
    EssentialTableTabs,
    ModalesEntidad,
  },
  setup() {
    /* *******
    * Stores
    *********/
    // const tareaStore = useTareaStore()
    const subtareaStore = useSubtareaStore()
    // const authenticationStore = useAuthenticationStore()

    /********
     * Mixin
     ********/
    const mixin = new ContenedorSimpleMixin(Subtarea, new SubtareaController())
    const { listado } = mixin.useReferencias()
    const { listar } = mixin.useComportamiento()

    /**********
   * Modales
   **********/
    const modalesSubtarea = new ComportamientoModalesSubtarea()

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

    const { botonFormulario, botonReagendar, botonCancelar, botonFinalizar } = useBotonesTablaSubtarea(listado, modalesSubtarea)

    function filtrarSubtareas(estado: string) {
      console.log(estado)
      listar({ estado: estado })
    }

    filtrarSubtareas(estadosTrabajos.AGENDADO)

    return {
      mixin,
      columnasSubtareas: [...configuracionColumnasSubtarea, accionesTabla],
      listado,
      tabOptionsEstadosSubtareasMonitor,
      btnConsultarSubtarea,
      modalesSubtarea,
      botonFormulario,
      botonReagendar,
      botonCancelar,
      botonFinalizar,
      filtrarSubtareas,
    }
  }
})
