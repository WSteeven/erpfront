// Dependencias
import { configuracionColumnasMaterialEmpleadoTarea } from '../domain/configuracionColumnasMaterialEmpleadoTarea'
import { defineComponent, reactive, ref } from 'vue'
import { tiposJornadas } from 'config/utils'
import { modosStock } from 'config/tareas.utils'

// Componentes
import EssentialTable from 'components/tables/view/EssentialTable.vue'

// Logica y controladores
import { MaterialEmpleadoTareaController } from '../infraestructure/MaterialEmpleadoTareaController'
import { MaterialEmpleadoTarea } from '../domain/MaterialEmpleadoTarea'
import { TareaController } from 'pages/gestionTrabajos/tareas/infraestructure/TareaController'
import { useNotificaciones } from 'shared/notificaciones'
import { MaterialEmpleadoController } from '../infraestructure/MaterialEmpleadoController'

export default defineComponent({
  components: { EssentialTable },
  setup() {
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
    const listado = ref([])
    const listadoStockPersonal = ref([])
    const tareasSource: any = ref([])
    const filtro = reactive({
      tarea: null,
      tipoStock: null
    })

    /*******
     * Init
     *******/
    tareaController.listar().then((data) => tareasSource.value = data.result)

    /************
     * Funciones
     ************/
    async function filtrarStock(tipoStock: string | null) {
      if (tipoStock === 'personal') {
        const { result } = await materialEmpleadoController.listar()
        listadoStockPersonal.value = result
      } else {
        if (!filtro.tarea) {
          return notificarAdvertencia('Debe seleccionar una tarea')
        }

        const { result } = await materialEmpleadoTareaController.listar({ tarea_id: filtro.tarea })
        if (result.length === 0) {
          notificarAdvertencia('No tiene material asignado para la tarea seleccionada.')
        }
        listado.value = result
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
      listado,
      listadoStockPersonal,
      tareas,
      filtro,
      tab: ref('tareas'),
      filtrarTareas,
    }
  },
})
