// Dependencias
import { configuracionColumnasMaterialEmpleadoTarea } from '../domain/configuracionColumnasMaterialEmpleadoTarea'
import { defineComponent, onMounted, reactive, ref, watch } from 'vue'
import { destinosTareas, modosStock } from 'config/tareas.utils'
import { tiposJornadas } from 'config/utils'

// Componentes
import EssentialTable from 'components/tables/view/EssentialTable.vue'

// Logica y controladores
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { MaterialEmpleadoController } from '../infraestructure/MaterialEmpleadoController'
import { useListadoMaterialesDevolucionStore } from 'stores/listadoMaterialesDevolucion'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales'
import { useMaterialesTarea } from '../application/UseMaterialesTarea'
import { Tarea } from 'pages/gestionTrabajos/tareas/domain/Tarea'
import { useAuthenticationStore } from 'stores/authentication'
import { useNotificacionStore } from 'stores/notificacion'
import { useNotificaciones } from 'shared/notificaciones'
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

    /****************
     * Controladores
     ****************/
    const materialEmpleadoController = new MaterialEmpleadoController()

    /************
     * Variables
     ************/
    const { notificarAdvertencia } = useNotificaciones()
    const cargando = new StatusEssentialLoading()
    const listadoStockPersonal = ref([])

    const tab = ref()

    onMounted(() => tab.value = destinosTareas.paraClienteFinal)

    const filtro = reactive(new FiltroMiBodega())
    filtro.empleado_id = authenticationStore.user.id

    const mensaje = ref()
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

    async function filtrarStock(cliente: number) {
      try {
        cargando.activar()
        const { result } = await materialEmpleadoController.listar({ empleado_id: authenticationStore.user.id, cliente_id: cliente })
        listadoStockPersonal.value = result
        listadoMaterialesDevolucionStore.listadoMateriales = result
        listadoMaterialesDevolucionStore.tareaId = null
        listadoMaterialesDevolucionStore.cliente_id = cliente
        if (!result.length) {
          notificarAdvertencia('No tienes material asignado.')
        }
      } catch (e) {
        console.log(e)
      } finally {
        cargando.desactivar()
      }
    }

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
      filtro.cliente_id = (listadosAuxiliares.tareas as any).find((tarea: Tarea) => tarea.id === filtro.tarea_id).cliente_id
      obtenerMaterialesTarea()
    }

    /*******
     * Init
     *******/
    obtenerClientesMaterialesTarea()
    obtenerClientesMaterialesEmpleado()
    consultarProyectos()

    /************
     * Observers
     ************/
    watch(tab, () => consultarTareas(tab.value))

    /**********
     * Filtros
     **********/
    const { tareas, filtrarTareas, proyectos, filtrarProyectos, etapas, filtrarEtapas } = useFiltrosListadosSelects(listadosAuxiliares)

    return {
      configuracionColumnasMaterialEmpleadoTarea,
      tiposJornadas,
      modosStock,
      filtrarStock,
      listadosAuxiliares,
      listadoStockPersonal,
      filtro,
      tab,
      destinosTareas,
      mensaje,
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
