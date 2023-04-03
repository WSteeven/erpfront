
// Dependencias
import { Notificacion } from 'pages/administracion/notificaciones/domain/Notificacion'
import EssentialLoading from 'components/loading/view/EssentialLoading.vue'
import { useNotificationRealtimeStore } from 'stores/notificationRealtime'
import { useAuthenticationStore } from 'src/stores/authentication'
import { defineComponent, ref, computed, Ref, ComputedRef } from 'vue'
import { LocalStorage, useQuasar } from 'quasar'
import { useMenuStore } from 'src/stores/menu'
import { useRouter } from 'vue-router'
import moment from 'moment'
// import { useNotificaciones } from 'shared/notificaciones'

// Componentes
import EssentialLink from 'components/EssentialLink.vue'
import FooterComponent from 'components/FooterComponent.vue'
import ModalesEntidad from 'components/modales/view/ModalEntidad.vue'

// Logica y controladores
import { GastoPusherEvent } from 'pages/fondosRotativos/gasto/application/GastoPusherEvent'
import { ObtenerIconoNotificacionRealtime } from 'shared/ObtenerIconoNotificacionRealtime'
import { PedidoPusherEvent } from 'pages/bodega/pedidos/application/PedidoPusherEvent'
import { ComportamientoModalesMainLayout } from './modales/application/ComportamientoModalesMainLayout'
import { useMovilizacionSubtareaStore } from 'stores/movilizacionSubtarea'
import { TransferenciaSaldoPusherEvent } from 'pages/fondosRotativos/autorizarTransferencia/application/TransferenciaSaldoPusherEvent'
import { GastoCoordinadorPusherEvent } from 'pages/fondosRotativos/gastoCoordinador/application/GastoCoordinadorPusherEvent'
import { EgresoPusherEvent } from 'pages/bodega/transacciones/modules/transaccionEgreso/application/EgresoPusherEvent'

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
    movilizacionSubtareaStore.getSubtareaDestino(authenticationStore.user.id)

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
    // Pedidos
    const pedidoPusherEvent = new PedidoPusherEvent()
    pedidoPusherEvent.start()
    //Egresos
    const egresoPusherEvent = new EgresoPusherEvent()
    egresoPusherEvent.start()
    //subtareas

    // Fondos rotativos
    const fondosRotativoPusherEvent = new GastoPusherEvent()
    fondosRotativoPusherEvent.start()

    // Saldos
    const transferenciaSaldoPusherEvent = new TransferenciaSaldoPusherEvent();
    transferenciaSaldoPusherEvent.start();

    // Solicitud de fondos

    const solicitudFondosPusherEvent = new GastoCoordinadorPusherEvent();
    solicitudFondosPusherEvent.start();

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
      console.log('abriendo...')
      modales.abrirModalEntidad('MovilizacionSubtareaPage')
      // modales.abierto.value = true
    }

    const enCamino = computed(() => movilizacionSubtareaStore.subtareaDestino)
    const motivo = computed(() => movilizacionSubtareaStore.motivo)

    return {
      enCamino,
      motivo,
      modales,
      abrirMovilizacionSubtarea,
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
    }
  },
})
