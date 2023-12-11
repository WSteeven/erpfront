// Dependencias
import { configuracionColumnasEmpleadoGrupo } from 'pages/gestionTrabajos/subtareas/domain/configuracionColumnasEmpleadoGrupo'
import { tiposTareasTelconet, accionesTabla } from 'config/utils'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { useTrabajoAsignadoStore } from 'stores/trabajoAsignado'
import { computed, defineComponent, reactive, ref } from 'vue'
import { descargarArchivoUrl } from 'shared/utils'
import { useTareaStore } from 'stores/tarea'

// Componentes
import EssentialTable from 'components/tables/view/EssentialTable.vue'

// Logica y controladores
import { TipoTrabajoController } from 'pages/gestionTrabajos/tiposTareas/infraestructure/TipoTrabajoController'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { ClienteFinalController } from 'clientesFinales/infraestructure/ClienteFinalController'
import { CantonController } from 'sistema/ciudad/infraestructure/CantonControllerontroller'
import { ProvinciaController } from 'sistema/provincia/infraestructure/ProvinciaController'
import { GrupoController } from 'recursosHumanos/grupos/infraestructure/GrupoController'
import { ClienteFinal } from 'gestionTrabajos/clientesFinales/domain/ClienteFinal'
import { modosAsignacionTrabajo } from 'config/tareas.utils'
import { SubtareaController } from 'pages/gestionTrabajos/subtareas/infraestructure/SubtareaController'
import { Subtarea } from 'pages/gestionTrabajos/subtareas/domain/Subtarea'
import { ArchivoSubtareaController } from 'pages/gestionTrabajos/subtareas/modules/gestorArchivosTrabajos/infraestructure/ArchivoSubtareaController'
import { configuracionColumnasArchivoSubtarea } from 'pages/gestionTrabajos/subtareas/modules/gestorArchivosTrabajos/domain/configuracionColumnasArchivoSubtarea'

export default defineComponent({
  components: { EssentialTable },
  props: {
    mixinModal: {
      type: Object as () => ContenedorSimpleMixin<Subtarea>,
      required: false,
    },
  },
  emits: ['cerrar-modal', 'guardado'],
  setup() {
    /*********
    * Stores
    *********/
    const store = useTareaStore()
    const trabajoAsignadoStore = useTrabajoAsignadoStore()

    /********
    * Mixin
    *********/
    const mixin = new ContenedorSimpleMixin(Subtarea, new SubtareaController())
    const { entidad: trabajo, listadosAuxiliares } = mixin.useReferencias()
    const { cargarVista, obtenerListados, consultar } = mixin.useComportamiento()
    const { onConsultado } = mixin.useHooks()

    cargarVista(async () => {
      await obtenerListados({
        tiposTrabajos: {
          controller: new TipoTrabajoController(),
          params: { cliente: store.tarea.cliente }
        },
        subtareas: {
          controller: new SubtareaController(),
          params: { tarea_id: store.tarea.id }
        },
        grupos: new GrupoController(),
        provincias: new ProvinciaController(),
        cantones: new CantonController(),
      })

      grupos.value = listadosAuxiliares.grupos
      // tiposTrabajos.value = listadosAuxiliares.tiposTrabajos
      subtareas.value = listadosAuxiliares.subtareas
      clientesFinales.value = listadosAuxiliares.clientesFinales
    })

    /************
    * Variables
    ************/
    const tiposTrabajos = ref([])
    const grupos = ref([])
    const subtareas = ref([])
    const clientesFinales = ref([])
    const clienteFinal = reactive(new ClienteFinal())
    const archivos = ref([])
    const empleadosDesignados = ref([])

    consultar({ id: trabajoAsignadoStore.idSubtareaSeleccionada })

    /********
     * Hooks
     *********/
    onConsultado(() => {
      if (trabajo.cliente_final) {
        obtenerClienteFinal(trabajo.cliente_final)
      }

      /* if (trabajo.modo_asignacion_trabajo === modosAsignacionTrabajo.por_grupo && trabajo.grupo) {
        obtenerTecnicosGrupo(trabajo.grupo)
      } */
    })

    /***************
    * Botones tabla
    ***************/
    const botonDescargar: CustomActionTable = {
      titulo: 'Descargar',
      icono: 'bi-download',
      color: 'positive',
      accion: ({ entidad }) => {
        descargarArchivoUrl(entidad.ruta)
      },
    }

    /************
    * Funciones
    *************/
    /* async function obtenerTecnicosGrupo(grupo_id: number) {
      const empleadoController = new EmpleadoController()

      const { result } = await empleadoController.listar({ grupo_id: grupo_id })
      empleadosDesignados.value = result
    } */

    async function obtenerClienteFinal(clienteFinalId: number) {
      const clienteFinalController = new ClienteFinalController()
      const { result } = await clienteFinalController.consultar(clienteFinalId)
      clienteFinal.hydrate(result)
    }

    async function obtenerArchivos() {
      const { result } = await new ArchivoSubtareaController().listar({ subtarea_id: trabajoAsignadoStore.idSubtareaSeleccionada })
      archivos.value = result
    }

    obtenerArchivos()

    return {
      trabajo,
      tiposTareasTelconet,
      configuracionColumnasEmpleadoGrupo,
      columnasGestor: [...configuracionColumnasArchivoSubtarea, accionesTabla],
      tiposTrabajos,
      grupos,
      subtareas,
      clienteFinal,
      listadosAuxiliares,
      archivos,
      botonDescargar,
      clientesFinales,
      modosAsignacionTrabajo,
      nombresClienteFinal: computed(() => clienteFinal.nombres + ' ' + clienteFinal.apellidos),
      empleadosDesignados,
      ats: computed(() => trabajo.codigo_subtarea?.replace('TR', 'ATS')),
    }
  }
})
