// Dependencias
import { configuracionColumnasArchivoTrabajo } from 'trabajos/modules/gestorArchivosTrabajos/domain/configuracionColumnasArchivoTrabajo'
import { configuracionColumnasEmpleadoGrupo } from 'pages/gestionTrabajos/trabajos/domain/configuracionColumnasEmpleadoGrupo'
import { configuracionColumnasEmpleadoSeleccionado } from 'trabajos/domain/configuracionColumnasEmpleadoSeleccionado'
import { configuracionColumnasGrupoSeleccionado } from 'trabajos/domain/configuracionColumnasGrupoSeleccionado'
import { tiposTareasTelconet, accionesTabla, opcionesModoAsignacionTrabajo } from 'config/utils'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { useTrabajoAsignadoStore } from 'stores/trabajoAsignado'
import { computed, defineComponent, reactive, ref } from 'vue'
import { descargarArchivoUrl } from 'shared/utils'
import { useTareaStore } from 'stores/tarea'

// Componentes
import EssentialTable from 'components/tables/view/EssentialTable.vue'

// Logica y controladores
import { ArchivoTrabajoController } from 'trabajos/modules/gestorArchivosTrabajos/infraestructure/ArchivoTrabajoController'
import { TipoTrabajoController } from 'pages/gestionTrabajos/tiposTareas/infraestructure/TipoTrabajoController'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { EmpleadoController } from 'pages/recursosHumanos/empleados/infraestructure/EmpleadoController'
import { TrabajoController } from 'pages/gestionTrabajos/trabajos/infraestructure/TrabajoController'
import { ClienteFinalController } from 'clientesFinales/infraestructure/ClienteFinalController'
import { CantonController } from 'sistema/ciudad/infraestructure/CantonControllerontroller'
import { ProvinciaController } from 'sistema/provincia/infraestructure/ProvinciaController'
import { GrupoController } from 'recursosHumanos/grupos/infraestructure/GrupoController'
import { ClienteFinal } from 'gestionTrabajos/clientesFinales/domain/ClienteFinal'
import { Trabajo } from 'pages/gestionTrabajos/trabajos/domain/Trabajo'
import { GrupoSeleccionado } from 'trabajos/domain/GrupoSeleccionado'

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
    const mixin = new ContenedorSimpleMixin(Trabajo, new TrabajoController())
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
          controller: new TrabajoController(),
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

    consultar({ id: trabajoAsignadoStore.idTrabajoSeleccionado })

    /********
     * Hooks
     *********/
    onConsultado(() => {
      if (trabajo.cliente_final) {
        obtenerClienteFinal(trabajo.cliente_final)
      }

      if (trabajo.modo_asignacion_trabajo === opcionesModoAsignacionTrabajo.por_grupo) {
        trabajo.grupos_seleccionados.forEach((grupo: GrupoSeleccionado) => {
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
      trabajo.empleados_seleccionados.push(...result)

      /* trabajo.empleados_seleccionados = trabajo.empleados_seleccionados.map((empleado: Empleado) => {
        const tecnico = new Empleado()
        tecnico.hydrate(empleado)

        const roles = stringToArray(tecnico.roles ?? '')
        tecnico.roles = quitarItemDeArray(roles, rolesSistema.empleado).join(',')

        return tecnico
      }) */
    }

    async function obtenerClienteFinal(clienteFinalId: number) {
      const clienteFinalController = new ClienteFinalController()
      const { result } = await clienteFinalController.consultar(clienteFinalId)
      clienteFinal.hydrate(result)
    }

    async function obtenerArchivos() {
      const { result } = await new ArchivoTrabajoController().listar({ trabajo_id: trabajoAsignadoStore.idTrabajoSeleccionado })
      archivos.value = result
    }

    obtenerArchivos()

    return {
      trabajo,
      tiposTareasTelconet,
      configuracionColumnasEmpleadoGrupo,
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
