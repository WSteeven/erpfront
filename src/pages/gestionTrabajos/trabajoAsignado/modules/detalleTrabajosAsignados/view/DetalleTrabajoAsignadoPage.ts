// Dependencias
import { configuracionColumnasArchivoTrabajo } from 'trabajos/modules/gestorArchivosTrabajos/domain/configuracionColumnasArchivoTrabajo'
import { tiposTareasTelconet, accionesTabla, rolesSistema, opcionesModoAsignacionTrabajo } from 'config/utils'
import { configuracionColumnasEmpleadoSeleccionable } from 'trabajos/domain/configuracionColumnasEmpleadoSeleccionable'
import { configuracionColumnasEmpleadoSeleccionado } from 'trabajos/domain/configuracionColumnasEmpleadoSeleccionado'
import { configuracionColumnasGrupoSeleccionado } from 'trabajos/domain/configuracionColumnasGrupoSeleccionado'
import { descargarArchivoUrl, quitarItemDeArray, stringToArray } from 'shared/utils'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { useTrabajoAsignadoStore } from 'stores/trabajoAsignado'
import { computed, defineComponent, reactive, ref } from 'vue'
import { useTareaStore } from 'stores/tarea'

// Componentes
import EssentialTable from 'components/tables/view/EssentialTable.vue'

// Logica y controladores
import { ArchivoTrabajoController } from 'trabajos/modules/gestorArchivosTrabajos/infraestructure/ArchivoTrabajoController'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { ClienteFinalController } from 'clientesFinales/infraestructure/ClienteFinalController'
import { GrupoSeleccionado } from 'trabajos/domain/GrupoSeleccionado'
import { EmpleadoController } from 'pages/recursosHumanos/empleados/infraestructure/EmpleadoController'
import { TipoTrabajoController } from 'tiposTrabajos/infraestructure/TipoTrabajoController'
import { CantonController } from 'sistema/ciudad/infraestructure/CantonControllerontroller'
import { ProvinciaController } from 'sistema/provincia/infraestructure/ProvinciaController'
//import { SubtareaController } from 'subtareas/infraestructure/SubtareaController'
import { GrupoController } from 'recursosHumanos/grupos/infraestructure/GrupoController'
import { ClienteFinal } from 'gestionTrabajos/clientesFinales/domain/ClienteFinal'
import { Empleado } from 'recursosHumanos/empleados/domain/Empleado'
//import { Subtarea } from 'tra/domain/Subtarea'

export default defineComponent({
  components: { EssentialTable },
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
    const { entidad: subtarea, listadosAuxiliares } = mixin.useReferencias()
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

    async function obtenerClienteFinal(clienteFinalId: number) {
      const clienteFinalController = new ClienteFinalController()
      const { result } = await clienteFinalController.consultar(clienteFinalId)
      clienteFinal.hydrate(result)
    }

    consultar(trabajoAsignadoStore.idSubtareaSeleccionada)

    /********
     * Hooks
     *********/
    onConsultado(() => {
      if (subtarea.cliente_final) {
        obtenerClienteFinal(subtarea.cliente_final)
      }

      if (subtarea.modo_asignacion_trabajo === opcionesModoAsignacionTrabajo.por_grupo) {
        subtarea.grupos_seleccionados.forEach((grupo: GrupoSeleccionado) => {
          console.log(grupo)
          if (grupo.id) obtenerTecnicosGrupo(grupo.id)
        })
      }
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
    async function obtenerTecnicosGrupo(grupo_id: number) {
      const empleadoController = new EmpleadoController()
      const { result } = await empleadoController.listar({ grupo_id: grupo_id })
      subtarea.empleados_seleccionados.push(...result)

      subtarea.empleados_seleccionados = subtarea.empleados_seleccionados.map((empleado: Empleado) => {
        const tecnico = new Empleado()
        tecnico.hydrate(empleado)

        const roles = stringToArray(tecnico.roles ?? '')
        tecnico.roles = quitarItemDeArray(roles, rolesSistema.empleado).join(',')

        return tecnico
      })
    }

    async function obtenerArchivos() {
      const { result } = await new ArchivoTrabajoController().listar({ subtarea: trabajoAsignadoStore.idSubtareaSeleccionada })
      archivos.value = result
    }

    obtenerArchivos()

    return {
      subtarea,
      tiposTareasTelconet,
      configuracionColumnasEmpleadoSeleccionable,
      configuracionColumnasGrupoSeleccionado,
      configuracionColumnasEmpleadoSeleccionado,
      columnasGestor: [...configuracionColumnasArchivoTrabajo, accionesTabla],
      tiposTrabajos,
      grupos,
      subtareas,
      clienteFinal,
      listadosAuxiliares,
      archivos,
      botonDescargar,
      clientesFinales,
      opcionesModoAsignacionTrabajo,
      nombresClienteFinal: computed(() => clienteFinal.nombres + ' ' + clienteFinal.apellidos)
    }
  }
})
