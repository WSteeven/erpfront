<template>
  <q-layout view="lHh Lpr lFf">
    <!-- Navbar -->
    <q-header class="bg-white text-dark">
      <q-toolbar class="row justify-between">
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title></q-toolbar-title>

        <!-- <img :src="nombreUsuarioTag" alt="" class="q-mr-sm d-inline-block" /> -->
        <q-badge color="positive" rounded class="q-mr-sm" />
        <q-btn no-caps flat :label="nombreUsuario">
          <q-menu>
            <div class="row no-wrap q-pa-md">
              <div class="column">
                <div class="text-h6 q-mb-md">Coordinador</div>
                <div class="q-mb-md">Perfil</div>
                <div>Configuración</div>
              </div>

              <q-separator vertical inset class="q-mx-lg" />

              <div class="column items-center">
                <q-avatar size="72px">
                  <img src="https://cdn.quasar.dev/img/avatar4.jpg" />
                </q-avatar>

                <div class="text-subtitle1 q-mt-md q-mb-xs">Juan Cuesta</div>

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
      </q-toolbar>
    </q-header>

    <!-- Drawer -->
    <q-drawer v-model="leftDrawerOpen" show-if-above class="bg-grey-1">
      <!-- Drawer Header -->
      <div class="absolute-top text-center q-pa-md">
        <q-avatar size="58px" class="q-mb-md">
          <img src="src/assets/logo.jpeg" />
        </q-avatar>
        <div class="text-h5">JPConstrucred</div>
      </div>

      <!-- Drawer Body -->
      <q-scroll-area style="height: calc(100% - 150px); margin-top: 150px">
        <q-list>
          <div v-for="item in links" :key="item.title">
            <q-item-label v-if="item.hasOwnProperty('header')" header>{{
              item.header
            }}</q-item-label>
            <EssentialLink v-else v-bind="item" />
          </div>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <!-- Router -->
    <q-page-container class="bg-white">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
// Dependencias
import { useAuthenticationStore } from 'src/stores/authentication'
import { defineComponent, ref, computed } from 'vue'
import { useMenuStore } from 'src/stores/menu'
import { useRouter } from 'vue-router'

// Componentes
import EssentialLink from 'components/EssentialLink.vue'

export default defineComponent({
  name: 'MainLayout',

  components: {
    EssentialLink,
  },

  setup() {
    const leftDrawerOpen = ref(false)
    const menu = useMenuStore()

    const authenticationStore = useAuthenticationStore()
    const Router = useRouter()

    const nombreUsuario = computed(() => {
      const usuario: any = authenticationStore.user
      if (usuario) {
        return `${usuario.name} ${usuario.apellidos ?? ''} `
      }
      return ''
    })

    async function logout() {
      await authenticationStore.logout()
      Router.replace({ name: 'Login' })
    }

    return {
      links: menu.links,
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value
      },
      logout,
      nombreUsuario,
    }
  },
})
</script>
