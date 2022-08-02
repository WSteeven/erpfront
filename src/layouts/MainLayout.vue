<template>
  <q-layout view="lHh Lpr lFf">
    <!-- Navbar -->
    <q-header class="bg-transparent text-dark">
      <q-toolbar class="row justify-between">
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <!-- <q-toolbar-title> JPConstrucred </q-toolbar-title> -->

        <div>{{ 'Administrador' }}</div>
      </q-toolbar>
    </q-header>

    <!-- Drawer -->
    <q-drawer v-model="leftDrawerOpen" show-if-above>
      <q-scroll-area style="height: calc(100% - 150px); margin-top: 150px">
        <!-- border-right: 1px solid #ddd; -->
        <q-list>
          <q-item-label header> Menú </q-item-label>
          <EssentialLink
            v-for="link in essentialLinks"
            :key="link.title"
            v-bind="link"
          />
        </q-list>
      </q-scroll-area>

      <!-- Drawer Footer -->
      <div
        class="absolute-bottom row items-center justify-between bg-grey-3 q-pa-md"
      >
        <span class="row">
          <q-avatar size="44px" class="q-mr-md">
            <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
          </q-avatar>
          <div>
            <div class="text-weight-bold">Juan Cuesta</div>
            <div>Jefe técnico</div>
          </div>
        </span>
        <q-icon name="logout" size="24px" class="text-grey" />
      </div>

      <!-- Drawer Header -->
      <div class="absolute-top text-center q-pa-md">
        <q-avatar size="58px" class="q-mb-md">
          <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
        </q-avatar>
        <div class="text-weight-bold">JPConstrucred</div>
      </div>
    </q-drawer>

    <!-- Pagina -->
    <q-page-container class="bg-grey-3">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import EssentialLink from 'components/EssentialLink.vue';

const linksList = [
  {
    title: 'Inicio',
    caption: 'Boton de inicio',
    icon: 'home',
    link: '/',
  },
  {
    title: 'Tareas',
    caption: 'Gestión de tareas',
    icon: 'settings',
    link: 'tareas',
  },
  {
    title: 'Github',
    caption: 'github.com/quasarframework',
    icon: 'code',
    link: 'https://github.com/quasarframework',
  },
  {
    title: 'Discord Chat Channel',
    caption: 'chat.quasar.dev',
    icon: 'chat',
    link: 'https://chat.quasar.dev',
  },
  {
    title: 'Forum',
    caption: 'forum.quasar.dev',
    icon: 'record_voice_over',
    link: 'https://forum.quasar.dev',
  },
  {
    title: 'Twitter',
    caption: '@quasarframework',
    icon: 'rss_feed',
    link: 'https://twitter.quasar.dev',
  },
  {
    title: 'Facebook',
    caption: '@QuasarFramework',
    icon: 'public',
    link: 'https://facebook.quasar.dev',
  },
  {
    title: 'Quasar Awesome',
    caption: 'Community Quasar projects',
    icon: 'favorite',
    link: 'https://awesome.quasar.dev',
  },
];

export default defineComponent({
  name: 'MainLayout',

  components: {
    EssentialLink,
  },

  setup() {
    const leftDrawerOpen = ref(false);

    return {
      essentialLinks: linksList,
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
    };
  },
});
</script>
