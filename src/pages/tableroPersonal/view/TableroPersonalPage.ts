// Dependencias
import { useAuthenticationStore } from 'stores/authentication'
import loginJson from 'src/assets/lottie/welcome.json'
import { defineComponent, reactive, ref } from 'vue'
import { date } from 'quasar'


// Componentes
import ModalesEntidad from 'components/modales/view/ModalEntidad.vue'
import SolicitarFecha from 'shared/prompts/SolicitarFecha.vue'
import { Vue3Lottie } from 'vue3-lottie'
import 'vue3-lottie/dist/style.css'

// Logica y controladores
import { ComportamientoModalesTableroPersonal } from '../application/ComportamientoModalesTableroPersonal'
import { TableroPersonalController } from '../infraestructure/TableroPersonalController'
// import { SubtareaController } from 'subtareas/infraestructure/SubtareaController'
import { TableroPersonal } from '../domain/TableroPersonal'
import { useNotificacionStore } from 'stores/notificacion'
import { useNotificaciones } from 'shared/notificaciones'

export default defineComponent({
  components: {
    ModalesEntidad,
    LottiePlayer: Vue3Lottie,
    SolicitarFecha,
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

    /**
     * Funcion para probar componente de fecha enviando al backend
     */
    const { confirmar } = useNotificaciones()



    return {
      tablero,
      store,
      usuarios,
      loginJson,
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
