import { useAuthenticationStore } from 'stores/authentication'
import loginJson from 'src/assets/lottie/welcome.json'
import { Ref, computed, defineComponent, reactive, ref, onMounted } from 'vue'
import {
  QCarousel,
  QCarouselSlide,
  QCard,
  QImg,
  QCardSection,
  QDialog,
  QDate,
  QCardActions,
  QBtn
} from 'quasar'
import { Qalendar } from 'qalendar'
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
import { formatearFecha } from '../../../../shared/utils'
import { MenuOption } from 'shared/menu/MenuOption'
import { NoticiaController } from 'pages/intranet/noticias/infraestructure/NoticiaController'
import { EventoController } from 'pages/intranet/eventos/infraestructure/EventoController'

interface Noticia {
  id: number
  titulo: string
  imagen_noticia: string
  descripcion: string
}

interface Evento {
  id: number
  titulo: string
  tipo_evento_id: number
  anfitrion_id: number
  descripcion: string
  fecha_hora_inicio: string
  fecha_hora_fin: string
}

export default defineComponent({
  name: 'intranet_page',
  components: {
    ModalesEntidad,
    LottiePlayer: Vue3Lottie,
    SolicitarFecha,
    QCarousel,
    QCarouselSlide,
    QCard,
    QImg,
    QCardSection,
    QDate,
    QDialog,
    QCardActions,
    QBtn,
    Qalendar
  },

  setup() {
    const departamentos: Ref<Departamento[]> = ref([])
    const departamentoSeleccionado = 1
    const empleados: Ref<Empleado[]> = ref([])

    const usuarios = 20
    const carousel_noticias = ref(0)
    const activeTab = ref(0)

    const modalNoticia = ref(false)

    const noticias = ref<Noticia[]>([])
    const noticiaCompleta = ref<Noticia | null>(null)

    //solicitudes
    const { notificarError } = useNotificaciones()
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

    const eventos = ref<Evento[]>([])
    const eventoSeleccionado = ref<Evento | null>(null)
    const fechaSeleccionada = ref(null)
    const dialogoVisible = ref(false)

    const carousel_cumpleanos_mes = ref(1)
    const autoplay = ref(true)
    const fechaActual = ref(obtenerFechaActual(maskFecha))
    const $q = useQuasar()
    const modulosPermitidos = ref()
    const showBanner = ref(true)
    const showDepartamentos = ref(true)

    const menuStore = useMenuStore()
    const cargando = new StatusEssentialLoading()
    const store = useAuthenticationStore()
    const movilizacionSubtareaStore = useMovilizacionSubtareaStore()
    const configuracionGeneralStore = useConfiguracionGeneralStore()
    const Router = useRouter()

    const filtrosTareas = ['Recientes', 'sdsd']
    const filtroTarea = ref('Recientes')
    const subtareasPorAsignar = ref([])

    consultarEmpleadosDepartamento(store.user.departamento)
    activeTab.value = store.user.departamento

    const modales = new ComportamientoModalesIntranet()

    const esquemasColores = {
      1: 'capacitaciones',
      2: 'reunion',
      3: 'general'
    }

    const eventosFormateados = computed(() => {
      return eventos.value
        .map(evento => {
          if (!evento.fecha_hora_inicio || !evento.fecha_hora_fin) {
            console.warn('Evento con datos incompletos:', evento)
            return null
          }
          return {
            id: evento.id,
            title: evento.titulo,
            autor: evento.anfitrion_id,
            description: evento.descripcion,
            colorScheme: esquemasColores[evento.tipo_evento_id] || 'general',
            time: {
              start: evento.fecha_hora_inicio,
              end: evento.fecha_hora_fin
            },
            data: evento // Pasar todo el objeto evento como dato adicional
          }
        })
        .filter(evento => evento !== null)
    })

    const configuracion = ref({
      week: {
        startsOn: 'monday',
        nDays: 7,
        scrollToHour: 8
      },
      month: {
        showTrailingAndLeadingDates: false
      },
      locale: 'es-ES',
      style: {
        fontFamily: 'Nunito, sans-serif',
        color: 'blue',
        colorSchemes: {
          capacitaciones: {
            color: 'white',
            backgroundColor: 'orange'
          },
          reunion: {
            color: 'white',
            backgroundColor: 'yellow'
          },
          general: {
            color: 'white',
            backgroundColor: 'green'
          }
        }
      },
      defaultMode: 'month',
      isSilent: true,
      showCurrentTime: true
    })

    function verEvento(evento) {
      // console.log('evento clickado')
      // console.log('evento clickado', evento)
      eventoSeleccionado.value = evento.data
      dialogoVisible.value = true
    }

    async function obtenerEventos() {
      cargando.activar()
      try {
        const response = await new EventoController().listar()
        // console.log(response);
        eventos.value = response.result
        // console.log(eventos);
      } catch (error) {
        console.error('Error al obtener eventos:', error)
      } finally {
        cargando.desactivar()
      }
    }

    function getShortDescription(description: string): string {
      const maxLength = 275 // Ajusta este valor según la longitud deseada
      if (description.length > maxLength) {
        return description.substring(0, maxLength) + '...'
      }
      return description
    }

    function verNoticiaCompleta(
      id: number,
      noticias: Noticia[]
    ): Noticia | null {
      const noticia = noticias.find(noticia => noticia.id === id)
      if (noticia) {
        return noticia
      } else {
        console.error(`Noticia con ID: ${id} no encontrada.`)
        return null
      }
    }

    async function obtenerNoticias() {
      cargando.activar()
      const response = await new NoticiaController().listar({
        'fecha_vencimiento[operator]': '>',
        'fecha_vencimiento[value]': obtenerFechaActual(maskFecha)
      })
      // console.log(response)
      noticias.value = response.result
      cargando.desactivar()
    }

    const documentosIntranet = ref([
      {
        id: 1,
        name: 'Instructivos',
        icon: 'fa-solid fa-book-journal-whills',
        link: 'https://drive.google.com/drive/folders/1Zv3eTjramxByFRht-L5Gz_nrulgFE32V?usp=sharing_eip_m&ts=64386770',
        color: '#FF5733'
      },
      {
        id: 2,
        name: 'Reglamentos y Normativas',
        icon: 'fa-solid fa-book-bookmark',
        link: 'https://drive.google.com/drive/folders/1Zv3eTjramxByFRht-L5Gz_nrulgFE32V?usp=sharing_eip_m&ts=64386770',
        color: '#581845'
      }
    ])

    const readMore = (link: string) => {
      window.open(link, '_blank')
    }

    const currentPage = ref(1)
    const perPage = ref(2)

    function obtenerModulosPermitidos() {
      // Filtrar todos los enlaces permitidos
      modulosPermitidos.value = menuStore.links.filter(
        (link: MenuOption) => link.can
      )
      // Mapear cada enlace para ajustar los enlaces de submenús
      modulosPermitidos.value = modulosPermitidos.value.map(modulo => {
        if (modulo.children && Array.isArray(modulo.children)) {
          // Encontrar el primer enlace permitido en el submenú
          const firstPermittedChild = modulo.children.find(child => child.can)
          if (firstPermittedChild) {
            modulo.link = firstPermittedChild.link
          }
        }
        return modulo
      })
    }

    obtenerModulosPermitidos()

    async function logout() {
      cargando.activar()
      await store.logout()
      Router.replace({ name: 'Login' })
      cargando.desactivar()
    }

    async function consultarEmpleadosDepartamento(departamento_id: number) {
      // console.log(store.user, departamento_id)
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
        // console.log(empleados.value)
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
      // Obtener el mes actual
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
              // Obtener el mes de la fecha de nacimiento
              const birthMonth =
                new Date(empleado.fecha_nacimiento).getMonth() + 1
              return birthMonth === currentMonth
            }
            return false
          })
          .sort((a, b) => {
            // Ordenar por día del mes de nacimiento
            const dayA = new Date(a.fecha_nacimiento).getDate()
            const dayB = new Date(b.fecha_nacimiento).getDate()
            return dayA - dayB
          })
      } catch (err) {
        console.log('Error al obtener empleados cumpleañeros:', err)
      }
    }

    onMounted(() => {
      obtenerEventos()
      obtenerEmpleadosCumpleaneros()
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
        case 'licencias':
          Router.push('/licencia-empleado')
          break
        case 'vacaciones':
          Router.push('/vacacion')
          break
        case 'prestamos':
          Router.push('/solicitud-prestamo-empresarial')
          break
        default:
          notificarError('Solicitud Rechazada, contacta con el Administrador.')
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

    function verNoticiaCompletaHandler(id: number): void {
      const noticia = verNoticiaCompleta(id, noticias.value)
      if (noticia) {
        noticiaCompleta.value = noticia
        modalNoticia.value = true
      }
    }

    //ACCIONES DE BUSQUEDA DE MODULO

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
      departamentoSeleccionado,
      departamentos,
      empleados,
      showDepartamentos,
      modulosPermitidos,
      logout,
      verEvento,
      consultarEmpleadosDepartamento,
      enviarSolicitud,
      limpiarFormulario,
      getShortDescription,
      verNoticiaCompletaHandler,
      width: computed(() => ($q.screen.xs ? '100%' : '450px')),
      selfCenterMiddle,
      showBanner,
      maskFecha,
      formatearFecha,
      readMore,
      documentosIntranet,
      empleadosCumpleaneros,
      fechaActual,
      fechaSeleccionada,
      eventos,
      dialogoVisible,
      eventoSeleccionado,
      noticias,
      noticiaCompleta,
      modalNoticia,
      eventosFormateados,
      configuracion,
      cerrarModal() {
        modalNoticia.value = false
      }
    }
  }
})
