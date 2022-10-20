<template>
  <q-layout view="lHh Lpr lFf">
    <!-- Navbar -->
    <q-header class="bg-primary">
      <q-toolbar class="row justify-between">
        <q-btn
          flat
          dense
          round
          aria-label="Menu"
          @click="toggleLeftDrawer"
          class="text-white"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M3 5C3 4.44772 3.44772 4 4 4H16C16.5523 4 17 4.44772 17 5C17 5.55228 16.5523 6 16 6H4C3.44772 6 3 5.55228 3 5Z"
              fill="#fff"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M3 10C3 9.44772 3.44772 9 4 9H16C16.5523 9 17 9.44772 17 10C17 10.5523 16.5523 11 16 11H4C3.44772 11 3 10.5523 3 10Z"
              fill="#fff"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M3 15C3 14.4477 3.44772 14 4 14H10C10.5523 14 11 14.4477 11 15C11 15.5523 10.5523 16 10 16H4C3.44772 16 3 15.5523 3 15Z"
              fill="#fff"
            />
          </svg>
        </q-btn>

        <!-- <q-toolbar-title></q-toolbar-title> -->
        <!-- <img :src="nombreUsuarioTag" alt="" class="q-mr-sm d-inline-block" /> -->
        <!--<span class="q-pl-lg text-bold">
          {{ nombreUsuario }}
        </span> -->
        <!--<q-badge color="positive" rounded class="q-mr-sm" />-->
        <!--<q-btn no-caps flat>-->
        <!--<div class="column q-mr-md text-center">-->
        <!--<small>Usuario</small>-->
        <!--<q-icon
                name="bi-chevron-down"
                size="xs"
                class="full-width"
              ></q-icon> -->
        <!--</div>-->
        <!--</q-btn>-->

        <span>
          <q-btn dense round flat icon="bi-bell" class="q-mr-md">
            <q-badge color="positive" floating transparent> 4 </q-badge>
            <q-menu transition-show="flip-right" transition-hide="flip-left">
              <q-list style="min-width: 100px">
                <q-item clickable>
                  <q-item-section>Having fun</q-item-section>
                </q-item>
                <q-item clickable>
                  <q-item-section>Crazy for transitions</q-item-section>
                </q-item>
                <q-separator />
                <q-item clickable>
                  <q-item-section>Ver todas las notificaciones</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>

          <q-btn dense round flat>
            <q-avatar size="32px" class="double-border">
              <img src="https://cdn.quasar.dev/img/avatar4.jpg" />
            </q-avatar>
            <q-menu
              anchor="center middle"
              self="center middle"
              transition-show="jump-down"
              transition-hide="jump-out"
            >
              <div class="row no-wrap q-pa-md justify-content">
                <div class="column">
                  <div class="text-h6 q-mb-md">{{ roles }}</div>
                  <q-item clickable dense :to="{ name: 'Perfil' }">
                    <q-item-section> Perfil </q-item-section>
                  </q-item>
                  <q-item clickable dense :to="{ name: 'Perfil' }">
                    <q-item-section> Configuración </q-item-section>
                  </q-item>
                </div>

                <q-separator vertical inset class="q-mx-lg" />

                <div class="column items-center">
                  <q-avatar size="72px">
                    <img src="https://cdn.quasar.dev/img/avatar4.jpg" />
                  </q-avatar>

                  <div class="text-subtitle1 q-mt-md q-mb-xs">
                    {{ nombreUsuario }}
                  </div>

                  <q-btn
                    label="Cerrar sesión"
                    color="primary"
                    size="sm"
                    v-close-popup
                    no-wrap
                    no-caps
                    push
                    @click="logout()"
                  />
                </div>
              </div>
            </q-menu>
          </q-btn>
        </span>
      </q-toolbar>
    </q-header>

    <!--<div class="custom-header"> -->
    <div class="fondo-header"></div>
    <div class="onda">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1000 100"
        preserveAspectRatio="none"
      >
        <path
          class="elementor-shape-fill"
          d="M421.9,6.5c22.6-2.5,51.5,0.4,75.5,5.3c23.6,4.9,70.9,23.5,100.5,35.7c75.8,32.2,133.7,44.5,192.6,49.7
      c23.6,2.1,48.7,3.5,103.4-2.5c54.7-6,106.2-25.6,106.2-25.6V0H0v30.3c0,0,72,32.6,158.4,30.5c39.2-0.7,92.8-6.7,134-22.4
      c21.2-8.1,52.2-18.2,79.7-24.2C399.3,7.9,411.6,7.5,421.9,6.5z"
        ></path>
      </svg>
    </div>
    <!--</div> -->

    <!-- Drawer -->
    <q-drawer v-model="leftDrawerOpen" show-if-above class="bg-white">
      <!-- Drawer Header -->
      <div class="absolute-top text-center q-pa-md">
        <q-avatar size="58px" class="q-mb-md" square>
          <img src="~assets/logo.svg" />
        </q-avatar>
        <div class="text-h5 text-secondary">CONSTRUCRED</div>
      </div>

      <!-- Drawer Body -->
      <q-scroll-area style="height: calc(100% - 150px); margin-top: 150px">
        <q-list>
          <div v-for="item in links" :key="item.title">
            <q-item-label v-if="item.hasOwnProperty('header')" header>{{
              item.header
            }}</q-item-label>
            <!-- <EssentialLink v-else v-bind="item" /> -->
            <EssentialLink
              v-else
              :title="item.title ?? ''"
              :link="item.link"
              :icon="item.icon"
              :children="item.children"
              :can="item.can"
            ></EssentialLink>
          </div>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <!-- Router -->
    <q-page-container class="bg-grey-2">
      <router-view v-slot="{ Component }">
        <transition name="scale" mode="out-in">
          <div>
            <essential-loading></essential-loading>
            <component :is="Component" />
            <footer-component></footer-component>
          </div>
        </transition>
      </router-view>
    </q-page-container>
    <!-- <bottom-menu
      :menu-visible="menuVisible"
      @cerrar="toggleLeftDrawer"
    ></bottom-menu> -->
  </q-layout>
</template>

<script lang="ts">
// Dependencias
import { useAuthenticationStore } from 'src/stores/authentication'
import { defineComponent, ref, computed } from 'vue'
import { useMenuStore } from 'src/stores/menu'
import { useRouter } from 'vue-router'
import EssentialLoading from 'components/loading/view/EssentialLoading.vue'

// Componentes
import EssentialLink from 'components/EssentialLink.vue'
import BottomMenu from 'components/bottomMenu/view/BottomMenu.vue'
import FooterComponent from 'components/FooterComponent.vue'

import { useQuasar } from 'quasar'

export default defineComponent({
  name: 'MainLayout',

  components: {
    EssentialLink,
    EssentialLoading,
    BottomMenu,
    FooterComponent,
  },

  setup() {
    const leftDrawerOpen = ref(false)
    const menu = useMenuStore()

    const menuVisible = ref(false)

    const authenticationStore = useAuthenticationStore()
    const Router = useRouter()

    const roles = computed(() => authenticationStore.roles.join(','))

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

    return {
      links: menu.links,
      leftDrawerOpen,
      toggleLeftDrawer() {
        console.log('cerrrada')
        //if (!$q.screen.xs) {
        leftDrawerOpen.value = !leftDrawerOpen.value
        /*} else {
          menuVisible.value = !menuVisible.value
        }*/
      },
      logout,
      nombreUsuario,
      roles,
      menuVisible,
    }
  },
})
</script>

<style lang="scss">
/*.custom-header {
  display: flex;
  height: 400px;
  top: 0;
  position: fixed;
}*/

/*.fondo-header {
  background-color: $negative;
  height: 100px;
  position: fixed;
  top: 0px;
  z-index: 0;
  //  margin-top: 500px;
  //  padding-top: 500px;
}

.onda {
  background-color: $positive;
  position: fixed;
  top: 0;
  z-index: 99999;
}*/
.fondo-header {
  background-color: $primary;
  height: 200px;
  width: 100%;
  position: fixed;
  top: -1;
  //z-index: -1;
}

.onda {
  width: 100%;
  position: fixed;
  top: 200px;
}

.elementor-shape-fill {
  fill: $primary;
}
</style>
