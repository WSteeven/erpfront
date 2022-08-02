// Dependencias
import {computed, defineComponent} from "@vue/runtime-core"
import {useStore} from "vuex"
// Componentes
import SidebarMenuItem from "@shared/componentes/theSidebar/theSidebarMenuItem/TheSidebarMenuItem.vue"
// Logica y controladores
import {SesionUsuario} from "@/router/sesionUsuario"
import {Cargando} from "../cargando/application/cargando.application"
import {LoginController} from "@/@app/sistema/authentication/login/infraestructure/login.controller"

export default defineComponent({
  name: "Sidebar",
  components: {SidebarMenuItem},
  setup() {
    const store = useStore()
    const menu = store.state.menuOptions.menu

    const collapsed = computed(() => store.state.sidebar.collapsed)
    const sidebarWidth = computed(() => store.getters["sidebar/sidebarWidth"])
    const toggleSidebar = () => store.dispatch("sidebar/toggleSidebar")

    const sesionUsuario = SesionUsuario.getInstance()
    const mostrarMisNegocios = () => {
      sesionUsuario.resetearNegocioSeleccionado()
    }

    const cargando = new Cargando()
    const logout = async () => {
      cargando.activar()
      const loginController = new LoginController()
      SesionUsuario.getInstance().resetearNegocioSeleccionado()
      await loginController.logout()
      cargando.desactivar()
    }

    const nombreUsuario = computed(() => {
      const usuario = sesionUsuario.obtenerInformacionUsuario()
      if (usuario) {
        return `${usuario.name[0]}. ${usuario.lastname} `
      }
      return ""
    })

    return {
      menu,
      collapsed,
      sidebarWidth,
      mostrarMisNegocios,
      nombreUsuario,
      // funciones
      toggleSidebar,
      logout,
    }
  },
})
