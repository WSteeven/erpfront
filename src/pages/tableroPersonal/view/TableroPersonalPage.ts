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

    const timeStamp = Date.now()


    const store = useAuthenticationStore()
    const controller = new TableroPersonalController()
    const tablero = reactive(new TableroPersonal())
    const usuarios = 20
    const slide = ref(1)
    const autoplay = ref(true)
    const date = ref(timeStamp)

    const filtrosTareas = ['Recientes', 'sdsd']
    const filtroTarea = ref('Recientes')

    const subtareasPorAsignar = ref([])

    const imagenPerfil = `https://ui-avatars.com/api/?name=${store.user.nombres.substr(0, 1)}+${store.user.apellidos.substr(0, 1)}&bold=true&background=0879dc28&color=0879dc`


    const tipoSolicitud = ref('')
    const descripcion = ref('')
    const tiposSolicitud = ref([
      { label: 'Vacaciones', value: 'vacaciones' },
      { label: 'Enfermedad', value: 'enfermedad' },
      { label: 'Licencia de trabajo', value: 'licencia' }
    ])



    async function index() {
      const { response } = await controller.listar()
      tablero.hydrate(response.data.results)
    }

    index()

    const modales = new ComportamientoModalesTableroPersonal()

    const events = ['2024/04/01', '2024/04/05', '2024/04/06', '2024/04/09', '2024/04/23']

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


    function eventsFn(date) {
      if (date === '2024/04/01' ||
        date === '2024/04/05' ||
        date === '2024/04/06' ||
        date === '2024/04/09' ||
        date === '2024/04/24') {
        return true
      }
      return false
    }


    function enviarSolicitud() {
      // Aquí puedes implementar la lógica para enviar la solicitud
      console.log('Solicitud enviada:', {
        tipo: tipoSolicitud,
        descripcion: descripcion
      });
    }



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
      timeStamp,
      subtareasPorAsignar,
      slide,
      autoplay,
      imagenPerfil,
      date,
      events,
      eventsFn,
      tiposSolicitud,
    }
  },
})
