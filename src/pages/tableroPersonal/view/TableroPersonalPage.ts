// Dependencias
import { useAuthenticationStore } from 'stores/authentication'
import { defineComponent, reactive, ref } from 'vue'
import { date } from 'quasar'

// Componentes
import ModalesEntidad from 'components/modales/view/ModalEntidad.vue'

// Logica y controladores
import { ComportamientoModalesTableroPersonal } from '../application/ComportamientoModalesTableroPersonal'
import { TableroPersonalController } from '../infraestructure/TableroPersonalController'
// import { SubtareaController } from 'subtareas/infraestructure/SubtareaController'
import { TableroPersonal } from '../domain/TableroPersonal'

export default defineComponent({
  components: {
    ModalesEntidad,
  },
  setup() {
    const store = useAuthenticationStore()
    const controller = new TableroPersonalController()
    const tablero = reactive(new TableroPersonal())
    const usuarios = 20

    const filtrosTareas = ['Recientes', 'sdsd']
    const filtroTarea = ref('Recientes')

    const subtareasPorAsignar = ref([])

    async function index() {
      const { response } = await controller.listar()
      tablero.hydrate(response.data.results)
    }

    index()

    const modales = new ComportamientoModalesTableroPersonal()

    const timeStamp = Date.now()
    const fecha = date.formatDate(timeStamp, 'dddd, DD MMMM YYYY')

    function verSubtarea() {
      // modales.abrirModalEntidad('SubtareaAsignadaPage')
    }

    async function obtenerSubtareasPendientesAsignar() {
      const filtros = {
        estado: 'CREADO',
        coordinador_id: store.user.id,
      }
      // const { result } = await new SubtareaController().listar(filtros)
      // subtareasPorAsignar.value = result
    }

    // obtenerSubtareasPendientesAsignar()

    return {
      tablero,
      store,
      usuarios,
      /* tab: ref(
          store.esTecnicoLider
              ? 'asignadas'
              : store.esCoordinador
                  ? 'pendientes'
                  : ''
      ), */
      filtrosTareas,
      filtroTarea,
      modales,
      verSubtarea,
      fecha,
      subtareasPorAsignar,
    }
  },
})
