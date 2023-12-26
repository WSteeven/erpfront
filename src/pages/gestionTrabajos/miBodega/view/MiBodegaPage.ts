// Dependencias
import { configuracionColumnasMaterialEmpleadoTarea } from '../domain/configuracionColumnasMaterialEmpleadoTarea'
import { computed, defineComponent, onMounted, reactive, ref, watch } from 'vue'
import { destinosTareas, modosStock } from 'config/tareas.utils'
import { tiposJornadas } from 'config/utils'

// Componentes
import EssentialTable from 'components/tables/view/EssentialTable.vue'

// Logica y controladores
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { useListadoMaterialesDevolucionStore } from 'stores/listadoMaterialesDevolucion'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { useMaterialesEmpleado } from '../application/UseMaterialesEmpleado'
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales'
import { useMaterialesTarea } from '../application/UseMaterialesTarea'
import { Tarea } from 'pages/gestionTrabajos/tareas/domain/Tarea'
import { useAuthenticationStore } from 'stores/authentication'
import { useNotificacionStore } from 'stores/notificacion'
import { FiltroMiBodega } from '../domain/FiltroMiBodega'
import { useCargandoStore } from 'stores/cargando'
import { endpoints } from 'config/api'
import { AxiosResponse } from 'axios'
import { useQuasar } from 'quasar'
import { FiltroMiBodegaProyecto } from '../domain/FiltroMiBodegaProyecto'

export default defineComponent({
  components: { EssentialTable },
  setup() {
    /*********
     * Stores
     *********/
    const listadoMaterialesDevolucionStore = useListadoMaterialesDevolucionStore()
    useNotificacionStore().setQuasar(useQuasar())
    useCargandoStore().setQuasar(useQuasar())

    /************
     * Variables
     ************/
    const campoTareaProyecto = ref('Todas las tareas asignadas')
    const tab = ref()

    onMounted(() => {
      tab.value = destinosTareas.paraClienteFinal
      proyectos.value = listadosAuxiliares.proyectos
    })

    const filtro = reactive(new FiltroMiBodega())
    const filtroProyecto = reactive(new FiltroMiBodegaProyecto())

    const clienteMaterialStock = ref()
    const etapa = ref()
    const proyecto = ref()

    const listadosAuxiliares = reactive({
      materialesTarea: [],
      clientesMaterialesTarea: [],
      clientesMaterialesEmpleado: [],
      tareas: [],
      proyectos: [],
      etapas: [],
    })

    /************
     * Funciones
     ************/
    const { obtenerMaterialesTarea, consultarClientesMaterialesTarea, consultarTareas, consultarProyectos, consultarEtapas } = useMaterialesTarea(filtro, listadosAuxiliares)
    const { consultarMaterialEmpleado, consultarClientesMaterialesEmpleado } = useMaterialesEmpleado(listadosAuxiliares)

    function seleccionarTarea() {
      listadosAuxiliares.materialesTarea = []
      const tarea = (listadosAuxiliares.tareas as any).find((tarea: Tarea) => tarea.id === filtro.tarea_id)
      proyecto.value = tarea.proyecto_id
      etapa.value = tarea.etapa_id
      filtro.cliente_id = tarea.cliente_id
      obtenerMaterialesTarea()
    }

    function consultarMaterialesProyecto() {
      listadosAuxiliares.materialesTarea = []
      /* const tarea = (listadosAuxiliares.tareas as any).find((tarea: Tarea) => tarea.id === filtro.tarea_id)
      proyecto.value = tarea.proyecto_id
      etapa.value = tarea.etapa_id
      filtro.cliente_id = tarea.cliente_id*/
      obtenerMaterialesTarea()
    }

    /*******
     * Init
     *******/
    consultarClientesMaterialesTarea()
    consultarClientesMaterialesEmpleado()
    consultarProyectos().then(() => proyectos.value = listadosAuxiliares.proyectos)

    /************
     * Observers
     ************/
    watch(tab, () => {
      listadosAuxiliares.tareas = []

      consultarTareas(tab.value)

      listadosAuxiliares.materialesTarea = []
      filtro.tarea_id = null
      proyecto.value = null
      etapa.value = null
      filtro.cliente_id = undefined
    })

    watch(proyecto, async () => {
      if (tab.value === destinosTareas.paraProyecto) {
        if (proyecto.value) {
          await consultarEtapas(proyecto.value)
          etapas.value = listadosAuxiliares.etapas
          listadosAuxiliares.tareas = []
          if (!listadosAuxiliares.etapas.length) {
            consultarTareas(tab.value, proyecto.value)
            campoTareaProyecto.value = 'Todas las tareas asignadas del proyecto seleccionado'
          }
        } else {
          filtro.tarea_id = null
          etapa.value = null
          listadosAuxiliares.etapas = []
          listadosAuxiliares.materialesTarea = []
          consultarTareas(tab.value)
        }
      }

      filtro.cliente_id = null
    })

    watch(etapa, () => {
      if (tab.value === destinosTareas.paraProyecto) {
        if (etapa.value) {
          listadosAuxiliares.tareas = []
          campoTareaProyecto.value = 'Todas las tareas asignadas de la etapa seleccionada'
          consultarTareas(destinosTareas.paraProyecto, proyecto.value, etapa.value)
        }
      }
    })

    watch(computed(() => filtro.tarea_id), (tarea) => {
      if (tarea) seleccionarTarea()
      if (tab.value === destinosTareas.paraProyecto) consultarTareas(destinosTareas.paraProyecto, proyecto.value, etapa.value)
    })

    /**********
     * Filtros
     **********/
    const { tareas, filtrarTareas, proyectos, filtrarProyectos, etapas, filtrarEtapas } = useFiltrosListadosSelects(listadosAuxiliares)

    return {
      configuracionColumnasMaterialEmpleadoTarea,
      tiposJornadas,
      modosStock,
      consultarMaterialEmpleado,
      listadosAuxiliares,
      filtro,
      tab,
      destinosTareas,
      listadoMaterialesDevolucionStore,
      clienteMaterialStock,
      obtenerMaterialesTarea,
      consultarEtapas,
      seleccionarTarea,
      tareas,
      proyectos,
      etapas,
      filtrarTareas,
      filtrarProyectos,
      filtrarEtapas,
      etapa,
      proyecto,
      consultarTareas,
      campoTareaProyecto,
      mostrarTareaProyecto: computed(() => !(proyecto.value && listadosAuxiliares.etapas.length && !etapa.value)),
    }
  },
})
