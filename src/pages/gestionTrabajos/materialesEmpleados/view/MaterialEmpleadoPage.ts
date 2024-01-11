// Dependencias
// import { configuracionColumnasMaterialEmpleadoTarea } from '../domain/configuracionColumnasMaterialEmpleadoTarea'
import { useNotificaciones } from 'shared/notificaciones'
import { defineComponent, reactive, ref } from 'vue'
import { destinosTareas } from 'config/tareas.utils'
import { ordernarListaString } from 'shared/utils'
import { useCargandoStore } from 'stores/cargando'
import { modosStock } from 'config/tareas.utils'
import { tiposJornadas } from 'config/utils'
import { AxiosResponse } from 'axios'
import { useQuasar } from 'quasar'

// Componentes
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import FiltroProductosAsignados from './FiltroProductosAsignados.vue'

// Logica y controladores
import { EmpleadoController } from 'pages/recursosHumanos/empleados/infraestructure/EmpleadoController'
import { MaterialEmpleadoTareaController } from '../infraestructure/MaterialEmpleadoTareaController'
import { TareaController } from 'pages/gestionTrabajos/tareas/infraestructure/TareaController'
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { MaterialEmpleadoController } from '../infraestructure/MaterialEmpleadoController'
import { useListadoMaterialesDevolucionStore } from 'stores/listadoMaterialesDevolucion'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { Empleado } from 'pages/recursosHumanos/empleados/domain/Empleado'
import { endpoints } from 'config/api'
import { configuracionColumnasMaterialEmpleadoTarea } from 'pages/gestionTrabajos/miBodega/domain/configuracionColumnasMaterialEmpleadoTarea'

export default defineComponent({
  components: { EssentialTable, FiltroProductosAsignados },
  setup() {
    /*********
     * Stores
     *********/
    const listadoMaterialesDevolucionStore = useListadoMaterialesDevolucionStore()
    useCargandoStore().setQuasar(useQuasar())

    /****************
     * Controladores
     ****************/
    const materialEmpleadoTareaController = new MaterialEmpleadoTareaController()
    const materialEmpleadoController = new MaterialEmpleadoController()
    const tareaController = new TareaController()
    const empleadoController = new EmpleadoController()

    /************
     * Variables
     ************/
    const { notificarAdvertencia } = useNotificaciones()
    const cargando = new StatusEssentialLoading()
    const materialesTarea = ref([])
    const listadoStockPersonal = ref([])
    const tareasSource: any = ref([])
    const empleadosSource: any = ref([])
    const clientesMaterialesStock = ref([])
    const clientesMaterialesTarea = ref([])
    const filtro = reactive({
      tarea: null,
      tipoStock: null,
      empleado: null,
    })
    const mensaje = ref()
    const axios = AxiosHttpRepository.getInstance()
    const clienteMaterialStock = ref()
    const clienteMaterialTarea = ref()

    /*******
     * Init
     *******/
    async function cargarTareas() {
      if (!filtro.empleado) return

      try {
        cargando.activar()
        const tareasResponse = await tareaController.listar({ activas_empleado: 1, empleado_id: filtro.empleado })
        tareasSource.value = tareasResponse.result

        obtenerClientesMaterialesTarea()
        obtenerClientesMaterialesEmpleado()

        clienteMaterialStock.value = undefined
        clienteMaterialTarea.value = undefined
        listadoStockPersonal.value = []
        materialesTarea.value = []
        filtro.tarea = null

      } catch (e) {
        console.log(e)
      } finally {
        cargando.desactivar()
      }
    }

    async function cargarEmpleados() {
      try {
        cargando.activar()
        const empleadosResponse = await empleadoController.listar({
          campos: 'id,nombres,apellidos',
          estado: 1
        })
        empleadosSource.value = empleadosResponse.result
      } catch (e) {
        console.log(e)
      } finally {
        cargando.desactivar()
      }
    }

    cargarEmpleados()
    /************
     * Funciones
     ************/
    /* async function filtrarStock(tipoStock: string | null) {
      mensaje.value = ''
      try {
        cargando.activar()
        if (tipoStock === 'personal') filtrarStockPersonal()
        else filtrarMaterialTarea()
      } catch (e) {
        notificarError('Error al obtener el material.')
      } finally {
        cargando.desactivar()
      }
    } */

    function ordenarEmpleados() {
      empleados.value.sort((a: Empleado, b: Empleado) => ordernarListaString(a.apellidos!, b.apellidos!))
    }

    /* async function filtrarStockPersonal() {
      const { result } = await materialEmpleadoController.listar({ empleado_id: filtro.empleado })
      listadoStockPersonal.value = result
      listadoMaterialesDevolucionStore.listadoMateriales = result
      mensaje.value = !result.length ? 'El empleado seleccionado no tiene materiales asignados en su stock personal' : ''
    }

    async function filtrarMaterialTarea() {
      const { result } = await materialEmpleadoTareaController.listar({ tarea_id: filtro.tarea, empleado_id: filtro.empleado })
      materialesTarea.value = result
      mensaje.value = !result.length ? 'El empleado seleccionado no tiene materiales asignados para la tarea seleccionada' : ''
      // asignacion al store de la tarea y el listado de materiales para devolver
      listadoMaterialesDevolucionStore.listadoMateriales = result
      listadoMaterialesDevolucionStore.tareaId = filtro.tarea
    } */

    async function obtenerMaterialesTarea(cliente: number) {
      try {
        cargando.activar()
        const ruta = axios.getEndpoint(endpoints.materiales_empleado_tarea, { tarea_id: filtro.tarea, empleado_id: filtro.empleado, cliente_id: cliente })
        const response: AxiosResponse = await axios.get(ruta)
        materialesTarea.value = response.data.results

        if (!materialesTarea.value.length) notificarAdvertencia('No tienes material asignado.')
      } catch (e) {
        console.log(e)
      } finally {
        cargando.desactivar()
      }
    }

    async function obtenerMaterialStock(cliente: number) {
      try {
        cargando.activar()
        const { result } = await materialEmpleadoController.listar({ empleado_id: filtro.empleado, cliente_id: cliente })
        listadoStockPersonal.value = result
        if (!result.length) notificarAdvertencia('No tienes material asignado.')
      } catch (e) {
        console.log(e)
      } finally {
        cargando.desactivar()
      }
    }

    async function obtenerClientesMaterialesTarea() {
      try {
        cargando.activar()
        const ruta = axios.getEndpoint(endpoints.obtener_clientes_materiales_tarea) + '/' + filtro.empleado
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
        const ruta = axios.getEndpoint(endpoints.obtener_clientes_materiales_empleado) + '/' + filtro.empleado
        const response: AxiosResponse = await axios.get(ruta)
        clientesMaterialesStock.value = response.data.results
      } catch (e) {
        console.log(e)
      } finally {
        cargando.desactivar()
      }
    }

    /**********
     * Filtros
     **********/
    const empleados = ref([])
    function filtrarEmpleados(val, update) {
      if (val === '') update(() => empleados.value = empleadosSource.value.sort((a, b) => ordernarListaString(a.nombres, b.nombres)))

      update(() => {
        const needle = val.toLowerCase()
        empleados.value = empleadosSource.value.filter((v) => v.nombres.toLowerCase().indexOf(needle) > -1 || v.apellidos.toLowerCase().indexOf(needle) > -1)
      })
    }

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
      materialEmpleadoTareaController,
      materialesTarea,
      listadoStockPersonal,
      filtro,
      tareas,
      empleados,
      tab: ref('tareas'),
      filtrarTareas,
      filtrarEmpleados,
      listadoMaterialesDevolucionStore,
      ordenarEmpleados,
      mensaje,
      cargarTareas,
      clientesMaterialesStock,
      clientesMaterialesTarea,
      obtenerMaterialStock,
      obtenerMaterialesTarea,
      clienteMaterialStock,
      clienteMaterialTarea,
      destinosTareas,
    }
  },
})
