
// Dependencias
import { Notificacion } from 'pages/administracion/notificaciones/domain/Notificacion'
import EssentialLoading from 'components/loading/view/EssentialLoading.vue'
import { useNotificationRealtimeStore } from 'stores/notificationRealtime'
import { defineComponent, ref, computed, Ref, ComputedRef, watch, watchEffect } from 'vue'
import { useAuthenticationStore } from 'src/stores/authentication'
import { LocalStorage, SessionStorage, useQuasar } from 'quasar'
import { useMenuStore } from 'src/stores/menu'
import { useRoute, useRouter } from 'vue-router'
import moment from 'moment'
import Swal from 'sweetalert2'


// Componentes
import ModalesEntidad from 'components/modales/view/ModalEntidad.vue'
import FooterComponent from 'components/FooterComponent.vue'
import EssentialLink from 'components/EssentialLink.vue'

// Logica y controladores
import { ComportamientoModalesMainLayout } from './modales/application/ComportamientoModalesMainLayout'
import { ObtenerIconoNotificacionRealtime } from 'shared/ObtenerIconoNotificacionRealtime'
import { NotificacionesSistema } from './notificacionesSistema/NotificacionesSistema'
import { useMovilizacionSubtareaStore } from 'stores/movilizacionSubtarea'
import { useNotificaciones } from 'shared/notificaciones'
import { useIdle, useTimestamp } from '@vueuse/core'
import { formatearFechaTexto } from 'shared/utils'
import { Idle, NotIdle } from 'idlejs'

export default defineComponent({
  name: 'MainLayout',
  components: {
    EssentialLink,
    EssentialLoading,
    FooterComponent,
    ModalesEntidad,
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

    /*******
     * Init
     *******/
    if (authenticationStore.esTecnico) movilizacionSubtareaStore.getSubtareaDestino(authenticationStore.user.id)

    /************
     * Variables
     ************/
    const Router = useRouter()
    const route = useRoute()
    const { notificarAdvertencia } = useNotificaciones()
    const grupo = authenticationStore.user.grupo

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
      await authenticationStore.logout()
      Router.replace({ name: 'Login' })
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
    const imagenPerfil = `https://ui-avatars.com/api/?name=${authenticationStore.user.nombres.substr(0, 1)}+${authenticationStore.user.apellidos.substr(0, 1)}&bold=true&background=0879dc28&color=0879dc`

    const notificacionesPusherStore = useNotificationRealtimeStore()
    const obtenerIconoNotificacion = new ObtenerIconoNotificacionRealtime()

    notificacionesPusherStore.listar() //cargar las notificaciones de la base de datos

    //configuracion de las notificaciones
    const notificaciones: Ref<Notificacion[]> = computed(
      () => notificacionesPusherStore.listadoNotificaciones
    )

    watchEffect(() => document.title = (notificaciones.value.length ? `(${notificaciones.value.length})` : '') + ' JPCONSTRUCRED')

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
    // const tiempoInactividad = 10 * 60 * 1000 //10 minutos de inactividad
    // let mouseActivo = true
    // const mostrarAlertaInactividad = computed(() => {
    //   return (tiempoInactividad / 1000) - idledFor.value < 10 //true cuando sean 10 segundos restantes
    // })
    // const { idle, lastActive } = useIdle(tiempoInactividad) //5 minutos de inactividad
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
    /* const notIdle = new NotIdle()
      .whenInteractive()
      .within(5, 1000)
      .do(() => {
        console.log('ultima actividad', new Date().getTime().toString(), new Date().toLocaleTimeString())
        sessionStorage.setItem('lastActivity', new Date().getTime().toString())
      })
      .start()
    const LIMIT = 60 * 60 * 1000 // 60 minutes for logout session
    setInterval(() => {
      let la = new Date(+sessionStorage.getItem('lastActivity')!).getTime()
      console.log('Resta de tiempo', new Date().getTime() - la)
      console.log('Tiempo limite', LIMIT)
      console.log('Resultado', new Date().getTime() - la > LIMIT, new Date().toLocaleTimeString())
      if (new Date().getTime() - la > LIMIT) {
        logout()
        sessionStorage.removeItem('lastActivity')
        LocalStorage.set('ultima_conexion', formatearFechaTexto(lastActive.value) + ' ' + new Date(lastActive.value).toLocaleTimeString('en-US'))
        Swal.fire({
          icon: 'error',
          title: 'Has excedido el tiempo de inactividad',
          text: 'Se ha cerrado la sesión por exceder tiempo de inactividad, por favor vuelve a iniciar sesión.',
          confirmButtonColor: '#0879dc',
        })
      }
    }, 60000) //comprobar cada minuto 
    */

    return {
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
      width: computed(() => ($q.screen.xs ? '100%' : '350px')),
      mostrarMenu: ref(false),
      mostrarNotificaciones: ref(false),
      notificaciones,
      marcarLeida,
      ordenarNotificaciones() {
        notificaciones.value.sort((a: Notificacion, b: Notificacion) => {
          return b.id! - a.id!
        })
      },
      moment,
      obtenerIcono: obtenerIconoNotificacion,
      imagenPerfil,
      selfCenterMiddle,
      grupo,
      mostrarTransferirTareas: authenticationStore.esCoordinador || authenticationStore.esJefeTecnico,

      // idledFor,
      // tiempoInactividad,
      // mostrarAlertaInactividad,
      // ultimaConexion,
    }
  },
})
