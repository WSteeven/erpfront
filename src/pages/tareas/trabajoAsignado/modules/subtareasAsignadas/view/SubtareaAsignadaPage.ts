// Dependencias
import { configuracionColumnasArchivoSubtarea } from 'controlTareas/modules/subtareasListadoContent/modules/gestorArchivosSubtareas/domain/configuracionColumnasArchivoSubtarea'
import { configuracionColumnasEmpleado } from 'pages/tareas/controlTareas/modules/subtareas/domain/configuracionColumnasEmpleado'
import { descargarArchivoUrl, quitarItemDeArray, stringToArray } from 'shared/utils'
import { tiposTareasTelconet, accionesTabla, rolesSistema } from 'config/utils'
import { useTrabajoAsignadoStore } from 'stores/trabajoAsignado'
import { computed, defineComponent, reactive, ref } from "vue"
import { useTareaStore } from "stores/tarea"

// Componentes
import EssentialTable from 'components/tables/view/EssentialTable.vue'

// Logica y controladores
import { ArchivoSubtareaController } from 'pages/tareas/controlTareas/modules/subtareasListadoContent/modules/gestorArchivosSubtareas/infraestructure/ArchivoSubtareaController'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { ClienteFinalController } from 'pages/tareas/clientesFinales/infraestructure/ClienteFinalController'
import { TipoTrabajoController } from 'tiposTrabajos/infraestructure/TipoTrabajoController'
import { CantonController } from 'sistema/ciudad/infraestructure/CantonControllerontroller'
import { ProvinciaController } from 'sistema/provincia/infraestructure/ProvinciaController'
import { SubtareaController } from 'subtareas/infraestructure/SubtareaController'
import { GrupoController } from 'tareas/grupos/infraestructure/GrupoController'
import { ClienteFinal } from 'pages/tareas/clientesFinales/domain/ClienteFinal'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { Empleado } from 'pages/recursosHumanos/empleados/domain/Empleado'
import { Subtarea } from 'subtareas/domain/Subtarea'

export default defineComponent({
  components: { EssentialTable },
  setup() {
    const mixin = new ContenedorSimpleMixin(Subtarea, new SubtareaController())
    const { entidad: subtarea, listadosAuxiliares } = mixin.useReferencias()
    const { cargarVista, obtenerListados, consultar } = mixin.useComportamiento()
    const { onConsultado } = mixin.useHooks()

    const store = useTareaStore()

    const trabajoAsignadoStore = useTrabajoAsignadoStore()

    const tiposTrabajos = ref([])
    const grupos = ref([])
    const subtareas = ref([])
    const clientesFinales = ref([])

    const clienteFinal = reactive(new ClienteFinal())

    const archivos = ref([])
    async function obtenerArchivos() {
      const { result } = await new ArchivoSubtareaController().listar({ subtarea: trabajoAsignadoStore.idSubtareaSeleccionada })
      archivos.value = result
    }

    obtenerArchivos()

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
      tiposTrabajos.value = listadosAuxiliares.tiposTrabajos
      subtareas.value = listadosAuxiliares.subtareas
      clientesFinales.value = listadosAuxiliares.clientesFinales
    })

    async function obtenerClienteFinal(clienteFinalId: number) {
      const clienteFinalController = new ClienteFinalController()
      const { result } = await clienteFinalController.consultar(clienteFinalId)
      clienteFinal.hydrate(result)
    }

    consultar({ id: trabajoAsignadoStore.idSubtareaSeleccionada })

    onConsultado(() => {
      if (subtarea.cliente_final) {
        obtenerClienteFinal(subtarea.cliente_final)
      }

      subtarea.tecnicos_grupo_principal = subtarea.tecnicos_grupo_principal.map((empleado: Empleado) => {
        const tecnico = new Empleado()
        tecnico.hydrate(empleado)

        const roles = stringToArray(tecnico.roles ?? '')
        tecnico.roles = quitarItemDeArray(roles, rolesSistema.empleado).join(',')

        return tecnico
      })
    })

    const botonDescargar: CustomActionTable = {
      titulo: 'Descargar',
      icono: 'bi-download',
      color: 'positive',
      accion: ({ entidad }) => {
        descargarArchivoUrl(entidad.ruta)
      },
    }

    return {
      subtarea,
      tiposTareasTelconet,
      configuracionColumnasEmpleado,
      columnasGestor: [...configuracionColumnasArchivoSubtarea, accionesTabla],
      tiposTrabajos,
      grupos,
      subtareas,
      clienteFinal,
      listadosAuxiliares,
      archivos,
      botonDescargar,
      clientesFinales,
      nombresClienteFinal: computed(() => clienteFinal.nombres + ' ' + clienteFinal.apellidos)
    }
  }
})
