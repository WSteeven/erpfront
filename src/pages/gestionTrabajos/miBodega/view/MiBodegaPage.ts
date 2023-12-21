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

export default defineComponent({
  components: { EssentialTable },
  setup() {
    /*********
     * Stores
     *********/
    const authenticationStore = useAuthenticationStore()
    const listadoMaterialesDevolucionStore = useListadoMaterialesDevolucionStore()
    useNotificacionStore().setQuasar(useQuasar())
    useCargandoStore().setQuasar(useQuasar())

    /************
     * Variables
     ************/
    const cargando = new StatusEssentialLoading()
    const listadoStockPersonal = ref([])

    const tab = ref()

    onMounted(() => {
      tab.value = destinosTareas.paraClienteFinal
      proyectos.value = listadosAuxiliares.proyectos
    })

    const filtro = reactive(new FiltroMiBodega())
    filtro.empleado_id = authenticationStore.user.id

    const clienteMaterialStock = ref()
    const clientes = ref([])
    const clientesMaterialesTarea = ref([])
    const etapa = ref()
    const proyecto = ref()

    const axios = AxiosHttpRepository.getInstance()

    const listadosAuxiliares = reactive({
      materialesTarea: [],
      clientesMaterialesTarea: [],
      tareas: [],
      proyectos: [],
      etapas: [],
    })

    /************
     * Funciones
     ************/
    const { obtenerMaterialesTarea, obtenerClientesMaterialesTarea, consultarTareas, consultarProyectos, consultarEtapas } = useMaterialesTarea(filtro, listadosAuxiliares)
    const { consultarMaterialEmpleado } = useMaterialesEmpleado(filtro, listadosAuxiliares)

    async function obtenerClientesMaterialesEmpleado() {
      try {
        cargando.activar()
        const ruta = axios.getEndpoint(endpoints.obtener_clientes_materiales_empleado) + '/' + authenticationStore.user.id
        const response: AxiosResponse = await axios.get(ruta)
        clientes.value = response.data.results
      } catch (e) {
        console.log(e)
      } finally {
        cargando.desactivar()
      }
    }

    function seleccionarTarea() {
      listadosAuxiliares.materialesTarea = []
      const tarea = (listadosAuxiliares.tareas as any).find((tarea: Tarea) => tarea.id === filtro.tarea_id)
      proyecto.value = tarea.proyecto_id
      etapa.value = tarea.etapa_id
      filtro.cliente_id = tarea.cliente_id
      obtenerMaterialesTarea()
    }

    /*******
     * Init
     *******/
    obtenerClientesMaterialesTarea()
    obtenerClientesMaterialesEmpleado()
    consultarProyectos().then((result) => proyectos.value = listadosAuxiliares.proyectos)

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
      /*listadosAuxiliares.clientesMaterialesTarea = []
      listadosAuxiliares.tareas = []
      listadosAuxiliares.proyectos = []
      listadosAuxiliares.etapas = []
      switch (tab.value) {
        case destinosTareas.paraClienteFinal:

          break
        case destinosTareas.paraProyecto:
          break
      } */
    })

    watch(proyecto, () => {
      if (proyecto.value) {
        consultarEtapas(proyecto.value).then(() => etapas.value = listadosAuxiliares.etapas)
        listadosAuxiliares.tareas = []
        filtro.tarea_id = null
        // if (!listadosAuxiliares.etapas.length) consultarTareas(destinosTareas.paraProyecto, proyecto.value)
      }
    })

    watch(etapa, () => {
      if (etapa.value) {
        listadosAuxiliares.tareas = []
        consultarTareas(destinosTareas.paraProyecto, proyecto.value, etapa.value)
      }
    })

    watch(computed(() => filtro.tarea_id), (tarea) => {
      if (tarea) seleccionarTarea()
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
      listadoStockPersonal,
      filtro,
      tab,
      destinosTareas,
      listadoMaterialesDevolucionStore,
      clientes,
      clienteMaterialStock,
      clientesMaterialesTarea,
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
    }
  },
})
