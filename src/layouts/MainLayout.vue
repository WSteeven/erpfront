<template>
  <q-layout view="lHh Lpr lFf">
    <!-- Navbar -->
    <q-header class="bg-desenfoque">
      <transition name="slide-fade" mode="out-in">
        <div v-if="mostrarBuscar" class="q-pa-xs">
          <q-input
            v-model="buscarModulo"
            placeholder="PRESIONE ESC PARA CERRAR"
            @update:model-value="filtrarMenu"
            bg-color="grey-1"
            input-class="text-black"
            @keyup.esc="resetearBuscador()"
            @keyup.arrow-up="onKeyUp"
            @keyup.arrow-down="onKeyDown"
            @keyup.enter="onKeyEnter"
            autofocus
            dense
            outlined
            clearable
          >
            <template #prepend>
              <q-icon name="search" size="xs"></q-icon>
            </template>
          </q-input>
        </div>
      </transition>

      <transition name="scale" mode="out-in">
        <div v-if="buscarModulo" class="row justify-center">
          <q-list
            dense
            bordered
            class="lista-busqueda bg-solid custom-shadow text-color"
            style="width: 90%; margin: 0 auto"
          >
            <div ref="refListadoBusqueda" v-for="(link, index) in resultadosBusqueda" :key="index">
              <q-item
              :focused="posicionResultados==index"
                clickable
                v-if="link.link"
                :to="link.link"
                @click="resetearBuscador()"
              >
                <q-item-section avatar>
                  <q-icon :name="link.icon" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ link.title }}</q-item-label>
                  <q-item-label caption v-if="link.parentTitle">{{
                    link.parentTitle
                  }}</q-item-label>
                </q-item-section>
              </q-item>
            </div>
          </q-list>
        </div>
      </transition>

      <q-toolbar class="row justify-between q-py-sm border-bottom">
        <span class="row q-gutter-x-sm">
          <q-btn
            v-if="route.name !== 'intranet'"
            dense
            aria-label="Menu"
            @click="toggleLeftDrawer"
            class="custom-shadow bg-primary"
            unelevated
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
                d="m 4.9152545,6.3008475 c 0,-0.607508 0.44772,-1.1 1,-1.1 H 17.915255 c 0.5523,0 1,0.492492 1,1.1 0,0.607508 -0.4477,1.1 -1,1.1 H 5.9152545 c -0.55228,0 -1,-0.492492 -1,-1.1 z"
                fill="#575b6e"
                id="path2"
                style="fill: #fff; stroke-width: 1.04881"
              />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="m 1.7118644,12.182204 c 0,-0.607508 0.6526088,-1.1 1.457627,-1.1 H 20.661018 c 0.805046,0 1.457627,0.492492 1.457627,1.1 0,0.60753 -0.652581,1.1 -1.457627,1.1 H 3.1694914 c -0.8050182,0 -1.457627,-0.49247 -1.457627,-1.1 z"
                fill="#575b6e"
                id="path4"
                style="fill: #fff; stroke-width: 1.26625"
              />
              <path
                id="path6"
                style="fill: #fff; stroke-width: 1.04881"
                d="M 8.9160156 16.658203 C 8.3637368 16.658203 7.9160156 17.150284 7.9160156 17.757812 C 7.9160156 18.365342 8.3637368 18.859375 8.9160156 18.859375 L 14.916016 18.859375 C 15.468314 18.859375 15.916016 18.365342 15.916016 17.757812 C 15.916016 17.150284 15.468314 16.658203 14.916016 16.658203 L 8.9160156 16.658203 z "
              />
            </svg>
          </q-btn>

          <img
            v-if="route.name === 'intranet'"
            :src="!$q.dark.isActive ? logoClaro : logoOscuro"
            height="30"
            class="custom-shadow"
          />

          <!-- Barra de Busqueda -->
          <div class="row q-col-gutter-x-xs">
            <q-btn @click="mostrarBuscar = !mostrarBuscar" unelevated no-caps>
              <q-icon
                name="bi-search"
                size="xs"
                class="bg-icon color-icon-navbar q-pa-xs rounded-field q-mr-xs"
              ></q-icon>
              <span v-if="!$q.screen.xs" class="text-color">Buscar</span>
            </q-btn>
          </div>
        </span>

        <span
          class="row"
          :class="{
            'q-gutter-x-sm': $q.screen.xs,
            'q-gutter-x-md': !$q.screen.xs
          }"
        >
          <!-- Boton transferir tareas -->
          <q-btn
            v-if="mostrarTransferirTareas"
            dense
            unelevated
            no-caps
            class="q-px-sm bg-grey-4d"
            @click="abrirTransferirTareas()"
          >
            <q-icon
              name="bi-arrow-left-right"
              :class="{ 'q-mx-sm': !$q.screen.xs }"
              class="bg-icon color-icon-navbar q-pa-xs rounded-field"
              size="xs"
            ></q-icon>
            <span v-if="!$q.screen.xs" class="text-color"
              >Transferir tareas activas</span
            >
            <q-tooltip class="bg-dark">Transferir tareas activas</q-tooltip>
          </q-btn>

          <!-- Boton movilizacion -->
          <q-btn
            dense
            unelevated
            no-caps
            class="q-px-sm"
            @click="abrirMovilizacionSubtarea()"
          >
            <q-icon
              name="bi-car-front"
              :class="{ 'q-mr-sm': !$q.screen.xs }"
              class="bg-icon color-icon-navbar q-pa-xs rounded-field"
              size="xs"
            ></q-icon>
            <span v-if="!$q.screen.xs" class="text-color">Movilización</span>
            <q-tooltip class="bg-dark">Movilización</q-tooltip>
          </q-btn>

          <!-- Boton Mi bodega -->
          <q-btn
            dense
            unelevated
            no-caps
            class="q-px-sm"
            :to="{ name: 'mi_bodega' }"
          >
            <q-icon
              name="bi-box-seam"
              :class="{ 'q-mr-sm': !$q.screen.xs }"
              class="bg-icon color-icon-navbar q-pa-xs rounded-field"
              size="xs"
            ></q-icon>
            <span v-if="!$q.screen.xs" class="text-color">Mi bodega</span>
            <q-tooltip class="bg-dark">Mi bodega</q-tooltip>
          </q-btn>

          <!-- Tickets -->
          <q-btn
            dense
            unelevated
            no-caps
            class="q-pl-sm"
            @click.self="mostrarCrearTicket = true"
          >
            <q-icon
              name="bi-tags"
              :class="{ 'q-mr-sm': !$q.screen.xs }"
              class="bg-icon color-icon-navbar q-pa-xs rounded-field"
              size="xs"
            ></q-icon>

            <q-tooltip class="bg-dark">Crear ticket</q-tooltip>

            <q-menu
              v-model="mostrarCrearTicket"
              :self="selfCenterMiddle"
              transition-show="slide-left"
              transition-hide="slide-right"
              :style="{ width: width }"
              class="window-height bg-desenfoque-2 custom-shadow"
              max-height="100vh"
              anchor="center middle"
            >
              <div class="full-width text-right q-pr-md q-mb-md">
                <q-btn
                  icon="bi-chevron-right"
                  round
                  dense
                  unelevated
                  color="primary"
                  class="q-mt-sm"
                  @click="mostrarCrearTicket = false"
                ></q-btn>
              </div>

              <crear-ticket></crear-ticket>
            </q-menu>
          </q-btn>

          <!-- Boton notificaciones -->
          <q-btn
            dense
            unelevated
            no-caps
            class="q-pl-sm"
            @click.self="mostrarNotificaciones = true"
          >
            <q-icon
              name="bi-bell"
              :class="{ 'q-mr-sm': !$q.screen.xs }"
              class="bg-icon color-icon-navbar q-pa-xs rounded-field"
              size="xs"
            ></q-icon>

            <!-- <span v-if="!$q.screen.xs">Notificaciones</span> -->
            <q-tooltip class="bg-dark">Notificaciones</q-tooltip>

            <q-badge v-if="notificaciones.length > 0" color="positive" floating
              ><span>{{ notificaciones.length }}</span>
            </q-badge>

            <q-menu
              v-model="mostrarNotificaciones"
              :self="selfCenterMiddle"
              transition-show="slide-left"
              transition-hide="slide-right"
              :style="{ width: width }"
              class="window-height bg-desenfoque-2 custom-shadow"
              max-height="100vh"
              anchor="center middle"
            >
              <div class="full-width text-right q-pr-md q-mb-md">
                <q-btn
                  icon="bi-chevron-right"
                  round
                  dense
                  unelevated
                  color="primary"
                  class="q-mt-sm"
                  @click="mostrarNotificaciones = false"
                ></q-btn>
              </div>

              <q-list
                style="min-width: 140px; max-width: 450px"
                class="q-px-xs"
              >
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

                <q-expansion-item
                  v-for="titulo in Object.keys(notificacionesAgrupadas)"
                  :key="titulo"
                  class="overflow-hidden q-mb-sm expansion"
                  :label="`${titulo} (${notificacionesAgrupadas[titulo].length})`"
                  header-class="text-bold bg-header-collapse text-primary full-width"
                  icon="bi-dot"
                >
                  <q-item
                    v-for="notificacion in notificacionesAgrupadas[titulo]"
                    :key="notificacion.id"
                    :to="notificacion.link"
                  >
                    <q-item-section avatar>
                      <q-icon
                        color="grey-8"
                        :name="
                          obtenerIcono.obtener(notificacion.tipo_notificacion)
                        "
                      />
                    </q-item-section>

                    <q-item-section class="full-width">
                      {{ notificacion.mensaje }}
                      <span class="block text-grey-8 text-weight-regular">
                        {{ dayjs(notificacion.created_at).fromNow() }}
                      </span>

                      <q-item-label class="row justify-end q-pt-sm">
                        <q-btn
                          icon="bi-check"
                          label="Marcar como leído"
                          dense
                          color="positive"
                          size="sm"
                          outline
                          no-caps
                          rounded
                          unelevated
                          @click="marcarLeida(notificacion.id)"
                        >
                        </q-btn
                      ></q-item-label>
                    </q-item-section>
                  </q-item>
                </q-expansion-item>

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

          <!-- Perfil -->
          <q-btn dense round flat glossy @click.self="mostrarMenu = true">
            <q-badge color="positive" rounded floating> </q-badge>
            <img
              :src="imagenPerfil"
              fit="cover"
              height="34px"
              width="34px"
              class="rounded border-white"
            />

            <q-menu
              v-model="mostrarMenu"
              :self="selfCenterMiddle"
              transition-show="slide-left"
              transition-hide="slide-right"
              :style="{ width: width }"
              class="bg-desenfoque"
              max-height="100vh"
            >
              <div class="column items-center q-py-sm window-height">
                <div class="full-width text-right q-pr-md">
                  <q-btn
                    icon="bi-chevron-right"
                    round
                    dense
                    unelevated
                    color="primary"
                    @click="mostrarMenu = false"
                  ></q-btn>
                </div>

                <!-- <q-avatar size="72px" class="double-border q-mb-md"> -->
                <img
                  :src="imagenPerfil"
                  fit="contain"
                  height="72px"
                  width="72px"
                  class="rounded border-white q-mb-md"
                />
                <!-- </q-avatar> -->

                <div class="text-subtitle1 text-center">
                  {{ nombreUsuario }}
                </div>

                <div v-if="grupo" class="q-mb-md">
                  Grupo <strong>{{ grupo }}</strong>
                </div>

                <div class="text-subtitle2 text-center q-mb-md">
                  Saldo Actual: $ {{ saldo }}
                </div>

                <!-- <div class=" text-center q-mb-md" v-if="ultimaConexion">
                  Ultima conexión
                  <br><strong>{{ ultimaConexion }}</strong>
                </div> -->

                <q-item clickable :to="{ name: 'perfil' }" class="full-width">
                  <q-avatar>
                    <q-icon name="bi-person"></q-icon>
                  </q-avatar>
                  <q-item-section> Perfil </q-item-section>
                </q-item>

                <!--<q-item clickable :to="{ name: 'perfil' }" class="full-width">
                  <q-avatar>
                    <q-icon name="bi-gear"></q-icon>
                  </q-avatar>
                  <q-item-section> Configuración </q-item-section>
                </q-item> -->

                <q-item
                  clickable
                  :to="{ name: 'mi_bodega' }"
                  class="full-width"
                >
                  <q-avatar>
                    <q-icon name="bi-box-seam"></q-icon>
                  </q-avatar>
                  <q-item-section> Mi bodega </q-item-section>
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

                <q-item
                  clickable
                  class="full-width"
                  @click="logout()"
                  :disable="$q.loading.isActive"
                >
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

      <div class="text-center">
        <q-chip v-if="enCamino" class="bg-grey-2 q-mx-auto q-mb-md">
          <q-icon
            name="bi-car-front-fill"
            color="positive"
            class="q-mr-xs"
          ></q-icon>
          <div class="text-positive">
            Destino:&nbsp;<b>{{ enCamino }}</b>
          </div>
          <q-separator vertical class="q-mx-md"></q-separator>
          <span class="text-grey-8">VIAJE DE {{ motivo }}</span>
        </q-chip>
      </div>
    </q-header>

    <!-- Drawer -->
    <q-drawer
      v-model="leftDrawerOpen"
      class="bg-drawer border-right q-px-sm q-py-sm"
      show-if-above
      v-if="route.name !== 'intranet'"
    >
      <!-- Drawer Header -->
      <div class="absolute-top q-pa-sm q-ma-sm rounded-card">
        <img
          :src="!$q.dark.isActive ? logoClaro : logoOscuro"
          height="60"
          class="q-mx-auto block"
        />
      </div>

      <!-- Drawer Body -->
      <q-scroll-area
        style="
          height: calc(94% - 120px);
          margin-top: 100px;
          margin-bottom: 20px;
        "
      >
        <q-list>
          <div v-for="item in links" :key="item.title">
            <q-item-label
              v-if="item.hasOwnProperty('header')"
              header
              class="text-bold text-primary"
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

      <q-btn
        color="primary"
        no-caps
        class="full-width q-mb-md"
        outline
        rounded
        @click="logout()"
        >Cerrar sesión</q-btn
      >
    </q-drawer>

    <modales-entidad :comportamiento="modales" />

    <ScrollToTopButton></ScrollToTopButton>

    <q-page-container :class="{ 'bg-body': true }">
      <router-view v-slot="{ Component }">
        <!-- <transition name="scale" mode="out-in">
          <essential-loading></essential-loading>
        </transition> -->
        <div class="text-right absolute-bottom">
          <footer-component></footer-component>
        </div>
        <!-- Aplica keep-alive aquí -->
        <keep-alive
          :exclude="[
            'intranet_page',
            'transacciones_ingresos',
            'Egresos',
            'OrdenCompraPage',
            'PreordenCompra',
            'Devoluciones',
            'RolPagoMes',
            'AcreditacionSemana',
            'TransferenciaProductoEmpleado',
            'AsignacionVehiculo',
            'TransferenciaVehiculo',
            'VacantePage',
          ]"
        >
          <component :is="Component" />
        </keep-alive>
      </router-view>
    </q-page-container>
  </q-layout>
</template>

<script src="./MainLayout.ts"></script>

<style lang="scss" scoped>
.lista-busqueda {
  position: fixed;
  top: 50px;
  z-index: 10;
}
</style>
