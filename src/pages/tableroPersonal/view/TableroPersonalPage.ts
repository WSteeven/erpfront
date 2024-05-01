// Dependencias
import { useAuthenticationStore } from 'stores/authentication'
import loginJson from 'src/assets/lottie/welcome.json'
import { Ref, computed, defineComponent, onMounted, reactive, ref } from 'vue'
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

    const departamentoSeleccionado = ref('')
    const departamentos = ref(['Departamento 1', 'Departamento 2', 'Departamento 3'])
    const empleados: Ref<String[]> = ref([''])

    const store = useAuthenticationStore()
    const controller = new TableroPersonalController()
    const tablero = reactive(new TableroPersonal())
    const usuarios = 20
    const slide = ref(1)
    const autoplay = ref(true)
    const date = ref(timeStamp)

    const showBanner = ref(false)

    const filtrosTareas = ['Recientes', 'sdsd']
    const filtroTarea = ref('Recientes')

    const subtareasPorAsignar = ref([])

    const imagenPerfil = `https://ui-avatars.com/api/?name=${store.user.nombres.substr(0, 1)}+${store.user.apellidos.substr(0, 1)}&bold=true&background=0879dc28&color=0879dc`

    const lorem =
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
    const tipoSolicitud = ref('')
    const descripcion = ref('')
    const tiposSolicitud = ref([
      { label: 'Vacaciones', value: 'vacaciones' },
      { label: 'Enfermedad', value: 'enfermedad' },
      { label: 'Licencia de trabajo', value: 'licencia' },
    ])

    async function index() {
      const { response } = await controller.listar()
      tablero.hydrate(response.data.results)
    }

    index()

    const modales = new ComportamientoModalesTableroPersonal()

    const eventos = [
      '2024/05/01',
      '2024/05/05',
      '2024/05/06',
      '2024/05/09',
      '2024/05/23',
    ]
    const data = ref([
      {
        imagen: 'https://cdn.quasar.dev/img/mountains.jpg',
        titulo: 'noticia 1',
        autor: 'autor',
        descripcion: lorem,
      },
      {
        imagen: 'https://cdn.quasar.dev/img/mountains.jpg',
        titulo: 'noticia 2',
        autor: 'autor',
        descripcion: lorem,
      },
      {
        imagen: 'https://cdn.quasar.dev/img/mountains.jpg',
        titulo: 'noticia 3',
        autor: 'autor',
        descripcion: lorem,
      },
      {
        imagen: 'https://cdn.quasar.dev/img/mountains.jpg',
        titulo: 'noticia 4',
        autor: 'autor',
        descripcion: lorem,
      },
      {
        imagen: 'https://cdn.quasar.dev/img/mountains.jpg',
        titulo: 'noticia 5',
        autor: 'autor',
        descripcion: lorem,
      },
    ])
    const currentPage = ref(1) // Current page number (starts at 1)
    const perPage = ref(2) // Number of cards per page
    const displayedCards = computed(() => {
      const start = (currentPage.value - 1) * perPage.value
      const end = start + perPage.value
      return data.value.slice(start, end)
    })




    onMounted(() => {
      console.log('esta capturando la funcion')
      // Mostrar el banner después de 20 segundos (20000 milisegundos)
      setTimeout(() => {
        showBanner.value = true;
      }, 5000);
    })

    function verSubtarea() {
      // modales.abrirModalEntidad('SubtareaAsignadaPage')
    }


    function openWhatsApp(numero) {
      window.location.href = `https://wa.me/${numero}`;
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

    function verEvento(date) {
      const result = eventos.filter((evento) => evento === date)
      if (result.length > 0) {
        modales.abrirModalEntidad('VisualizarEventoPage')
      }
    }

    function enviarSolicitud() {
      // Aquí puedes implementar la lógica para enviar la solicitud
      console.log('Solicitud enviada:', {
        tipo: tipoSolicitud,
        descripcion: descripcion,
      })
    }

    function MostrarEmpleados() {
      switch (departamentoSeleccionado.value) {
        case 'Departamento 1':
          empleados.value = ['Empleado 1.1', 'Empleado 1.2', 'Empleado 1.3']
          break;
        case 'Departamento 2':
          empleados.value = ['Empleado 2.1', 'Empleado 2.2', 'Empleado 2.3']
          break;
        case 'Departamento 3':
          empleados.value = ['Empleado 3.1', 'Empleado 3.2', 'Empleado 3.3']
          break;
        default:
          empleados.value = []
      }
    }

    return {
      tablero,
      store,
      usuarios,
      loginJson,
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
      eventos,
      tiposSolicitud,
      lorem,
      data,
      currentPage,
      perPage,
      displayedCards,
      MostrarEmpleados,
      departamentoSeleccionado,
      departamentos,
      empleados,
      verEvento,
      showBanner,

    }
  },
})
