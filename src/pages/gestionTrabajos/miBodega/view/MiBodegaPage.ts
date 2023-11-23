// Dependencias
import { configuracionColumnasMaterialEmpleadoTarea } from '../domain/configuracionColumnasMaterialEmpleadoTarea'
import { defineComponent, reactive, ref } from 'vue'
import { modosStock } from 'config/tareas.utils'
import { tiposJornadas } from 'config/utils'

// Componentes
import EssentialTable from 'components/tables/view/EssentialTable.vue'

// Logica y controladores
import { MaterialEmpleadoTareaController } from '../infraestructure/MaterialEmpleadoTareaController'
import { TareaController } from 'pages/gestionTrabajos/tareas/infraestructure/TareaController'
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { MaterialEmpleadoController } from '../infraestructure/MaterialEmpleadoController'
import { useListadoMaterialesDevolucionStore } from 'stores/listadoMaterialesDevolucion'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { useAuthenticationStore } from 'stores/authentication'
import { useNotificacionStore } from 'stores/notificacion'
import { useNotificaciones } from 'shared/notificaciones'
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
    const materialEmpleadoTareaController = new MaterialEmpleadoTareaController()
    const materialEmpleadoController = new MaterialEmpleadoController()
    const tareaController = new TareaController()

    /************
     * Variables
     ************/
    const { notificarAdvertencia } = useNotificaciones()
    const cargando = new StatusEssentialLoading()
    const materialesTarea = ref([])
    const listadoStockPersonal = ref([])
    const tareasSource: any = ref([])
    const filtro = reactive({
      tarea: null,
      tipoStock: null
    })
    const mensaje = ref()
    const clienteMaterialStock = ref()
    const clienteMaterialTarea = ref()
    const clientes = ref([])
    const clientesMaterialesTarea = ref([])

    const axios = AxiosHttpRepository.getInstance()

    /*******
     * Init
     *******/
    tareaController.listar({ activas_empleado: 1, empleado_id: authenticationStore.user.id }).then((data) => tareasSource.value = data.result)
    obtenerClientesMaterialesTarea()
    obtenerClientesMaterialesEmpleado()

    /************
     * Funciones
     ************/
    async function obtenerMaterialesTarea(cliente: number) {
      try {
        cargando.activar()
        const ruta = axios.getEndpoint(endpoints.materiales_empleado_tarea, { tarea_id: filtro.tarea, empleado_id: authenticationStore.user.id, cliente_id: cliente })
        const response: AxiosResponse = await axios.get(ruta)
        materialesTarea.value = response.data.results
        listadoMaterialesDevolucionStore.listadoMateriales = response.data.results
        listadoMaterialesDevolucionStore.tareaId = filtro.tarea

        if (!materialesTarea.value.length) {
          notificarAdvertencia('No tienes material asignado.')
        }
      } catch (e) {
        console.log(e)
      } finally {
        cargando.desactivar()
      }
    }

    async function filtrarStock(cliente: number) {
      try {
        cargando.activar()
        const { result } = await materialEmpleadoController.listar({ empleado_id: authenticationStore.user.id, cliente_id: cliente })
        listadoStockPersonal.value = result
        listadoMaterialesDevolucionStore.listadoMateriales = result
        // mensaje.value = !result.length ? 'No tienes materiales asignados en tu stock personal' : ''
        if (!result.length) {
          notificarAdvertencia('No tienes material asignado.')
        }
      } catch (e) {
        console.log(e)
      } finally {
        cargando.desactivar()
      }
    }

    async function obtenerClientesMaterialesTarea() {
      try {
        cargando.activar()
        const ruta = axios.getEndpoint(endpoints.obtener_clientes_materiales_tarea) + '/' + authenticationStore.user.id
        const response: AxiosResponse = await axios.get(ruta)
        clientesMaterialesTarea.value = response.data.results
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

    /**********
     * Filtros
     **********/
    const tareas = ref([])
    function filtrarTareas(val, update) {
      if (val === '') update(() => tareas.value = tareasSource.value)

      update(() => {
        const needle = val.toLowerCase()
        tareas.value = tareasSource.value.filter(
          (v) => v.codigo_tarea.toLowerCase().indexOf(needle) > -1
        )
      })
    }

    return {
      configuracionColumnasMaterialEmpleadoTarea,
      tiposJornadas,
      modosStock,
      filtrarStock,
      materialEmpleadoTareaController,
      materialesTarea,
      listadoStockPersonal,
      tareas,
      filtro,
      tab: ref('tareas'),
      filtrarTareas,
      mensaje,
      listadoMaterialesDevolucionStore,
      clientes,
      clienteMaterialTarea,
      clienteMaterialStock,
      clientesMaterialesTarea,
      obtenerMaterialesTarea,
    }
  },
})
