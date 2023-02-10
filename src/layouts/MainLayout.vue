<template>
  <q-layout view="lHh Lpr lFf">
    <!-- Navbar -->
    <q-header class="bg-desenfoque">
      <q-toolbar class="row justify-between">
        <q-btn flat dense round aria-label="Menu" @click="toggleLeftDrawer">
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
              fill="#616161"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M3 10C3 9.44772 3.44772 9 4 9H16C16.5523 9 17 9.44772 17 10C17 10.5523 16.5523 11 16 11H4C3.44772 11 3 10.5523 3 10Z"
              fill="#616161"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M3 15C3 14.4477 3.44772 14 4 14H10C10.5523 14 11 14.4477 11 15C11 15.5523 10.5523 16 10 16H4C3.44772 16 3 15.5523 3 15Z"
              fill="#616161"
            />
          </svg>
        </q-btn>

        <!-- <span class="q-pl-lg text-dark text-bold">
          {{ nombreUsuario }}
        </span> -->

        <span>
          <q-btn dense round flat icon="bi-bell" class="q-mr-md" color="grey-8">
            <q-badge color="info" floating> 4 </q-badge>
            <q-menu transition-show="flip-right" transition-hide="flip-left">
              <q-list style="min-width: 120px">
                <q-item clickable v-ripple>
                  <q-item-section avatar>
                    <q-icon color="info" name="bi-app" size="xs" />
                  </q-item-section>
                  <q-item-section>Primera notificación</q-item-section>
                </q-item>

                <q-item clickable v-ripple>
                  <q-item-section avatar>
                    <q-icon color="info" name="bi-app" size="xs" />
                  </q-item-section>
                  <q-item-section>Crazy for transitions</q-item-section>
                </q-item>

                <q-separator />

                <q-item clickable v-ripple>
                  <q-item-section avatar>
                    <q-icon color="info" name="bi-bell" size="xs" />
                  </q-item-section>
                  <q-item-section>Ver todas las notificaciones</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>

          <q-btn dense round flat @click.self="mostrarMenu = true">
            <q-avatar size="32px" class="double-border">
              <img src="https://cdn.quasar.dev/img/avatar4.jpg" />
            </q-avatar>

            <q-menu
              v-model="mostrarMenu"
              anchor="center middle"
              self="center middle"
              transition-show="jump-down"
              transition-hide="jump-out"
              :style="{ 'min-width': width }"
              class="bg-desenfoque"
              max-height="100vh"
            >
              <div class="column items-center q-py-sm window-height">
                <div class="full-width text-right q-pr-md">
                  <q-btn
                    icon="bi-x"
                    round
                    :class="{
                      'bg-grey-9': $q.dark.isActive,
                      'bg-white': !$q.dark.isActive,
                    }"
                    unelevated
                    @click="mostrarMenu = false"
                  ></q-btn>
                </div>
                <q-avatar size="72px" class="q-mb-md">
                  <img src="https://cdn.quasar.dev/img/avatar4.jpg" />
                </q-avatar>

                <div class="text-subtitle1 text-center">
                  {{ nombreUsuario }}
                </div>

                <q-item clickable :to="{ name: 'Perfil' }" class="full-width">
                  <q-avatar>
                    <q-icon name="bi-person"></q-icon>
                  </q-avatar>
                  <q-item-section> Perfil </q-item-section>
                </q-item>

                <q-item clickable :to="{ name: 'Perfil' }" class="full-width">
                  <q-avatar>
                    <q-icon name="bi-gear"></q-icon>
                  </q-avatar>
                  <q-item-section> Configuración </q-item-section>
                </q-item>

                <q-item clickable class="full-width">
                  <q-toggle
                    v-model="modoOscuro"
                    checked-icon="bi-moon-fill"
                    label="Modo oscuro"
                    unchecked-icon="bi-sun-fill"
                    @click="toggleDarkMode()"
                  />
                </q-item>

                <q-item clickable class="full-width" @click="logout()">
                  <q-avatar>
                    <q-icon name="bi-box-arrow-left"></q-icon>
                  </q-avatar>
                  <q-item-section> Cerrar sesión </q-item-section>
                </q-item>
              </div>
            </q-menu>
          </q-btn>
        </span>
      </q-toolbar>
    </q-header>

    <!-- Drawer -->
    <q-drawer v-model="leftDrawerOpen" show-if-above>
      <!-- Drawer Header -->
      <div class="absolute-top q-pa-lg">
        <!--<img src="~assets/logo.svg" height="80" class="q-mx-auto block" /> -->
        <img
          src="~assets/logoJP_Borde.png"
          height="80"
          class="q-mx-auto block"
        />
      </div>

      <!-- Drawer Body -->
      <q-scroll-area style="height: calc(100% - 150px); margin-top: 150px">
        <q-list>
          <div v-for="item in links" :key="item.title">
            <q-item-label
              v-if="item.hasOwnProperty('header')"
              header
              class="text-bold"
              >{{ item.header }}</q-item-label
            >

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
    <q-page-container :class="{ 'bg-body': true }">
      <router-view v-slot="{ Component }">
        <transition name="scale" mode="out-in">
          <div>
            <essential-loading></essential-loading>
            <component :is="Component" />
            <!--<footer-component></footer-component> -->
          </div>
        </transition>
      </router-view>
    </q-page-container>
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
import FooterComponent from 'components/FooterComponent.vue'
import { LocalStorage, useQuasar } from 'quasar'

export default defineComponent({
  name: 'MainLayout',

  components: {
    EssentialLink,
    EssentialLoading,
    FooterComponent,
  },

  setup() {
    const leftDrawerOpen = ref(false)
    const menu = useMenuStore()

    const menuVisible = ref(false)

    const authenticationStore = useAuthenticationStore()
    const Router = useRouter()

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
    const modoOscuro = computed(
      () => LocalStorage.getItem('dark') ?? $q.dark.isActive
    )

    $q.dark.set(modoOscuro.value)

    function toggleDarkMode() {
      console.log(!modoOscuro.value)
      $q.dark.set(!modoOscuro.value)
      LocalStorage.set('dark', !modoOscuro.value)
    }

    return {
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
      width: computed(() => ($q.screen.xs ? '100%' : '350px')),
      mostrarMenu: ref(false),
    }
  },
})
</script>
