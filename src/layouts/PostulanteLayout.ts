// Dependencias
import EssentialLoading from 'components/loading/view/EssentialLoading.vue'
import { defineComponent, ref, computed, ComputedRef, onMounted } from 'vue'
import { useAuthenticationExternalStore } from 'src/stores/authenticationExternal'

import { LocalStorage, useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
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
import { isAxiosError } from 'shared/utils'
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { useMenuPostulanteStore } from 'stores/menuPostulante'
import { LoginPostulanteController } from 'src/pages/recursosHumanos/seleccion_contratacion_personal/login-postulante/infraestructure/LoginPostulanteController'
import { userIsAuthenticated } from 'shared/helpers/verifyAuthenticatedUser'

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
    const {autenticado} = userIsAuthenticated()

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
        return `https://ui-avatars.com/api/?name=${usuario.nombres.substr(0, 1)}+${usuario.apellidos.substr(0, 1)}&bold=true&background=0879dc28&color=0879dc`
      }
      return ' '
    })
    onMounted(async () => {
      try {
        cargando.activar()
        const token = LocalStorage.getItem('token')
        if (token === undefined) {
          const loginController = new LoginPostulanteController()
          await loginController.obtenerSesionUser()
        }
      } catch (error: any) {
        console.log('montar errror', error)
        if (isAxiosError(error)) {
          // const mensajes: string[] = error.erroresValidacion
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



    // Establecer favicon
    configuracionGeneralStore
      .consultarConfiguracion()
      .then(() => configuracionGeneralStore.cambiarFavicon())

    return {
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

      autenticado,
    }
  },
})
