<template>
  <!-- Backdrop -->
  <div
    v-show="!collapsed && versionMobile"
    class="backdrop"
    @click="toggleSidebar"
  ></div>

  <!-- Sidebars -->
  <sidebar-mobile v-if="versionMobile" class="sidebar"></sidebar-mobile>
  <sidebar v-else class="sidebar"></sidebar>

  <!-- Navbar -->
  <div v-if="versionMobile">
    <searchbar v-if="showSearchBar" class="navbar-style"></searchbar>
    <navbar v-else class="navbar-style"></navbar>
  </div>
  <div v-else :style="{'margin-left': sidebarWidth}">
    <searchbar v-if="showSearchBar" class="navbar-style"></searchbar>
    <navbar v-else class="navbar-style"></navbar>
  </div>

  <!-- Roter view -->
  <div v-if="versionMobile" class="px-4">
    <router-view v-slot="{Component}">
      <transition name="scale" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
  <div v-else class="px-4 pt-2" :style="{'margin-left': sidebarWidth}">
    <router-view v-slot="{Component}">
      <transition name="scale" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<script lang="ts">
// Dependencias
import {computed, defineComponent} from "vue"
import {useStore} from "vuex"
// Componentes
import Sidebar from "@componentes/theSidebar/TheSidebar.vue"
import SidebarMobile from "@componentes/theSidebarMobile/TheSidebarMobile.vue"
import Navbar from "@componentes/theNavbar/view/TheNavbar.vue"
import Searchbar from "@componentes/theNavbar/modules/theSearchbar/view/TheSearchbar.vue"

export default defineComponent({
  components: {
    Sidebar,
    SidebarMobile,
    Navbar,
    Searchbar,
  },
  setup() {
    const store = useStore()
    const versionMobile = computed(() => store.state.sidebar.isVersionMobile)

    return {
      sidebarWidth: computed(() => {
        return versionMobile.value
          ? store.getters[`sidebar/sidebarMobileWidth`]
          : store.getters[`sidebar/sidebarWidth`]
      }),
      showSearchBar: computed(() => store.state.searchbar.showSearchBar),
      collapsed: computed(() => store.state.sidebar.collapsed),
      toggleSidebar: () => store.dispatch("sidebar/toggleSidebar"),
      versionMobile,
    }
  },
})
</script>

<style lang="scss" scoped>
.sidebar {
  z-index: 1000;
}

.backdrop {
  position: fixed;
  z-index: 500;
  width: 100%;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.2);
}

.navbar-style {
  z-index: 250;
}
</style>
