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
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { useListadoMaterialesDevolucionStore } from 'stores/listadoMaterialesDevolucion'
import { useCargandoStore } from 'stores/cargando'
import { useQuasar } from 'quasar'
import { EmpleadoController } from 'pages/recursosHumanos/empleados/infraestructure/EmpleadoController'
import { ordernarListaString } from 'shared/utils'
import { Empleado } from 'pages/recursosHumanos/empleados/domain/Empleado'

export default defineComponent({
  components: { EssentialTable },
  setup() {
    /*********
     * Stores
     *********/
    // const authenticationStore = useAuthenticationStore()
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
    const { notificarError } = useNotificaciones()
    const cargando = new StatusEssentialLoading()
    const materialesTarea = ref([])
    const listadoStockPersonal = ref([])
    const tareasSource: any = ref([])
    const empleadosSource: any = ref([])
    const filtro = reactive({
      tarea: null,
      tipoStock: null,
      empleado: null,
    })
    const mensaje = ref()

    /*******
     * Init
     *******/
    async function cargarListados() {
      cargando.activar()
      const tareasResponse = await tareaController.listar({ finalizado: 0 })
      tareasSource.value = tareasResponse.result

      const empleadosResponse = await empleadoController.listar({
        campos: 'id,nombres,apellidos',
        estado: 1
      })
      empleadosSource.value = empleadosResponse.result
      cargando.desactivar()
    }

    cargarListados()

    /************
     * Funciones
     ************/
    async function filtrarStock(tipoStock: string | null) {
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
    }

    function ordenarEmpleados() {
      empleados.value.sort((a: Empleado, b: Empleado) => ordernarListaString(a.apellidos!, b.apellidos!))
    }

    async function filtrarStockPersonal() {
      const { result } = await materialEmpleadoController.listar({ empleado_id: filtro.empleado })
      listadoStockPersonal.value = result
      listadoMaterialesDevolucionStore.listadoMateriales = result
      mensaje.value = !result.length ? 'El empleado seleccionado no tiene materiales asignados en su stock personal' : ''
    }

    async function filtrarMaterialTarea() {
      const { result } = await materialEmpleadoTareaController.listar({ tarea_id: filtro.tarea, empleado_id: filtro.empleado })
      // if (result.length === 0) {
      //   notificarAdvertencia('No tiene material asignado para la tarea seleccionada.')
      // }
      materialesTarea.value = result
      mensaje.value = !result.length ? 'El empleado seleccionado no tiene materiales asignados para la tarea seleccionada' : ''
      // asignacion al store de la tarea y el listado de materiales para devolver
      listadoMaterialesDevolucionStore.listadoMateriales = result
      listadoMaterialesDevolucionStore.tareaId = filtro.tarea
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
      filtrarStock,
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
    }
  },
})
