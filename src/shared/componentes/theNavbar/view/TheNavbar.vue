<template>
  <nav class="navbar navbar-expand-md navbar-light position-sticky sticky-top">
    <div class="container-fluid">
      <span class="navbar-brand collapse-icon" @click="toggleSidebar">
        <img
          v-show="negocioSeleccionado"
          src="img/burger.svg"
          alt=""
          :class="{invisible: !collapsed && versionMobile}"
        />
      </span>

      <div>
        <ul class="navbar-nav ms-auto">
          <!-- Search icon -->
          <li v-show="negocioSeleccionado" class="nav-item opciones-navbar">
            <a class="nav-link" @click="toggleSearchBar">
              <i class="bi bi-search"></i>
            </a>
          </li>
          <!-- Dropdown -->
          <li
            class="nav-item dropdown opciones-navbar"
            :class="{
              'd-none': !versionMobile || negocioSeleccionado,
              'd-md-block': !versionMobile,
            }"
          >
            <a
              class="nav-link dropdown-toggle fw-bold"
              href="#"
              id="navbarDarkDropdownMenuLink"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              {{ nombreUsuario }}
            </a>
            <!-- Dropdown content -->
            <ul
              class="dropdown-menu dropdown-menu-end"
              aria-labelledby="navbarDarkDropdownMenuLink"
            >
              <li v-show="negocioSeleccionado">
                <router-link
                  :to="{name: 'PerfilUsuario'}"
                  class="dropdown-item"
                >
                  <i class="bi bi-person"></i> Perfil
                </router-link>
              </li>
              <li v-show="negocioSeleccionado">
                <router-link
                  class="dropdown-item"
                  :to="{name: 'MisNegocios'}"
                  @click="mostrarMisNegocios"
                  ><i class="bi bi-building"></i> Mis negocios</router-link
                >
              </li>
              <li>
                <button class="dropdown-item" @click="logout">
                  <i class="bi bi-box-arrow-right"></i> Cerrar sesión
                </button>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script lang="ts">
import {LoginController} from "@sistema/authentication/login/infraestructure/login.controller"
import {SesionUsuario} from "@/router/sesionUsuario"
import {computed, defineComponent} from "vue"
import {useStore} from "vuex"
import {Cargando} from "../../cargando/application/cargando.application"

export default defineComponent({
  name: "Navbar",
  setup() {
    const cargando = new Cargando()
    const store = useStore()
    const toggleSidebar = () => store.dispatch("sidebar/toggleSidebar")
    const collapsed = computed(() => store.state.sidebar.collapsed)

    const toggleSearchBar = () => store.dispatch("searchbar/toggleSearchBar")
    const sesionUsuario = SesionUsuario.getInstance()

    const negocioSeleccionado = computed(
      () => store.state.authentication.negocio !== null
    )

    const mostrarMisNegocios = () => {
      SesionUsuario.getInstance().resetearNegocioSeleccionado()
    }

    const loginController = new LoginController()
    const logout = async () => {
      cargando.activar()
      SesionUsuario.getInstance().resetearNegocioSeleccionado()
      await loginController.logout()
      cargando.desactivar()
    }

    const nombreUsuario = computed(() => {
      const usuario = sesionUsuario.obtenerInformacionUsuario()
      if (usuario) {
        if (store.state.sidebar.isVersionMobile)
          return `${usuario.name[0]} ${usuario.lastname[0]} `
        return `${usuario.name} ${usuario.lastname} `
      }
      return ""
    })

    return {
      nombreUsuario,
      collapsed,
      toggleSidebar,
      toggleSearchBar,
      logout,
      negocioSeleccionado,
      mostrarMisNegocios,
      versionMobile: store.state.sidebar.isVersionMobile,
    }
  },
})
</script>

<style lang="scss" scoped>
.opciones-navbar {
  cursor: pointer;
  background-color: rgba($color: #ffffff, $alpha: 1);
  border-radius: 8px;
  box-shadow: 0px 10px 80px -10px rgba(44, 54, 92, 0.3);
  padding: 6px 14px;
  margin-right: 10px;
  transition: all 0.2s ease;

  &:active {
    transform: scale(1.1);
  }
}

.collapse-icon {
  transition: 0.8s ease;
  cursor: pointer;

  i {
    color: var(--sidebar-color);
    font-size: 24px;
  }

  img {
    width: 36px;
  }

  &.rotate-180 {
    transform: rotate(180deg);
  }
}
</style>
