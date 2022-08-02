<template>
  <div
    class="sidebar"
    :style="{width: sidebarWidth}"
    :class="{'px-2': !collapsed}"
  >
    <!-- Header -->
    <router-link
      v-show="!collapsed"
      :to="{name: 'MisNegocios'}"
      class="sidebar-header"
      @click="mostrarMisNegocios"
    >
      <img src="img/logo.svg" class="mx-3 logo" />

      <span class="logo-name">Business</span>
    </router-link>

    <!-- Body -->
    <ul class="content-links">
      <sidebar-mobile-menu-item
        v-for="menuItem in menu"
        :key="menuItem.route"
        :to="menuItem.route"
        :icon="menuItem.icon"
        :children="menuItem.children ? menuItem.children : []"
        :has-parent="false"
        >{{ menuItem.title }}</sidebar-mobile-menu-item
      >
    </ul>
    <!-- Footer -->
    <div v-show="!collapsed" class="footer-sidebar">
      <!-- Dropdown -->
      <div class="btn-group dropup w-100">
        <a
          class="dropdown-toggle text-decoration-none w-100 text-texto py-3"
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
          <li>
            <router-link :to="{name: 'PerfilUsuario'}" class="dropdown-item">
              <i class="bi bi-person"></i> Perfil
            </router-link>
          </li>
          <li>
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
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./TheSidebarMobile.ts"></script>

<style lang="scss" scoped>
// Sidebar
.sidebar {
  color: $texto;
  background-color: #fff;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  transition: all 0.1s ease;
  display: flex;
  flex-direction: column;
  border-radius: 0 16px 16px 0;
  box-shadow: 0px 10px 80px -10px rgba(44, 54, 92, 0.3);

  // Header
  .sidebar-header {
    height: 60px;
    width: 100%;
    display: flex;
    align-items: center;
    text-decoration: none;
    cursor: pointer;

    .logo-name {
      font-size: 22px;
      font-weight: 600;
      color: $texto;
    }

    .logo {
      width: 40px;
    }
  }

  &.collapsed .logo-name {
    opacity: 0;
    pointer-events: none;
  }

  // Body
  .content-links {
    height: 100%;
    padding: 30px 0 30px 0;
    list-style: none;
    overflow-y: auto;
    overflow-x: hidden;

    &::-webkit-scrollbar {
      width: 7px;
      background-color: #fff;
    }

    &::-webkit-scrollbar-thumb {
      background: #ccc;
      border-radius: 50px;
    }
  }

  // Footer
  .footer-sidebar {
    text-align: center;
    margin: 6px 0;
    border-radius: 6px 6px 20px 6px;
    font-weight: bold;
    background-color: $light-gray;
    transition: transform 0.3s ease;

    &:hover {
      transform: scale(0.98);
    }
    &:active {
      transform: scale(1.04);
    }
  }
}
</style>
