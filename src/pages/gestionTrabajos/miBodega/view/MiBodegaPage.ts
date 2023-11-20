// Dependencias
import { configuracionColumnasMaterialEmpleadoTarea } from '../domain/configuracionColumnasMaterialEmpleadoTarea'
import { defineComponent, reactive, ref } from 'vue'
import { tiposJornadas } from 'config/utils'
import { modosStock } from 'config/tareas.utils'

// Componentes
import EssentialTable from 'components/tables/view/EssentialTable.vue'

// Logica y controladores
import { MaterialEmpleadoTareaController } from '../infraestructure/MaterialEmpleadoTareaController'
import { TareaController } from 'pages/gestionTrabajos/tareas/infraestructure/TareaController'
import { useNotificaciones } from 'shared/notificaciones'
import { MaterialEmpleadoController } from '../infraestructure/MaterialEmpleadoController'
import { useAuthenticationStore } from 'stores/authentication'
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { useListadoMaterialesDevolucionStore } from 'stores/listadoMaterialesDevolucion'
import { useNotificacionStore } from 'stores/notificacion'
import { useCargandoStore } from 'stores/cargando'
import { useQuasar } from 'quasar'
import { endpoints } from 'config/api'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { AxiosResponse } from 'axios'

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
    const listado = ref()
    const clienteMaterialStock = ref()
    const clienteMaterialTarea = ref()
    const clientes = ref([])
    const clientesMaterialesTarea = ref([])

    const axios = AxiosHttpRepository.getInstance()

    /*******
     * Init
     *******/
    // coordinador_id: authenticationStore.user.jefe_id
    tareaController.listar({ finalizado: 0, campos: 'id,titulo,codigo_tarea' }).then((data) => tareasSource.value = data.result)
    obtenerClientesMaterialesTarea()
    obtenerClientesMaterialesEmpleado()

    /************
     * Funciones
     ************/
    /* async function filtrarStock(tipoStock: string | null) {
      mensaje.value = ''
      try {
        cargando.activar()
        if (tipoStock === 'personal') {
          const { result } = await materialEmpleadoController.listar({ empleado_id: authenticationStore.user.id })
          listadoStockPersonal.value = result
          listadoMaterialesDevolucionStore.listadoMateriales = result
        } else {
          if (!filtro.tarea) {
            return notificarAdvertencia('Debe seleccionar una tarea')
          }

          const { result } = await materialEmpleadoTareaController.listar({ tarea_id: filtro.tarea, empleado_id: authenticationStore.user.id })
          if (result.length === 0) {
            notificarAdvertencia('No tiene material asignado para la tarea seleccionada.')
          }
          listado.value = result
          // asignacion al store de la tarea y el listado de materiales para devolver
          listadoMaterialesDevolucionStore.listadoMateriales = result
          listadoMaterialesDevolucionStore.tareaId = filtro.tarea
        }
        // if (tipoStock === 'personal') filtrarStockPersonal()
        filtrarMaterialTarea()
      } catch (e) {
        notificarError('Error al obtener el material.')
      } finally {
        cargando.desactivar()
      }
    } */

    async function obtenerMaterialesTarea(cliente: number) {
      try {
        cargando.activar()
        const ruta = axios.getEndpoint(endpoints.materiales_empleado_tarea, { tarea_id: filtro.tarea, empleado_id: authenticationStore.user.id, cliente_id: cliente })
        const response: AxiosResponse = await axios.get(ruta)
        materialesTarea.value = response.data.results
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

    /*async function filtrarMaterialTarea() {
      const { result } = await materialEmpleadoTareaController.listar({ tarea_id: filtro.tarea, empleado_id: authenticationStore.user.id })
      // if (result.length === 0) {
      //   notificarAdvertencia('No tiene material asignado para la tarea seleccionada.')
      // }
      materialesTarea.value = result
      mensaje.value = !result.length ? 'No tienes materiales asignados para la tarea seleccionada' : ''
      // asignacion al store de la tarea y el listado de materiales para devolver
      listadoMaterialesDevolucionStore.listadoMateriales = result
      listadoMaterialesDevolucionStore.tareaId = filtro.tarea
    }*/


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
    //botones para transferir al stock

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
