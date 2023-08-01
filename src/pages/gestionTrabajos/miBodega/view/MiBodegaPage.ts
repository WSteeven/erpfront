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
import { useCargandoStore } from 'stores/cargando'
import { useQuasar } from 'quasar'

export default defineComponent({
  components: { EssentialTable },
  setup() {
    /*********
     * Stores
     *********/
    const authenticationStore = useAuthenticationStore()
    const listadoMaterialesDevolucionStore = useListadoMaterialesDevolucionStore()
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
    const { notificarError } = useNotificaciones()
    const cargando = new StatusEssentialLoading()
    const materialesTarea = ref([])
    const listadoStockPersonal = ref([])
    const tareasSource: any = ref([])
    const filtro = reactive({
      tarea: null,
      tipoStock: null
    })
    const mensaje = ref()

    /*******
     * Init
     *******/
    tareaController.listar({ finalizado: 0 }).then((data) => tareasSource.value = data.result)

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

    async function filtrarStockPersonal() {
      const { result } = await materialEmpleadoController.listar({ empleado_id: authenticationStore.user.id })
      listadoStockPersonal.value = result
      listadoMaterialesDevolucionStore.listadoMateriales = result
      mensaje.value = !result.length ? 'No tienes materiales asignados en tu stock personal' : ''
    }

    async function filtrarMaterialTarea() {
      const { result } = await materialEmpleadoTareaController.listar({ tarea_id: filtro.tarea, empleado_id: authenticationStore.user.id })
      // if (result.length === 0) {
      //   notificarAdvertencia('No tiene material asignado para la tarea seleccionada.')
      // }
      materialesTarea.value = result
      mensaje.value = !result.length ? 'No tienes materiales asignados para la tarea seleccionada' : ''
      // asignacion al store de la tarea y el listado de materiales para devolver
      listadoMaterialesDevolucionStore.listadoMateriales = result
      listadoMaterialesDevolucionStore.tareaId = filtro.tarea
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
      listadoMaterialesDevolucionStore
    }
  },
})
