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
          <q-btn
            dense
            round
            flat
            icon="bi-bell"
            class="q-mr-md"
            color="grey-8"
            @click.self="mostrarNotificaciones = true"
          >
            <q-badge v-if="notificaciones.length > 0" color="info" floating
              >{{ notificaciones.length }}
            </q-badge>
            <q-menu
              v-model="mostrarNotificaciones"
              anchor="center middle"
              self="center middle"
              transition-show="jump-down"
              transition-hide="jump-out"
              :style="{ 'min-width': width }"
              class="window-height bg-desenfoque"
              max-height="100vh"
            >
              <div class="full-width text-right q-pr-md">
                <q-btn
                  icon="bi-x"
                  round
                  :class="{
                    'bg-grey-9': $q.dark.isActive,
                    'bg-white': !$q.dark.isActive,
                  }"
                  unelevated
                  class="q-mt-sm"
                  @click="mostrarNotificaciones = false"
                ></q-btn>
              </div>
              <q-list style="min-width: 120px; max-width: 400px">
                <q-item
                  class="q-mb-md text-grey-7"
                  v-if="notificaciones.length === 0"
                >
                  <q-avatar>
                    <q-icon name="bi-bell-slash"></q-icon>
                  </q-avatar>
                  <q-item-section>
                    <q-item-label>No tienes notificaciones nuevas</q-item-label>
                  </q-item-section></q-item
                >
                <q-item
                  v-for="notificacion in notificaciones"
                  :key="notificacion.id"
                  class="bg-desenfoque"
                >
                  <q-item-section avatar>
                    <q-icon
                      color="info"
                      :name="
                        obtenerIcono.obtener(notificacion.tipo_notificacion)
                      "
                      size="sm"
                    />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label
                      ><q-breadcrumbs
                        ><q-breadcrumbs-el
                          :label="notificacion.mensaje"
                          :to="notificacion.link" /></q-breadcrumbs
                    ></q-item-label>
                  </q-item-section>

                  <q-item-section side top
                    >{{ moment(notificacion.created_at).fromNow() }}
                    <q-item-label caption
                      ><q-breadcrumbs class="text-blue text-right">
                        <q-breadcrumbs-el
                          icon="bi-check"
                          label="leída"
                          @click="marcarLeida(notificacion.id)"
                        /> </q-breadcrumbs
                    ></q-item-label>
                  </q-item-section>
                </q-item>

                <q-separator />

                <q-item clickable to="notificaciones">
                  <q-avatar>
                    <q-icon name="bi-bell" />
                  </q-avatar>
                  <q-item-section>Ver todas las notificaciones</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>

          <q-btn dense round flat @click.self="mostrarMenu = true">
            <q-avatar size="36px" class="double-border">
              <img v-bind:src="imagenPerfil" />
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

                <q-avatar size="72px" class="double-border q-mb-md">
                  <img v-bind:src="imagenPerfil" />
                </q-avatar>

                <div class="text-subtitle1 text-center">
                  {{ nombreUsuario }}
                </div>

                <q-item clickable :to="{ name: 'perfil' }" class="full-width">
                  <q-avatar>
                    <q-icon name="bi-person"></q-icon>
                  </q-avatar>
                  <q-item-section> Perfil </q-item-section>
                </q-item>

                <q-item clickable :to="{ name: 'perfil' }" class="full-width">
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
          <essential-loading></essential-loading>
        </transition>

        <component :is="Component" />
        <!--<footer-component></footer-component> -->
      </router-view>
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
// Dependencias
import { useAuthenticationStore } from 'src/stores/authentication'
import { defineComponent, ref, computed, Ref } from 'vue'
import { useMenuStore } from 'src/stores/menu'
import { useRouter } from 'vue-router'
import EssentialLoading from 'components/loading/view/EssentialLoading.vue'

// Componentes
import EssentialLink from 'components/EssentialLink.vue'
import FooterComponent from 'components/FooterComponent.vue'
import { LocalStorage, useQuasar } from 'quasar'
import { useNotificationRealtimeStore } from 'stores/notificationRealtime'
import { Notificacion } from 'pages/administracion/notificaciones/domain/Notificacion'
import moment from 'moment'
import { ObtenerIconoNotificacionRealtime } from 'shared/ObtenerIconoNotificacionRealtime'
import { PedidoPusherEvent } from 'pages/bodega/pedidos/application/PedidoPusherEvent'
import { useNotificaciones } from 'shared/notificaciones'
import { GastoPusherEvent } from 'pages/fondosRotativos/gasto/application/GastoPusherEvent'
import { TransferenciaSaldoPusherEvent } from 'pages/fondosRotativos/autorizarTransferencia/application/TransferenciaSaldoPusherEvent'

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

    const modoOscuro = ref(LocalStorage.getItem('dark') ?? false)

    $q.dark.set(Boolean(modoOscuro.value))

    function toggleDarkMode() {
      $q.dark.set(Boolean(modoOscuro.value))
      LocalStorage.set('dark', modoOscuro.value)
    }

    /**********************************************
     * PUSHER
     * En esta sección agregan todas las llamadas al metodo start de sus archivos PusherEvent
     **********************************************/
    //pedidos
    const pedidoPusherEvent = new PedidoPusherEvent()
    pedidoPusherEvent.start()
    //subtareas

    //fondos rotativos
    const fondosRotativoPusherEvent = new GastoPusherEvent();
    fondosRotativoPusherEvent.start();
    //saldos
    const transferenciaSaldoPusherEvent = new TransferenciaSaldoPusherEvent();
    transferenciaSaldoPusherEvent.start();




    //Poner la imagen de perfil
    const imagenPerfil = `https://ui-avatars.com/api/?name=${authenticationStore.user.nombres}+${authenticationStore.user.apellidos}&bold=true&background=bfcedb&color=0879dc`

    const notificacionesPusherStore = useNotificationRealtimeStore()
    const obtenerIconoNotificacion = new ObtenerIconoNotificacionRealtime()

    notificacionesPusherStore.listar() //cargar las notificaciones de la base de datos

    //configuracion de las notificaciones
    const notificaciones: Ref<Notificacion[]> = computed(
      () => notificacionesPusherStore.listadoNotificaciones
    )

    async function marcarLeida(id) {
      notificacionesPusherStore.idNotificacion = id
      await notificacionesPusherStore.marcarLeida()
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
      mostrarNotificaciones: ref(false),
      notificaciones,
      marcarLeida,
      ordenarNotificaciones() {
        notificaciones.value.sort((a: Notificacion, b: Notificacion) => {
          return b.id! - a.id!
        })
      },
      moment,
      obtenerIcono: obtenerIconoNotificacion,
      imagenPerfil,
    }
  },
})
</script>
