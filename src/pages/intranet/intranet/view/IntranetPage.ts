import { useAuthenticationStore } from 'stores/authentication'
import loginJson from 'src/assets/lottie/welcome.json'
import { Ref, computed, defineComponent, reactive, ref, onMounted } from 'vue'
import {
  QCarousel,
  QCarouselSlide,
  QCard,
  QImg,
  QCardSection,
  Notify
} from 'quasar'
import ModalesEntidad from 'components/modales/view/ModalEntidad.vue'
import SolicitarFecha from 'shared/prompts/SolicitarFecha.vue'
import { Vue3Lottie } from 'vue3-lottie'
import 'vue3-lottie/dist/style.css'
import { maskFecha } from 'src/config/utils'
import { ComportamientoModalesIntranet } from '../application/ComportamientoModalesIntranet'
import { useNotificaciones } from 'shared/notificaciones'
import { Departamento } from 'pages/recursosHumanos/departamentos/domain/Departamento'
import { DepartamentoController } from 'pages/recursosHumanos/departamentos/infraestructure/DepartamentoController'
import { Empleado } from 'pages/recursosHumanos/empleados/domain/Empleado'
import { EmpleadoController } from 'pages/recursosHumanos/empleados/infraestructure/EmpleadoController'
import { useConfiguracionGeneralStore } from 'stores/configuracion_general'
import { useMovilizacionSubtareaStore } from 'stores/movilizacionSubtarea'
import { ComputedRef } from 'vue'
import { useQuasar } from 'quasar'
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { useRouter } from 'vue-router'
import { useMenuStore } from 'stores/menu'
import { obtenerFechaActual } from '../../../../shared/utils'
import { MenuOption } from 'shared/menu/MenuOption'
import { NoticiaController } from 'pages/intranet/noticias/infraestructure/NoticiaController'

interface News {
  image: string
  title: string
  description: string
  link: string
}

export default defineComponent({
  components: {
    ModalesEntidad,
    LottiePlayer: Vue3Lottie,
    SolicitarFecha,
    QCarousel,
    QCarouselSlide,
    QCard,
    QImg,
    QCardSection
  },

  setup() {
    const departamentos: Ref<Departamento[]> = ref([])
    const departamentoSeleccionado = 1
    const empleados: Ref<Empleado[]> = ref([])

    const usuarios = 20
    const carousel_noticias = ref(0)
    const activeTab = ref(0)
    const selectedDate= ref(0)

    const carousel_cumpleanos_mes = ref(1)
    const search = ref()
    const autoplay = ref(true)
    const fechaActual = ref(obtenerFechaActual(maskFecha))
    const $q = useQuasar()
    const modulosPermitidos = ref()
    const showBanner = ref(true)
    const showDepartamentos = ref(true)

    const noticias = ref({})

    const menuStore = useMenuStore()
    const cargando = new StatusEssentialLoading()
    const store = useAuthenticationStore()
    const movilizacionSubtareaStore = useMovilizacionSubtareaStore()
    const configuracionGeneralStore = useConfiguracionGeneralStore()
    const Router = useRouter()

    const filtrosTareas = ['Recientes', 'sdsd']
    const filtroTarea = ref('Recientes')
    const subtareasPorAsignar = ref([])
    const tiposSolicitudes = ref([
      { label: 'Permisos', value: 'permiso' },
      { label: 'Licencias', value: 'licencias' },
      { label: 'Vacaciones', value: 'vacaciones' },
      { label: 'Prestamos', value: 'prestamos' }
    ])
    const solicitud = reactive({
      tipo_solicitud: '',
      descripcion: ''
    })

    const modales = new ComportamientoModalesIntranet()

    const events = ref([
      {
        time: { start: '2024-07-29 10:00:00', end: '2024-07-29 12:00:00' },
        color: 'red',
        title: 'Reunión',
        description: 'Reunión de planificación'
      },
      {
        time: { start: '2024-07-30 11:00:00', end: '2024-07-30 13:00:00' },
        color: 'blue',
        title: 'Presentación',
        description: 'Presentación del proyecto'
      }
    ])

    const eventDates = computed(() => {
      return events.value.map(event => ({
        date: event.time.start.split(' ')[0],
        color: event.color
      }))
    })

    function getColor(date) {
      const event = eventDates.value.find(event => event.date === date)
      return event ? event.color : 'grey'
    }

    function verEvento(date) {
      const event = events.value.find(
        event => event.time.start.split(' ')[0] === date
      )
      if (event) {
        alert(
          `Evento: ${event.title}\nDescripción: ${event.description}\nHora: ${event.time.start} - ${event.time.end}`
        )
      }
    }

    async function obtenerNoticias() {
      cargando.activar()
      const response = await new NoticiaController().listar()
      console.log(response)
      noticias.value = response.result
      cargando.desactivar()
    }

    const newsList = ref<News[]>([
      {
        image: 'https://www.jeanpazmino.com/images/services/service5.jpg',
        title: 'Nuevas capacitaciones en instalación de fibra óptica',
        description:
          'Descubre cómo mejorar tus habilidades en la instalación de fibra óptica con nuestros nuevos cursos especializados.',
        link: '/NoticiaView'
      },
      {
        image: 'https://www.jeanpazmino.com/images/services/service2.jpg',
        title: 'Técnicas avanzadas para la instalación de fibra óptica',
        description:
          'Explora las últimas técnicas y herramientas en el campo de la instalación de fibra óptica para maximizar la eficiencia y calidad.',
        link: '/NoticiaView'
      },
      {
        image:
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSdnA9EeXIUzXL44EETgKrCwT8sGQNV4oBzyg&s',
        title: 'Nuevos recursos para la capacitación en fibra óptica',
        description:
          'Conoce los recursos más recientes disponibles para tu capacitación en instalación de fibra óptica, diseñados para mejorar tu aprendizaje.',
        link: '/NoticiaView'
      },
      {
        image:
          'https://media.licdn.com/dms/image/C4D22AQHURssxoX0FAQ/feedshare-shrink_800/0/1643980715005?e=2147483647&v=beta&t=HLwKY4gOCsBPIBzusmztCrpCckmg858lLRvzotJFOK8',
        title: 'Programa de certificación en instalación de fibra óptica',
        description:
          'Participa en nuestro programa de certificación líder en la industria para convertirte en un experto en instalación de fibra óptica.',
        link: '/NoticiaView'
      }
    ])

    function getNewsById(id: number): News | undefined {
      return newsList.value[id]
    }

    const documentosIntranet = ref([
      {
        id: 1,
        name: 'Instructivos',
        icon: 'fab fa-readme',
        link: 'https://drive.google.com/drive/folders/1Zv3eTjramxByFRht-L5Gz_nrulgFE32V?usp=sharing_eip_m&ts=64386770',
        color: '#ffffff'
      },
      {
        id: 2,
        name: 'Reglamentos y Normativas',
        icon: 'fas fa-book',
        link: 'https://drive.google.com/drive/folders/1Zv3eTjramxByFRht-L5Gz_nrulgFE32V?usp=sharing_eip_m&ts=64386770',
        color: '#ffffff'
      }
    ])

    const readMore = (link: string) => {
      window.open(link, '_blank')
    }

    const currentPage = ref(1)
    const perPage = ref(2)
    const displayedCards = computed(() => {
      const start = (currentPage.value - 1) * perPage.value
      const end = start + perPage.value
      return newsList.value.slice(start, end)
    })

    function obtenerModulosPermitidos() {
      modulosPermitidos.value = menuStore.links.filter(
        (link: MenuOption) => link.can
      )
    }

    obtenerModulosPermitidos()

    function getIcon(modulo: string) {
      console.log('getIcon', modulo, Date.now().toString())
    }

    function goToModule(modulo: string) {
      console.log('Diste click en ', modulo)
    }

    async function logout() {
      cargando.activar()
      await store.logout()
      Router.replace({ name: 'Login' })
      cargando.desactivar()
    }

    async function consultarEmpleadosDepartamento(departamento_id: number) {
      try {
        cargando.activar()
        const idNumerico = Number(departamento_id)
        if (isNaN(idNumerico)) {
          throw new Error('El id del departamento no es un número válido')
        }
        const empleadoController = new EmpleadoController()
        empleados.value = (
          await empleadoController.listar({
            departamento_id: idNumerico,
            estado: 1
          })
        ).result
        console.log(empleados.value)
      } catch (err) {
        console.log(err)
      } finally {
        cargando.desactivar()
      }
    }

    async function consultarDepartamentos() {
      const departamentoController = new DepartamentoController()
      departamentos.value = (
        await departamentoController.listar({ activo: 1 })
      ).result
    }

    consultarDepartamentos()

    const empleadosCumpleaneros = ref<Empleado[]>([])

    const obtenerEmpleadosCumpleaneros = async () => {
      const currentMonth = new Date().getMonth() + 1
      try {
        const empleadoController = new EmpleadoController()
        const empleados = (
          await empleadoController.listar({
            estado: 1
          })
        ).result

        empleadosCumpleaneros.value = empleados
          .filter(empleado => {
            if (empleado.fecha_nacimiento) {
              const month = new Date(empleado.fecha_nacimiento).getMonth() + 1
              return month === currentMonth
            }
            return false
          })
          .sort((a, b) => {
            const dayA = new Date(a.fecha_nacimiento).getDate()
            const dayB = new Date(b.fecha_nacimiento).getDate()
            return dayA - dayB
          })
      } catch (err) {
        console.log('Error al obtener empleados cumpleañeros:', err)
      }
    }

    onMounted(() => {
      obtenerNoticias();
      obtenerEmpleadosCumpleaneros();
    })

    useNotificaciones()

    const enviarSolicitud = () => {
      console.log('Solicitud enviada:', {
        tipo: solicitud.tipo_solicitud
      })

      switch (solicitud.tipo_solicitud) {
        case 'permiso':
          Router.push('/permiso-nomina')
          break
        case 'licencia':
          Router.push('/licencia-empleado')
          break
        case 'vacacion':
          Router.push('/vacacion')
          break
        case 'préstamo':
          Router.push('/solicitud-prestamo-empresarial')
          break
        default:
          Notify.create({
            message: 'Solicitud Rechazada, contacta con el Administrador.',
            color: 'red',
            position: 'top'
          })
      }
    }

    function limpiarFormulario() {
      solicitud.tipo_solicitud = ''
    }

    const lorem =
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
    const selfCenterMiddle: ComputedRef<'center middle' | 'top start'> =
      computed(() => ($q.screen.xs ? 'center middle' : 'top start'))

    const getImagePerfil = usuario => {
      return usuario.foto_url == null
        ? `https://ui-avatars.com/api/?name=${usuario.nombres.substr(
            0,
            1
          )}+${usuario.apellidos.substr(
            0,
            1
          )}&bold=true&background=008000&color=ffff`
        : usuario.foto_url
    }

    const imagenPerfil = getImagePerfil(store.user)

    obtenerNoticias()

    return {
      logoClaro: computed(
        () => configuracionGeneralStore.configuracion?.logo_claro
      ),
      logoOscuro: computed(
        () => configuracionGeneralStore.configuracion?.logo_oscuro
      ),
      enCamino: computed(() => movilizacionSubtareaStore.subtareaDestino),
      motivo: computed(() => movilizacionSubtareaStore.motivo),
      mostrarMenu: ref(false),
      store,
      usuarios,
      loginJson,
      filtrosTareas,
      filtroTarea,
      modales,
      subtareasPorAsignar,
      carousel_noticias,
      activeTab,
      carousel_cumpleanos_mes,
      autoplay,
      imagenPerfil,
      tiposSolicitudes,
      solicitud,
      lorem,
      currentPage,
      perPage,
      displayedCards,
      departamentoSeleccionado,
      departamentos,
      empleados,
      showDepartamentos,
      modulosPermitidos,
      logout,
      verEvento,
      getColor,
      consultarEmpleadosDepartamento,
      enviarSolicitud,
      limpiarFormulario,
      getIcon,
      goToModule,
      getNewsById,
      width: computed(() => ($q.screen.xs ? '100%' : '450px')),
      selfCenterMiddle,
      showBanner,
      search,
      maskFecha,
      newsList,
      readMore,
      documentosIntranet,
      empleadosCumpleaneros,
      fechaActual,
      eventDates,
      selectedDate,

      noticias,
    }
  }
})
