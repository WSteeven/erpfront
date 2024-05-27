// Dependencias
import EssentialLoading from 'components/loading/view/EssentialLoading.vue'
import { defineComponent, ref, computed, ComputedRef, onMounted } from 'vue'
import { useAuthenticationExternalStore } from 'src/stores/authenticationExternal'

import { LocalStorage, useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
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
import { useConfiguracionGeneralStore } from 'stores/configuracion_general'
import { useIdle } from '@vueuse/core'
import {
  formatearFechaTexto,
  isAxiosError,
  notificarMensajesError,
} from 'shared/utils'
import { NotIdle } from 'idlejs'
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { useMenuPostulanteStore } from 'stores/menuPostulante'
import { LoginPostulanteController } from 'src/pages/recursosHumanos/seleccion_contratacion_personal/login-postulante/infraestructure/LoginPostulanteController'

export default defineComponent({
  name: 'PostulanteLayout',
  components: {
    EssentialLink,
    EssentialLoading,
    FooterComponent,
    ModalesEntidad,
    ScrollToTopButton,
  },

  setup() {
    const leftDrawerOpen = ref(false)
    const menu = useMenuPostulanteStore()

    const menuVisible = ref(false)
    /*********
     * Stores
     *********/
    const authenticationStore = useAuthenticationExternalStore()
    const configuracionGeneralStore = useConfiguracionGeneralStore()

    /*******
     * Init
     *******/

    dayjs.extend(relativeTime)
    dayjs.locale(es)

    /************
     * Variables
     ************/
    const cargando = new StatusEssentialLoading()
    const Router = useRouter()
    //const grupo = authenticationStore.user.grupo

    const logoClaro = computed(
      () => configuracionGeneralStore.configuracion?.logo_claro
    )
    const logoOscuro = computed(
      () => configuracionGeneralStore.configuracion?.logo_oscuro
    )
    const isMount = ref(false)
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
      Router.replace({ name: 'LoginPostulante' })
      cargando.desactivar()
    }

    const $q = useQuasar()

    const modoOscuro = ref(LocalStorage.getItem('dark') ?? false)

    $q.dark.set(Boolean(modoOscuro.value))

    function toggleDarkMode() {
      $q.dark.set(Boolean(modoOscuro.value))
      LocalStorage.set('dark', modoOscuro.value)
    }
    //Poner la imagen de perfil
    const imagenPerfil = computed(() => {
      const usuario = authenticationStore.user
      if (usuario) {
        return `https://ui-avatars.com/api/?name=${usuario.nombres.substr(0,1)}+${usuario.apellidos.substr(0,1)}&bold=true&background=0879dc28&color=0879dc`
      }
      return ' '
    })
    onMounted(async () => {
      try {
        cargando.activar()
        const token = LocalStorage.getItem('token')
        if (token == null) {
          const loginController = new LoginPostulanteController()
          await loginController.obtenerSesionUser()
          isMount.value = true
        }
      } catch (error: any) {
        console.log('montar errror', error)
        if (isAxiosError(error)) {
          const mensajes: string[] = error.erroresValidacion
          console.log('montar errror', error.mensaje)
          //notificarMensajesError(mensajes, notificaciones)
        }
      } finally {
        cargando.desactivar()
      }
    })

    type tipo = 'center middle' | 'top start'
    const selfCenterMiddle: ComputedRef<tipo> = computed(() =>
      $q.screen.xs ? 'center middle' : 'top start'
    )

    /**********
     * Modales
     **********/
    const modales = new ComportamientoModalesMainLayout()

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
          const la = new Date(
            JSON.parse(LocalStorage.getItem('lastActivity')!)
          ).getTime()
          // console.log('Resta de tiempo', new Date().getTime() - la)
          // console.log('Tiempo limite', LIMIT)
          // console.log('Resultado', new Date().getTime() - la > LIMIT, new Date().toLocaleTimeString())
          if (new Date().getTime() - la > LIMIT) {
            logout()
            LocalStorage.remove('lastActivity')
            LocalStorage.set(
              'ultima_conexion',
              formatearFechaTexto(lastActive.value) +
                ' ' +
                new Date(lastActive.value).toLocaleTimeString('en-US')
            )
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
    configuracionGeneralStore
      .consultarConfiguracion()
      .then(() => configuracionGeneralStore.cambiarFavicon())

    return {
      isMount,
      logoClaro,
      logoOscuro,
      modales,
      links: menu.links,
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value
      },
      logout,
      nombreUsuario,
      menuVisible,
      modoOscuro,
      toggleDarkMode,
      width: computed(() => ($q.screen.xs ? '100%' : '450px')),
      mostrarMenu: ref(false),
      mostrarNotificaciones: ref(false),
      mostrarOpciones: ref(false),
      dayjs,
      imagenPerfil,
      selfCenterMiddle,
      mostrarTransferirTareas:
        authenticationStore.esCoordinador || authenticationStore.esJefeTecnico,
    }
  },
})
