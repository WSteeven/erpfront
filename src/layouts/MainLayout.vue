<template>
  <q-layout view="lHh Lpr lFf">
    <!-- Navbar -->
    <q-header class="bg-white text-dark custom-shadow">
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

        <img
          src="https://ui-avatars.com/api/?name=Marilu+Jaramillo&size=28"
          alt=""
          class="q-mr-sm d-inline-block"
        />

        <q-btn-dropdown stretch flat label="MARILÚ JARAMILLO">
          <q-list>
            <q-item-label header>Coordinador</q-item-label>
            <q-item clickable v-close-popup tabindex="0" dense>
              <q-item-section avatar>
                <q-icon name="bi-person" size="xs" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Perfil</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable v-close-popup tabindex="0" dense>
              <q-item-section avatar>
                <q-icon name="bi-gear" size="xs" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Configuración</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable v-close-popup tabindex="0" dense>
              <q-item-section avatar>
                <q-icon name="bi-box-arrow-right" size="xs" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Cerrar sesión</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </q-toolbar>
    </q-header>

    <!-- Drawer -->
    <q-drawer v-model="leftDrawerOpen" show-if-above class="custom-shadow">
      <q-scroll-area
        style="height: calc(100% - 150px); margin-top: 150px"
        class="q-px-sm"
      >
        <q-list>
          <q-item-label header> Módulos</q-item-label>
          <EssentialLink
            v-for="link in links"
            :key="link.title"
            v-bind="link"
          />
        </q-list>
      </q-scroll-area>

      <!-- Drawer Header -->
      <div class="absolute-top text-center q-pa-md">
        <q-avatar size="58px" class="q-mb-md">
          <img src="src/assets/logo.jpeg" />
        </q-avatar>
        <div class="text-weight-bold">JPConstrucred</div>
      </div>
    </q-drawer>

    <!-- Pagina -->
    <q-page-container class="bg-grey-2">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import EssentialLink from 'components/EssentialLink.vue'
import { useMenuStore } from 'src/stores/menu'

export default defineComponent({
  name: 'MainLayout',

  components: {
    EssentialLink,
  },

  setup() {
    const leftDrawerOpen = ref(false)
    const menu = useMenuStore()

    return {
      links: menu.links,
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value
      },
    }
  },
})
</script>
