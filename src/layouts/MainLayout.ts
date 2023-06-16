
// Dependencias
import { Notificacion } from 'pages/administracion/notificaciones/domain/Notificacion'
import EssentialLoading from 'components/loading/view/EssentialLoading.vue'
import { useNotificationRealtimeStore } from 'stores/notificationRealtime'
import { defineComponent, ref, computed, Ref, ComputedRef } from 'vue'
import { useAuthenticationStore } from 'src/stores/authentication'
import { LocalStorage, useQuasar } from 'quasar'
import { useMenuStore } from 'src/stores/menu'
import { useRouter } from 'vue-router'
import moment from 'moment'

// Componentes
import ModalesEntidad from 'components/modales/view/ModalEntidad.vue'
import FooterComponent from 'components/FooterComponent.vue'
import EssentialLink from 'components/EssentialLink.vue'

// Logica y controladores
import { ComportamientoModalesMainLayout } from './modales/application/ComportamientoModalesMainLayout'
import { ObtenerIconoNotificacionRealtime } from 'shared/ObtenerIconoNotificacionRealtime'
import { NotificacionesSistema } from './notificacionesSistema/NotificacionesSistema'
import { useMovilizacionSubtareaStore } from 'stores/movilizacionSubtarea'

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
    }
  },
})
