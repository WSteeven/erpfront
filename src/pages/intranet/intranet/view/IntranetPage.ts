//Dependencies
import relativeTime from 'dayjs/plugin/relativeTime'
import es from 'dayjs/locale/es'
import dayjs from 'dayjs'

import { useAuthenticationStore } from 'stores/authentication'
import loginJson from 'src/assets/lottie/welcome.json'
import {
  computed,
  ComputedRef,
  defineComponent,
  onMounted,
  reactive,
  Ref,
  ref
} from 'vue'
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
import { useQuasar } from 'quasar'
import confetti from 'canvas-confetti'
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { useRouter } from 'vue-router'
import { useMenuStore } from 'stores/menu'
import {
  getShortDescription as acortarDescripcion,
  obtenerFechaActual
} from 'shared/utils'
import { MenuOption } from 'shared/menu/MenuOption'
import { NoticiaController } from 'pages/intranet/noticias/infraestructure/NoticiaController'
import { EventoController } from 'pages/intranet/eventos/infraestructure/EventoController'
import { VacanteController } from 'pages/recursosHumanos/SeleccionContratacionPersonal/vacantes/infraestructure/VacanteController'

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
    Qalendar
  },

  setup() {
    const tabsOptions = {
      NOTICIAS: 'Noticias',
      MIS_MODULOS: 'Mis módulos',
      DEPARTAMENTOS: 'Departamentos',
      EVENTOS: 'Eventos',
      AREA_PERSONAL: 'Área personal',
    }
    const tabs = ref(tabsOptions.NOTICIAS)
    const departamentos: Ref<Departamento[]> = ref([])
    const departamentoSeleccionado = 1
    const empleados: Ref<Empleado[]> = ref([])

    const usuarios = 20
    const carousel_noticias = ref(0)
    const carousel_vacantes = ref(0)
    const carousel_extensiones = ref(0)
    const activeTab = ref(0)

    const modalNoticia = ref(false)
    const isCumpleanerosModalOpen = ref<boolean>(false)

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

    const vacantesDisponibles = ref()
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
        scrollToHour: 24
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
            backgroundColor: 'orange'
          }
        }
      },
      defaultMode: 'month',
      isSilent: true,
      showCurrentTime: true
    })

    const router = useRouter()
    //dayjs en español
    dayjs.extend(relativeTime)
    dayjs.locale(es)

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
    async function obtenerVacantes() {
      try {
        vacantesDisponibles.value = (
          await new VacanteController().listar({
            activo: 1,
            'fecha_caducidad[operator]': '>=',
            'fecha_caducidad[value]': obtenerFechaActual(maskFecha)
          })
        ).result
      } catch (error: any) {
        notificarError('Error al obtener las vacantes disponibles')
      }
    }
    async function visualizarVacante() {
      // console.log("Diste clic en visualizar vacante", vacante)
      await router.push('puestos-disponibles')
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
      try {
        cargando.activar()

        // Obtener el ID del departamento del usuario logueado
        const departamentoUsuario = store.user.departamento

        // Verificamos si el ID del departamento es válido
        if (!departamentoUsuario) {
          throw new Error('No se encontró el departamento del usuario logueado')
        }

        // Consultamos todas las noticias
        const response = await new NoticiaController().listar({
          'fecha_vencimiento[operator]': '>',
          'fecha_vencimiento[value]': obtenerFechaActual(maskFecha)
        })

        // Filtramos las noticias para mostrar las que son para todos (departamentos_destinatarios es NULL)
        // o las que están destinadas al departamento del usuario
        const noticiasFiltradas = response.result.filter(noticia => {
          return (
            noticia.departamentos_destinatarios === null || // Noticias para todos
            noticia.departamentos_destinatarios.includes(departamentoUsuario) // Noticias específicas para el departamento del usuario
          )
        })

        // Asignamos las noticias filtradas
        noticias.value = noticiasFiltradas
      } catch (error) {
        console.error('Error obteniendo noticias:', error)
      } finally {
        cargando.desactivar()
      }
    }

    const documentosIntranet = ref([
      {
        id: 1,
        name: 'Instructivos',
        icon: 'fa-solid fa-book-journal-whills',
        link: 'https://drive.google.com/drive/folders/1ILsatqtyrkV5tfofM2cTinLOfhIQMO-h?usp=drive_link',
        color: '#FF5733'
      },
      {
        id: 2,
        name: 'Reglamentos y Normativas',
        icon: 'fa-solid fa-book-bookmark',
        link: 'https://drive.google.com/drive/folders/1k7WjBVUbYf4FY5wX0xoUP8r5gvWNA64e?usp=sharing',
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
      await Router.replace({ name: 'Login' })
      cargando.desactivar()
    }

    async function consultarEmpleadosDepartamento(departamento_id: number) {
      // console.log(store.user, departamento_id)
      try {
        cargando.activar()
        const idNumerico = Number(departamento_id)

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
      const respuesta = await departamentoController.listar({ activo: 1 })

      // Ocultar departamento de Gerencia
      departamentos.value = respuesta.result.filter(
        departamento => departamento.id !== 9
      )
    }

    consultarDepartamentos()

    const empleadosCumpleaneros = ref<Empleado[]>([])
    const empleadosConExtension = ref<Empleado[]>([])


    const obtenerEmpleadosConExtension = async () => {
      try {
        const empleadoController = new EmpleadoController()
        const empleados = (
          await empleadoController.listar({
            estado: 1
          })
        ).result

        empleadosConExtension.value = empleados.filter((empleado: Empleado) => {
          // Verifica que el campo extensión no sea nulo, undefined o vacío
          return empleado.extension !== null && empleado.extension !== undefined
        })

        console.log(empleadosConExtension.value)
      } catch (err) {
        console.log('Error al obtener empleados con extensión:', err)
      }
    }

    const obtenerEmpleadosCumpleaneros = async () => {
      // Obtener el mes actual
      const currentMonth = new Date().getUTCMonth()
      console.log(currentMonth)

      try {
        const empleadoController = new EmpleadoController()
        const empleados = (
          await empleadoController.listar({
            estado: 1
          })
        ).result

        empleadosCumpleaneros.value = empleados
          .filter((empleado: Empleado) => {
            if (empleado.fecha_nacimiento) {
              // Obtener el mes de la fecha de nacimiento
              const birthMonth = new Date(
                empleado.fecha_nacimiento
              ).getUTCMonth()
              return birthMonth === currentMonth
            }
            return false
          })
          .sort((a, b) => {
            // Asegurarse de comparar solo el día, sin considerar la hora
            const dayA = new Date(a.fecha_nacimiento).getUTCDate() // Usar getUTCDate()
            const dayB = new Date(b.fecha_nacimiento).getUTCDate()
            return dayA - dayB
          })

        console.log(empleadosCumpleaneros.value)
      } catch (err) {
        console.log('Error al obtener empleados cumpleañeros:', err)
      }
    }

    // Función para calcular el tiempo de trabajo del empleado
    const calcularAntiguedad = (fechaVinculacion: string): string => {
      const hoy = new Date()
      const vinculacion = new Date(fechaVinculacion)
      const diffAnios = hoy.getFullYear() - vinculacion.getFullYear()
      const diffMeses = hoy.getMonth() - vinculacion.getMonth()

      // Ajustar los meses si son negativos
      const anios = diffMeses < 0 ? diffAnios - 1 : diffAnios
      const meses = (diffMeses + 12) % 12

      // Condicionar la inclusión de "años" y "meses"
      const partes: string[] = []

      if (anios > 0) {
        partes.push(`${anios} ${anios === 1 ? 'año' : 'años'}`)
      }

      if (meses > 0) {
        partes.push(`${meses} ${meses === 1 ? 'mes' : 'meses'}`)
      }

      // Si no hay años ni meses, devolvemos "menos de un mes"
      return partes.length > 0 ? partes.join(' y ') : 'menos de un mes'
    }

    // Función para calcular la edad que el empleado cumplirá este año
    const calcularEdadEsteAno = (fechaNacimiento: string): number => {
      const hoy = new Date()
      const nacimiento = new Date(fechaNacimiento)
      // Restar el año actual del año de nacimiento
      return hoy.getFullYear() - nacimiento.getFullYear()
    }

    const selectedEmpleado = ref<Empleado | null>(null)

    async function openCumpleanerosModal(empleado: Empleado) {
      selectedEmpleado.value = empleado
      isCumpleanerosModalOpen.value = true
      // Llama a confetti para disparar el confeti
      confetti({
        // Configuración para asegurarse de que el confeti se muestre sobre el modal
        zIndex: 9999, // Asegúrate de que este z-index sea mayor que el del modal
        particleCount: 100,
        spread: 70,
        startVelocity: 30
      })
    }

    onMounted(() => {
      obtenerEventos()
      obtenerVacantes()
      obtenerEmpleadosCumpleaneros()
      obtenerEmpleadosConExtension()
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
          Router.push('/solicitudes-vacaciones')
          break
        case 'prestamos':
          Router.push('/solicitud-prestamo-empresarial')
          break
        default:
          notificarError('Solicitud Rechazada, contacta con el Administrador.')
      }
    }

    const lorem =
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
    const selfCenterMiddle: ComputedRef<'center middle' | 'top start'> =
      computed(() => ($q.screen.xs ? 'center middle' : 'top start'))

    const getImagePerfil = usuario => {
      return usuario.foto_url == null
        ? `https://ui-avatars.com/api/?name=${usuario.nombres.slice(
          0,
          1
        )}+${usuario.apellidos.slice(
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
      correo: computed(() => 'https://' + configuracionGeneralStore.configuracion?.sitio_web + '/webmail'),

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
      carousel_vacantes,
      carousel_extensiones,
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
      vacantesDisponibles,
      acortarDescripcion,
      logout,
      verEvento,
      consultarEmpleadosDepartamento,
      enviarSolicitud,
      getShortDescription,
      verNoticiaCompletaHandler,
      width: computed(() => ($q.screen.xs ? '100%' : '450px')),
      selfCenterMiddle,
      showBanner,
      maskFecha,
      dayjs,
      visualizarVacante,
      readMore,
      documentosIntranet,
      empleadosCumpleaneros,
      empleadosConExtension,
      fechaActual,
      fechaSeleccionada,
      eventos,
      dialogoVisible,
      eventoSeleccionado,
      noticias,
      noticiaCompleta,
      modalNoticia,
      isCumpleanerosModalOpen,
      openCumpleanerosModal,
      selectedEmpleado,

      calcularAntiguedad,
      calcularEdadEsteAno,

      eventosFormateados,
      configuracion,
      cerrarModal() {
        modalNoticia.value = false
      },
      tabs,
      tabsOptions,
      tabsMenu: [tabsOptions.NOTICIAS,
      tabsOptions.MIS_MODULOS,
      tabsOptions.DEPARTAMENTOS,
      tabsOptions.EVENTOS,
      tabsOptions.AREA_PERSONAL],
    }
  }
})
