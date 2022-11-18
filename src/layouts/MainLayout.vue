<template>
  <q-layout view="lHh Lpr lFf">
    <!-- Navbar -->
    <q-header class="bg-transparent">
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
              fill="#000"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M3 10C3 9.44772 3.44772 9 4 9H16C16.5523 9 17 9.44772 17 10C17 10.5523 16.5523 11 16 11H4C3.44772 11 3 10.5523 3 10Z"
              fill="#000"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M3 15C3 14.4477 3.44772 14 4 14H10C10.5523 14 11 14.4477 11 15C11 15.5523 10.5523 16 10 16H4C3.44772 16 3 15.5523 3 15Z"
              fill="#000"
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
          <q-btn dense round flat icon="bi-bell" class="q-mr-md" color="black">
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
                  <!--<div class="text-h6 q-mb-md">{{ roles }}</div>-->
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
    <!-- <div class="fondo-header"></div> -->
    <div class="onda">
      <!--<svg
        width="385.76251mm"
        height="37.786678mm"
        viewBox="0 0 385.76251 37.786678"
        version="1.1"
        id="svg5"
        xml:space="preserve"
        inkscape:version="1.2.1 (9c6d41e410, 2022-07-14)"
        sodipodi:docname="HEADER.svg"
        xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"
        xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:svg="http://www.w3.org/2000/svg"
      >
        <sodipodi:namedview
          id="namedview7"
          pagecolor="#ffffff"
          bordercolor="#000000"
          borderopacity="0.25"
          inkscape:showpageshadow="2"
          inkscape:pageopacity="0.0"
          inkscape:pagecheckerboard="0"
          inkscape:deskcolor="#d1d1d1"
          inkscape:document-units="mm"
          showgrid="false"
          inkscape:zoom="0.78127806"
          inkscape:cx="695.01504"
          inkscape:cy="80.637104"
          inkscape:window-width="1920"
          inkscape:window-height="1057"
          inkscape:window-x="-8"
          inkscape:window-y="-8"
          inkscape:window-maximized="1"
          inkscape:current-layer="layer1"
        />
        <defs id="defs2">
          <linearGradient inkscape:collect="always" id="linearGradient452">
            <stop
              style="stop-color: #000000; stop-opacity: 1"
              offset="0"
              id="stop448"
            />
            <stop
              style="stop-color: #c94b4b; stop-opacity: 1"
              offset="1"
              id="stop450"
            />
          </linearGradient>
          <linearGradient
            inkscape:collect="always"
            xlink:href="#linearGradient452"
            id="linearGradient454"
            x1="-101.10589"
            y1="92.927704"
            x2="283.94427"
            y2="92.250397"
            gradientUnits="userSpaceOnUse"
          />
        </defs>
        <g
          inkscape:label="Capa 1"
          inkscape:groupmode="layer"
          id="layer1"
          transform="translate(101.10589,-73.285741)"
        >
          <path
            style="
              fill: url(#linearGradient454);
              stroke-width: 0.264583;
              fill-opacity: 1;
            "
            d="m 207.26599,110.82219 c -7.12131,-0.50286 -18.05993,-1.92665 -25.92916,-3.37499 -16.1698,-2.97607 -29.17894,-7.00675 -50.94637,-15.784979 -19.08329,-7.69579 -30.23147,-11.75846 -36.91406,-13.45241 -8.835117,-2.23959 -21.767046,-3.4596 -30.011449,-2.83132 -15.341297,1.16912 -29.713845,4.57552 -50.006252,11.85185 -14.16638382,5.07969 -26.302684,7.54027 -43.656251,8.85109 -5.52786,0.41755 -19.64336,0.41666 -23.944792,-0.002 -11.93495,-1.16028 -21.980561,-3.09307 -32.543751,-6.26146 -5.233567,-1.56978 -12.074426,-3.96571 -13.692195,-4.79552 l -0.7276,-0.37321 v -5.68175 -5.68175 H 91.77537 284.65662 v 13.31216 13.31216 l -5.09323,1.634289 c -10.44027,3.35002 -20.57717,5.83017 -29.83177,7.29881 -3.13129,0.49692 -14.68099,1.65763 -19.97604,2.00754 -4.66985,0.3086 -17.95122,0.29147 -22.48959,-0.029 z"
            id="path386"
          />
        </g>
      </svg> -->
    </div>

    <!-- Drawer -->
    <q-drawer v-model="leftDrawerOpen" show-if-above class="bg-white">
      <!-- Drawer Header -->
      <div class="absolute-top q-pa-lg">
        <img src="~assets/logo.jpeg" class="q-mx-auto block" height="116" />
        <!--<q-avatar size="58px" class="q-mb-md" square>
        </q-avatar>
        <div class="text-h5 text-secondary">CONSTRUCRED</div> -->
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

    // const roles = computed(() => authenticationStore.roles.join(','))

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
      //roles,
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
  /* background: #c94b4b;
  background: -webkit-linear-gradient(to right, #4b134f, #c94b4b);
  background: linear-gradient(to right, #4b134f, #c94b4b); */
  background: #c94b4b;
  background: -webkit-linear-gradient(to right, #710000, transparent);
  background: linear-gradient(to right, #710000, transparent);

  height: 200px;
  width: 100%;
  position: fixed;
  top: -1;
}

.onda {
  width: 100%;
  position: fixed;
  top: 200px;
}
</style>
