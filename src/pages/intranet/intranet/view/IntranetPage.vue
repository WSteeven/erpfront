<template>
  <!-- Navbar -->
  <q-header class="bg-desenfoque">
    <!-- Drawer Header -->
    <div class="row items-center justify-start">
      <div class="absolute-top q-pa-sm q-ma-sm rounded-card">
        <img
          :src="!$q.dark.isActive ? logoClaro : logoOscuro"
          height="30"
          class="q-mx-auto"
        />
      </div>

      <q-toolbar class="row items-center justify-end q-py-sm border-bottom">
        <span
          class="row"
          :class="{
            'q-gutter-x-sm': $q.screen.xs,
            'q-gutter-x-md': !$q.screen.xs,
          }"
        >
          <span
            class="row"
            :class="{
              'q-gutter-x-xs': $q.screen.xs,
              'q-gutter-x-sm': !$q.screen.xs,
            }"
          >
            <!-- Boton transferir tareas -->
            <!-- v-if="mostrarTransferirTareas" -->
            <q-btn dense unelevated no-caps class="q-px-sm bg-grey-4d">
              <!-- @click="abrirTransferirTareas()" -->
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
            <q-btn dense unelevated no-caps class="q-px-sm">
              <!-- @click="abrirMovilizacionSubtarea()" -->
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

            <!-- <q-separator vertical inset></q-separator> -->

            <!-- Boton notificaciones -->
            <q-btn dense unelevated no-caps class="q-pl-sm">
              <!-- @click.self="mostrarNotificaciones = true" -->
              <q-icon
                name="bi-bell"
                :class="{ 'q-mr-sm': !$q.screen.xs }"
                class="bg-icon color-icon-navbar q-pa-xs rounded-field"
                size="xs"
              ></q-icon>

              <!-- <span v-if="!$q.screen.xs">Notificaciones</span> -->
              <q-tooltip class="bg-dark">Notificaciones</q-tooltip>

              <!-- v-if="notificaciones.length > 0" -->
              <q-badge color="positive" floating><span>11</span> </q-badge>
            </q-btn>
          </span>

          <!-- Perfil -->
          <q-btn dense round flat glossy @click.self="mostrarMenu = true">
            <q-avatar size="38px">
              <img v-bind:src="imagenPerfil" />
            </q-avatar>

            <q-menu
              v-model="mostrarMenu"
              :self="selfCenterMiddle"
              transition-show="jump-down"
              transition-hide="jump-out"
              :style="{ 'min-width': width }"
              class="window-height bg-desenfoque custom-shadow"
              max-height="100vh"
            >
              <div class="column items-center q-py-sm window-height">
                <div class="full-width text-right q-pr-md">
                  <q-btn
                    icon="bi-x"
                    round
                    dense
                    unelevated
                    outline
                    color="grey-8"
                    @click="mostrarMenu = false"
                  ></q-btn>
                </div>

                <q-avatar size="72px" class="double-border q-mb-md">
                  <img v-bind:src="imagenPerfil" />
                </q-avatar>

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
    </div>
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
  <q-page padding>
    <q-banner v-if="showBanner" inline-actions class="text-white bg-orange">
      Noticia de Emergencia o Flash Informativo (Aqui iria la breve descripcion
      de la noticia o el suceso)
      <template v-slot:action>
        <q-btn flat color="white" label="VER NOTICIA" />
      </template>
    </q-banner>

    <!-- Columns start at 33.3% wide on mobile and bump up to 50% wide on desktop -->
    <div class="row q-col-gutter-sm q-mt-md q-mx-md q-mb-md">
      <div class="col-4 col-md-9">
        <q-carousel
          animated
          v-model="slide"
          navigation
          infinite
          :autoplay="autoplay"
          arrows
          transition-prev="slide-right"
          transition-next="slide-left"
          @mouseenter="autoplay = false"
          @mouseleave="autoplay = true"
        >
          <q-carousel-slide
            :name="1"
            img-src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSu9oEYyY5HK3BpL2GsAOV6wHrbHb1FkoTGu2pKqXKNlw&s"
          >
            <div class="absolute-bottom custom-caption">
              <div class="text-h2">Primera Noticia</div>
              <div class="text-subtitle1">JPCONSTRUCRED</div>
            </div>
          </q-carousel-slide>
          <q-carousel-slide
            :name="2"
            img-src="https://media.licdn.com/dms/image/C5622AQGTv_MeiL8E9A/feedshare-shrink_800/0/1652387694729?e=2147483647&v=beta&t=VUJzxfpA4GRO2jKQ2pWDXnR8LNfh6IuirXfr1dZvODU"
          >
            <div class="absolute-bottom custom-caption">
              <div class="text-h2">Segunda Noticia</div>
              <div class="text-subtitle1">JPCONSTRUCRED</div>
            </div>
          </q-carousel-slide>
          <q-carousel-slide
            :name="3"
            img-src="https://media.licdn.com/dms/image/C4D22AQHURssxoX0FAQ/feedshare-shrink_800/0/1643980715005?e=2147483647&v=beta&t=HLwKY4gOCsBPIBzusmztCrpCckmg858lLRvzotJFOK8"
          >
            <div class="absolute-bottom custom-caption">
              <div class="text-h2">Tercer Noticia</div>
              <div class="text-subtitle1">JPCONSTRUCRED</div>
            </div>
          </q-carousel-slide>
          <q-carousel-slide
            :name="4"
            img-src="https://media.licdn.com/dms/image/C4E22AQFcGv81a4EkZg/feedshare-shrink_800/0/1640622491601?e=2147483647&v=beta&t=h-G900B6dvVy8Lp45OlGGSqA3foD5opmAFBmgeIYGgo"
          >
            <div class="absolute-bottom custom-caption">
              <div class="text-h2">Cuarta Noticia</div>
              <div class="text-subtitle1">JPCONSTRUCRED</div>
            </div>
          </q-carousel-slide>
        </q-carousel>
      </div>
      <div class="col-4 col-md-3">
        <q-input
          v-model="search"
          filled
          type="search"
          hint=""
          placeholder="Buscar"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
        <q-card class="my-card">
          <div class="row q-pa-md">
            <div class="col-auto">
              <div class="relative-position">
                <q-img
                  :src="imagenPerfil"
                  width="100px"
                  height="100px"
                  fit="cover"
                  class="rounded-full"
                />
              </div>
            </div>
            <div class="col">
              <q-card-section class="text-left">
                {{ store.nombreUsuario }}
                <q-badge color="primary">{{ store.user?.email }}</q-badge>
                <q-badge rounded color="orange"
                  >{{ store.user?.cargo }}
                </q-badge>
              </q-card-section>
            </div>
          </div>
        </q-card>
        <q-separator />
        <div class="flex flex-center">
          <div class="row q-col-gutter-lm q-mt-md q-mx-md">
            <div class="col-6">
              <q-card flat class="my-card rounded-borders banner-transparent">
                <q-img
                  src="https://templates-flatlogic.herokuapp.com/vue-material/img/folder-green.3bc0a33b.svg"
                  width="175px"
                  height="125px"
                >
                  <!-- Ajustar el tamaño de la imagen -->
                  <div class="absolute-full text-caption banner-transparent">
                    <!-- Cambiar el tamaño del texto -->
                    <div class="text-body2 q-my-lg">
                      <q-btn
                        outline
                        rounded
                        color="clare"
                        label="Instructivos"
                        class="custom-border-button"
                        target="_blank"
                        href="https://drive.google.com/drive/folders/1Zv3eTjramxByFRht-L5Gz_nrulgFE32V?usp=sharing_eip_m&ts=64386770"
                      />
                    </div>
                  </div>
                </q-img>
                <q-card-actions> </q-card-actions>
              </q-card>
            </div>
            <div class="col-6 margen-pequeno">
              <q-card flat class="my-card rounded-borders banner-transparent">
                <q-img
                  src="https://templates-flatlogic.herokuapp.com/vue-material/img/folder-yellow.d553d1c6.svg"
                  width="175px"
                  height="125px"
                >
                  <!-- Ajustar el tamaño de la imagen -->
                  <div class="absolute-full text-caption banner-transparent">
                    <!-- Cambiar el tamaño del texto -->
                    <div class="text-body2 q-my-lg">
                      <q-btn
                        outline
                        rounded
                        color="clare"
                        label="Normativas"
                        class="custom-border-button"
                        target="_blank"
                        href="https://drive.google.com/drive/folders/1Zv3eTjramxByFRht-L5Gz_nrulgFE32V?usp=sharing_eip_m&ts=64386770"
                      />
                    </div>
                  </div>
                </q-img>
                <q-card-actions> </q-card-actions>
              </q-card>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row q-col-gutter-sm q-ml-sm q-pl-sm">
      <div class="col-6 col-md-3">
        <label class="q-mb-sm block"
          ><strong>Noticias Programadas</strong></label
        >
        <q-date
          v-model="date"
          :events="eventos"
          @update:model-value="verEvento(date)"
          :event-color="(date) => (date[9] % 2 === 0 ? 'teal' : 'orange')"
          minimal
          style="width: max-content"
        />
        <q-card class="solicitudes q-my-md">
          <q-card-section>
            <div class="text-h6">SOLICITUDES</div>
          </q-card-section>
          <q-separator />
          <q-card-section>
            <q-select
              v-model="solicitud.tipo_solicitud"
              label="Tipo de Solicitud"
              outlined
              :options="tiposSolicitudes"
            />
            <q-input
              v-model="solicitud.descripcion"
              label="Descripción"
              outlined
              type="textarea"
              rows="3"
            />
          </q-card-section>
          <q-card-actions class="justify-end">
            <q-btn flat @click="limpiarFormulario" color="primary"
              >Limpiar</q-btn
            >
            <q-btn @click="enviarSolicitud" color="primary" flat>Enviar</q-btn>
          </q-card-actions>
        </q-card>
      </div>
      <div class="col-3 col-md-6">
        <label>Modulos Permitidos</label>
        <div class="row">
          <div
            class="col-4 q-pa-md"
            v-for="(modulo, index) in modulosPermitidos"
            :key="index"
          >
            <q-btn
              class="glossy"
              :label="modulo"
              color="primary"
              rounded
              @click="goToModule(modulo)"
            />
          </div>
        </div>
      </div>
      <div class="col-3 col-md-3 items-lg-end">
        <q-expansion-item
          class="overflow-hidden q-mb-md expansion"
          :label="'Departamentos (' + departamentos.length + ')'"
          header-class="text-bold bg-header-collapse"
        >
          <q-card v-if="showDepartamentos">
            <q-card-section>
              <q-list bordered class="rounded-borders">
                <q-expansion-item
                  v-for="(departamento, index) in departamentos"
                  :key="index"
                  expand-separator
                  :label="index + 1 + '. ' + departamento.nombre"
                  group="evento"
                  dense
                  :caption="departamento.responsable"
                  @click="consultarEmpleadosDepartamento(departamento.id)"
                >
                  <q-card v-for="(empleado, index) in empleados" :key="index">
                    <div class="row q-col-gutter-sm q-my-xs q-mx-md">
                      <div class="col-6 col-md-2">
                        <q-avatar>
                          <img
                            :src="
                              empleado.foto_url == null
                                ? `https://ui-avatars.com/api/?name=${empleado.nombres.substr(
                                    0,
                                    1
                                  )}+${empleado.apellidos.substr(
                                    0,
                                    1
                                  )}&bold=true&background=0879dc28&color=0879dc`
                                : empleado.foto_url
                            "
                          />
                        </q-avatar>
                      </div>
                      <div class="col-6 col-md-10 q-my-md margen-pequeno">
                        <p class="margen-pequeno">
                          {{ empleado.nombres + ' ' + empleado.apellidos }}
                        </p>
                        <small>{{ empleado.cargo }}</small>
                      </div>
                    </div>
                  </q-card>
                </q-expansion-item>
              </q-list>
            </q-card-section>
          </q-card>
        </q-expansion-item>
      </div>
    </div>
    <div class="row q-col-gutter-sm">
      <div class="col-6 col-md-3"></div>
      <div class="col-6 col-md-6 flex flex-center"></div>
      <div class="col-6 col-md-3 items-lg-end"></div>
    </div>

    <!-- Componente de modales -->
    <modales-entidad
      :comportamiento="modales"
      :fullWidth="false"
      :maximized="false"
      :persistente="false"
    />
  </q-page>
</template>

<style>
.custom-caption {
  text-align: center;
  padding: 12px;
  color: white;
  background-color: rgba(0, 0, 0, 0.3);
}

.banner-transparent {
  background: rgba(0, 0, 0, 0) !important;
  margin-top: 8%;
  border: none !important;
}
.margen-pequeno {
  padding-left: 4%;
  padding-right: 4%;
}
</style>

<script src="./IntranetPage.ts"></script>
