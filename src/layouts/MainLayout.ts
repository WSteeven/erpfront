
// Dependencias
import { Notificacion } from 'pages/administracion/notificaciones/domain/Notificacion'
import EssentialLoading from 'components/loading/view/EssentialLoading.vue'
import { useNotificationRealtimeStore } from 'stores/notificationRealtime'
import { defineComponent, ref, computed, Ref, ComputedRef, watch, watchEffect, createApp } from 'vue'
import { useAuthenticationStore } from 'src/stores/authentication'
import { LocalStorage, useQuasar } from 'quasar'
import { useMenuStore } from 'src/stores/menu'
import { useRoute, useRouter } from 'vue-router'
import Swal from 'sweetalert2'
import dayjs from 'dayjs'
import es from 'dayjs/locale/es'
import relativeTime from 'dayjs/plugin/relativeTime'

// Componentes
import ScrollToTopButton from 'components/buttonSubmits/ScrollToTopButton.vue'
import ModalesEntidad from 'components/modales/view/ModalEntidad.vue'
import FooterComponent from 'components/FooterComponent.vue'
import EssentialLink from 'components/EssentialLink.vue'

// Logica y controladores
import { ComportamientoModalesMainLayout } from './modales/application/ComportamientoModalesMainLayout'
import { ObtenerIconoNotificacionRealtime } from 'shared/ObtenerIconoNotificacionRealtime'
import { NotificacionesSistema } from './notificacionesSistema/NotificacionesSistema'
import { useConfiguracionGeneralStore } from 'stores/configuracion_general'
import { useMovilizacionSubtareaStore } from 'stores/movilizacionSubtarea'
import { useIdle, } from '@vueuse/core'
import { formatearFechaTexto } from 'shared/utils'
import { NotIdle } from 'idlejs'
import { useMainLayoutStore } from 'stores/mainLayout'
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'

export default defineComponent({
  name: 'MainLayout',
  components: {
    EssentialLink,
    EssentialLoading,
    FooterComponent,
    ModalesEntidad,
    ScrollToTopButton,
  },

  setup() {
    const leftDrawerOpen = ref(false)
    const menu = useMenuStore()

    const menuVisible = ref(false)

    /*********
     * Stores
     *********/
    const authenticationStore = useAuthenticationStore()
    const movilizacionSubtareaStore = useMovilizacionSubtareaStore()
    const configuracionGeneralStore = useConfiguracionGeneralStore()
    const mainLayoutStore = useMainLayoutStore()

    /*******
     * Init
     *******/
    if (authenticationStore.esTecnico) movilizacionSubtareaStore.getSubtareaDestino(authenticationStore.user.id)

    /***************************
     * Permitir Notificaciones push
     ***************************/
    if ('Notification' in window) {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          // console.log('Permiso de notificación concedido.');
        } else {
          console.log('Permiso de notificación denegado.');
        }
      });
    }

    dayjs.extend(relativeTime)
    dayjs.locale(es)



    /************
     * Variables
     ************/
    const cargando = new StatusEssentialLoading()
    const Router = useRouter()
    const route = useRoute()
    const tituloPagina = computed(() => mainLayoutStore.tituloPagina)
    const grupo = authenticationStore.user?.grupo

    const saldo = computed(() => {
      authenticationStore.consultar_saldo_actual()
      return `${authenticationStore.saldo_actual ?? 0} `
    })

    const nombreUsuario = computed(() => {
      const usuario = authenticationStore.user
      if (usuario) {
        return `${usuario.nombres} ${usuario.apellidos ?? ''} `
      }
      return ''
    })

    async function logout() {
      cargando.activar()
      await authenticationStore.logout()
      Router.replace({ name: 'Login' })
      cargando.desactivar()
    }

    const $q = useQuasar()

    const modoOscuro = ref(LocalStorage.getItem('dark') ?? false)

    $q.dark.set(Boolean(modoOscuro.value))

    function toggleDarkMode() {
      $q.dark.set(Boolean(modoOscuro.value))
      LocalStorage.set('dark', modoOscuro.value)
    }

    /**********************************************
     * PUSHER
     * En esta sección agregan todas las llamadas al metodo start de sus archivos PusherEvent
     **********************************************/
    const notificacionesSistema = new NotificacionesSistema()
    notificacionesSistema.init()

    //Poner la imagen de perfil
    const imagenPerfil = authenticationStore.user.foto_url // `https://ui-avatars.com/api/?name=${authenticationStore.user.nombres.substr(0, 1)}+${authenticationStore.user.apellidos.substr(0, 1)}&bold=true&background=0879dc28&color=0879dc`

    const notificacionesPusherStore = useNotificationRealtimeStore()
    const obtenerIconoNotificacion = new ObtenerIconoNotificacionRealtime()

    notificacionesPusherStore.listar() //cargar las notificaciones de la base de datos

    //configuracion de las notificaciones
    const notificaciones: Ref<Notificacion[]> = computed(
      () => notificacionesPusherStore.listadoNotificaciones
    )

    const notificacionesAgrupadas: any = computed(
      () => agruparYOrdenarNotificacionesPorTipo(notificacionesPusherStore.listadoNotificaciones)
    )

    function agruparYOrdenarNotificacionesPorTipo(notificaciones) {
      const grupos = {}

      notificaciones.forEach((notificacion) => {
        const tipo = notificacion.tipo_notificacion
        if (!grupos[tipo]) {
          grupos[tipo] = []
        }
        grupos[tipo].push(notificacion)
      })

      // Ordenar las notificaciones dentro de cada grupo según el campo 'tipo'
      const tiposOrdenados = Object.keys(grupos).sort()

      const notificacionesAgrupadasYOrdenadas = {}
      tiposOrdenados.forEach((tipo) => {
        notificacionesAgrupadasYOrdenadas[tipo] = grupos[tipo]
      })

      return notificacionesAgrupadasYOrdenadas
    }

    async function marcarLeida(id) {
      notificacionesPusherStore.idNotificacion = id
      await notificacionesPusherStore.marcarLeida()
    }

    type tipo = 'center middle' | 'top start'
    const selfCenterMiddle: ComputedRef<tipo> = computed(() =>
      $q.screen.xs ? 'center middle' : 'top start'
    )

    /**********
    * Modales
    **********/
    const modales = new ComportamientoModalesMainLayout()

    function abrirMovilizacionSubtarea() {
      modales.abrirModalEntidad('MovilizacionSubtareaPage')
    }

    function abrirTransferirTareas() {
      modales.abrirModalEntidad('TranferirTareaPage')
    }

    const enCamino = computed(() => movilizacionSubtareaStore.subtareaDestino)
    const motivo = computed(() => movilizacionSubtareaStore.motivo)


    /**
     * Este código es responsable de manejar la inactividad del usuario y cerrar sesión después de un
     * cierto período de tiempo.
     */
    const tiempoInactividad = 10 * 60 * 1000 //10 minutos de inactividad
    // let mouseActivo = true
    // const mostrarAlertaInactividad = computed(() => {
    //   return (tiempoInactividad / 1000) - idledFor.value < 10 //true cuando sean 10 segundos restantes
    // })
    const { idle, lastActive } = useIdle(tiempoInactividad) //5 minutos de inactividad
    // const now = useTimestamp({ interval: 1000 })
    // const idledFor = computed(() => Math.floor((now.value - lastActive.value) / 1000),) //Tiempo de inactividad transcurrido en segundos 1,2,3...,n
    // const ultimaConexion = LocalStorage.getItem('ultima_conexion')
    /*
    watch(idle, () => {
      if (idle.value === true) {
        console.log('Se cierra la sesión por inactividad, ultima conexion: ' + formatearFechaTexto(lastActive.value) + ' ' + new Date(lastActive.value).toLocaleTimeString('en-US'))
        LocalStorage.set('ultima_conexion', formatearFechaTexto(lastActive.value) + ' ' + new Date(lastActive.value).toLocaleTimeString('en-US'))
        notificarAdvertencia('Se ha cerrado la sesión por inactividad, por favor vuelve a iniciar sesión.')
        Swal.fire({
          icon: 'error',
          title: 'Has excedido el tiempo de inactividad',
          text: 'Se ha cerrado la sesión por exceder tiempo de inactividad, por favor vuelve a iniciar sesión.',
          confirmButtonColor: '#0879dc',
        })
        logout()
      }
    })
    */
    if (authenticationStore.user) {
      const notIdle = new NotIdle()
        .whenInteractive()
        .within(60, 1000) // un minuto
        .do(() => {
          // console.log('ultima actividad', new Date().getTime().toString(), new Date().toLocaleTimeString())
          LocalStorage.set('lastActivity', new Date().getTime().toString())
        })
        .start()
      // const LIMIT = 60 * 60 * 1000 // 60 minutes for logout session
      const LIMIT = 4 * 60 * 60 * 1000 // 4 horas for logout session
      setInterval(() => {
        if (authenticationStore.user) {
          let la = new Date(JSON.parse(LocalStorage.getItem('lastActivity')!)).getTime()
          // console.log('Resta de tiempo', new Date().getTime() - la)
          // console.log('Tiempo limite', LIMIT)
          // console.log('Resultado', new Date().getTime() - la > LIMIT, new Date().toLocaleTimeString())
          if (new Date().getTime() - la > LIMIT) {
            logout()
            LocalStorage.remove('lastActivity')
            LocalStorage.set('ultima_conexion', formatearFechaTexto(lastActive.value) + ' ' + new Date(lastActive.value).toLocaleTimeString('en-US'))
            Swal.fire({
              icon: 'error',
              title: 'Has excedido el tiempo de inactividad',
              text: 'Se ha cerrado la sesión por exceder tiempo de inactividad, por favor vuelve a iniciar sesión.',
              confirmButtonColor: '#0879dc',
            })
          }
        }
      }, 60000) //comprobar cada minuto
    } else {
      LocalStorage.remove('lastActivity')
    }

    // Establecer favicon
    configuracionGeneralStore.consultarConfiguracion().then(() =>
      configuracionGeneralStore.cambiarFavicon())

    // Titulo pagina
    const nombreEmpresa = computed(() => configuracionGeneralStore.configuracion?.nombre_empresa)
    watchEffect(() => document.title = (notificaciones.value.length ? `(${notificaciones.value.length})` : '') + ' ' + nombreEmpresa.value)

    return {
      // logoClaro: `${process.env.API_URL}/storage/configuracion_general/logo_claro.jpeg`,
      logoClaro: computed(() => configuracionGeneralStore.configuracion?.logo_claro),
      logoOscuro: computed(() => configuracionGeneralStore.configuracion?.logo_oscuro),
      enCamino,
      motivo,
      modales,
      abrirMovilizacionSubtarea,
      abrirTransferirTareas,
      links: menu.links,
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value
      },
      logout,
      nombreUsuario,
      saldo,
      menuVisible,
      modoOscuro,
      toggleDarkMode,
      width: computed(() => ($q.screen.xs ? '100%' : '450px')),
      mostrarMenu: ref(false),
      mostrarNotificaciones: ref(false),
      mostrarOpciones: ref(false),
      notificaciones,
      marcarLeida,
      ordenarNotificaciones() {
        notificaciones.value.sort((a: Notificacion, b: Notificacion) => {
          return b.id! - a.id!
        })
      },
      dayjs,
      obtenerIcono: obtenerIconoNotificacion,
      imagenPerfil,
      selfCenterMiddle,
      grupo,
      mostrarTransferirTareas: authenticationStore.esCoordinador || authenticationStore.esJefeTecnico,
      notificacionesAgrupadas,
      tituloPagina,
      // idledFor,
      // tiempoInactividad,
      // mostrarAlertaInactividad,
      // ultimaConexion,
    }
  },
})
