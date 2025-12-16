<template>
  <q-page>
    <div class="row q-col-gutter-sm q-mx-md q-mb-md">
      <!-- SECCION DERECHA -->
      <div class="col-12">
        <!-- <div class="q-py-md text-h5 text-bold">Últimas noticias</div> -->
      </div>
      <div class="col-12 col-md-9">
        <!-- Noticias -->
        <div class="q-mb-sm">
          <q-carousel
            v-if="noticias.length > 0"
            class="carousel-noticias no-border custom-shadow"
            style="border-radius: 15px; overflow: hidden"
            animated
            v-model="carousel_noticias"
            navigation
            navigation-position="right"
            :height="$q.screen.xs ? '600px' : '400px'"
            autoplay
            autoplay-interval="3000"
            infinite
          >
            <template v-slot:navigation-icon="{ active, btnProps, onClick }">
              <q-btn
                v-if="active"
                size="lg"
                icon="la la-newspaper"
                color="primary"
                flat
                round
                dense
                @click="onClick"
              />
              <q-btn
                v-else
                size="sm"
                :icon="btnProps.icon"
                color="grey-11"
                flat
                round
                dense
                @click="onClick"
              />
            </template>

            <q-carousel-slide
              v-for="(noticia, index) in noticias"
              :key="index"
              :name="index"
              class="carousel-slide-noticias row q-py-md"
            >
              <q-img
                v-if="noticia.imagen_noticia"
                :src="noticia.imagen_noticia"
                :alt="noticia.titulo"
                class="col-12 col-md-5 noticias-imagfe"
                style="border-radius: 15px"
                :style="{
                  objectFit: 'cover',
                  height: $q.screen.xs ? '30%' : '100%'
                }"
              />
              <div class="col-12 col-md-7 q-pl-md">
                <h5 class="q-mb-sm q-pr-xl" style="text-transform: uppercase">
                  {{ noticia.titulo }}
                </h5>
                <p
                  class="noticias-description q-mb-md justify-text"
                  v-html="getShortDescription(noticia.descripcion)"
                ></p>
                <q-btn
                  class="noticias-read-more bottom-right q-mb-md"
                  color="primary"
                  unelevated
                  @click="verNoticiaCompletaHandler(noticia.id)"
                >
                  Ver Noticia
                </q-btn>
              </div>
            </q-carousel-slide>
          </q-carousel>

          <q-card v-else class="q-pa-md no-border rounded shadow-chip">
            <div class="full-width">
              <img
                src="../../../../assets/latam2.gif"
                alt="Sin noticias"
                style="width: 100%; height: auto; border-radius: 15px"
              />
            </div>
          </q-card>
        </div>

        <!--Modal para ver Noticias Completas-->
        <q-dialog
          v-model="modalNoticia"
          transition-show="scale"
          transition-hide="scale"
          :maximized="$q.screen.sm || $q.screen.xs"
        >
          <q-card class="noticia-modal-card" style="min-width: 50%">
            <q-card-section class="row q-pb-none">
              <q-space />
              <q-btn
                icon="close"
                color="negative"
                dense
                class="noticia-mdodal-close-btn"
                v-close-popup
              />
            </q-card-section>
            <q-card-section class="noticia-modal-content">
              <q-img
                :src="noticiaCompleta?.imagen_noticia"
                :alt="noticiaCompleta?.titulo"
                class="noticia-modal-image"
              />
              <div class="noticia-modal-headegr">
                <div class="noticia-modal-categohries">
                  <q-badge>{{ noticiaCompleta?.categoria }}</q-badge>
                  <q-badge
                    v-for="etiqueta in noticiaCompleta?.etiquetas"
                    :key="etiqueta"
                    class="noticia-modal-badge"
                    color="green-6"
                    >{{ etiqueta }}
                  </q-badge>
                </div>

                <div class="noticia-modal-autor-container">
                  <div class="noticia-modal-autor">
                    ✍️ : {{ noticiaCompleta?.autor }}
                  </div>
                  <div class="noticia-modal-fecha">
                    🗓️ : {{ noticiaCompleta?.created_at }}
                  </div>
                </div>
              </div>
              <div class="noticia-modal-body">
                <div class="noticia-modal-titulo">
                  {{ noticiaCompleta?.titulo }}
                </div>
                <div
                  v-html="noticiaCompleta?.descripcion"
                  class="noticia-modal-descripcion"
                ></div>
              </div>
            </q-card-section>
          </q-card>
        </q-dialog>

        <!--Mis Modulos-->
        <div id="#mis_modulos" class="col-12 col-md-9 q-mb-sm">
          <div
            class="q-py-xs text-h6 bg-grey-9 text-white text-bold q-mb-sm rounded-borders text-center"
          >
            MÓDULOS DISPONIBLES
          </div>

          <div class="row q-col-gutter-sm q-mb-xl">
            <div
              v-for="(modulo, index) in modulosPermitidos"
              :key="index"
              class="col-xs-3 col-md-1"
            >
              <q-btn
                :to="modulo.link"
                class="rounded shadow-chip q-pa-md full-width full-height"
                flat
                unelevated
                rounded
                dense
              >
                <div
                  style="
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                  "
                >
                  <q-icon
                    :name="modulo.icon"
                    class="idcon-content-modulos text-color"
                    size="28px"
                  >
                    <q-tooltip anchor="bottom middle" self="bottom middle">
                      {{ modulo.title }}
                    </q-tooltip>
                  </q-icon>
                  <div
                    style="font-size: 9px; margin-top: 5px"
                    class="text-blue-grey-9"
                  >
                    {{ modulo.title }}
                  </div>
                </div>
              </q-btn>
            </div>
          </div>
        </div>

        <!-- Empleados Nuevos -->
        <q-card v-if="empleadosNuevos && empleadosNuevos.length > 0" flat class="col-12 col-md-9 q-mb-sm">
          <q-card-section class="bg-white text-accent">
            <div class="text-h6 text-bold text-center text-uppercase">
              Nuevos Colaboradores
            </div>
            <p class="text-grey-8 text-center text-caption">
              Conoce a nuestros nuevos talentos.
            </p>
          </q-card-section>

          <q-carousel
            v-model="carouselNuevosEmpleados"
            animated
            swipeable
            infinite
            :autoplay="true"
            :interval="2000"
            arrows
            navigation
            height="400px"
            class="rounded-borders"
          >
            <!-- Generar slides dinámicamente usando Math.ceil -->
            <q-carousel-slide
              v-for="pageNumber in Math.ceil(empleadosNuevos.length / 4)"
              :key="`page-${pageNumber}`"
              :name="pageNumber - 1"
              class="column fit justify-center q-pa-md"
            >
              <!-- Mostrar 4 empleados por página usando slice -->
              <div
                class="row q-col-gutter-md justify-center items-center full-height"
              >
                <div
                  v-for="empleado in empleadosNuevos.slice(
                    (pageNumber - 1) * 3,
                    pageNumber * 3
                  )"
                  :key="empleado.id"
                  class="col-12 col-sm-6 col-md-auto"
                >
                  <q-card
                    flat
                    class="text-center q-pa-lg full-height shadow-1 column justify-between"
                    style="width: 300px"
                  >
                    <!-- Avatar con badge -->
                    <div class="col-auto">
                      <div class="relative-position q-mb-md">
                        <q-avatar size="100px" class="shadow-4">
                          <img
                            :src="empleado.foto_url || getAvatarUrl(empleado)"
                            :alt="`Foto de ${empleado.nombres} ${empleado.apellidos}`"
                          />
                        </q-avatar>

                        <q-badge
                          floating
                          color="positive"
                          rounded
                          class="text-caption"
                          label="Nuevo"
                        />
                      </div>
                    </div>

                    <!-- Info del empleado -->
                    <div class="col column q-gutter-xs">
                      <!-- Nombre destacado -->
                      <div
                        class="text-h6 text-weight-bold text-primary ellipsis"
                      >
                        {{ empleado.nombres }}
                      </div>
                      <div
                        class="text-h6 text-weight-bold text-primary ellipsis q-mb-sm"
                      >
                        {{ empleado.apellidos }}
                      </div>

                      <!-- Cargo como chip -->
                      <div class="q-mb-sm">
                        <q-chip
                          color="secondary"
                          text-color="white"
                          class="text-caption text-weight-medium"
                          :label="empleado.cargo"
                        />
                      </div>

                      <!-- Departamento con ícono -->
                      <div
                        class="row items-center justify-center q-gutter-xs q-mb-sm"
                      >
                        <q-icon name="business" size="16px" color="grey-6" />
                        <div class="text-body2 text-grey-6 ellipsis">
                          {{ empleado.departamento }}
                        </div>
                      </div>

                      <!-- Tiempo de ingreso -->
                      <div class="row items-center justify-center q-gutter-xs">
                        <q-icon name="schedule" size="16px" color="positive" />
                        <div
                          class="text-caption text-positive text-weight-medium"
                        >
                          Ingresó {{ dayjs(empleado.fecha_ingreso).fromNow() }}
                        </div>
                      </div>
                    </div>
                  </q-card>
                </div>
              </div>
            </q-carousel-slide>
          </q-carousel>
        </q-card>

        <!-- Departamentos -->
        <div class="row q-col-gutter-lg">
          <!-- DEPARTAMENTOS (card acoplable) -->
          <div class="col-12 col-lg-12">
            <q-card class="rounded-borders shadow-10 highlight">
              <div
                class="gradient-brand text-white rounded-t-borders q-pa-md row items-center bg-primary"
              >
                <!-- Columna izquierda (vacía o con contenido opcional) -->
                <div class="col-3"></div>

                <!-- Columna central con el título -->
                <div class="col-6 text-center">
                  <div class="row items-center justify-center q-gutter-sm">
                    <q-icon name="bi-buildings-fill" size="15px" />
                    <div class="text-h6 text-weight-bold text-uppercase">
                      Departamentos
                    </div>
                  </div>
                </div>

                <!-- Columna derecha con el badge -->
                <div class="col-3 text-right">
                  <q-badge
                    color="white"
                    text-color="primary"
                    class="text-weight-bold"
                    >{{ departamentos?.length || 0 }} áreas</q-badge
                  >
                </div>
              </div>

              <!-- Chips de departamentos, fáciles de mover/usarse en otro lugar -->
              <q-card-section class="q-pb-none">
                <div class="row items-center no-wrap">
                  <!-- Botón izquierdo -->
                  <q-btn
                    flat
                    round
                    dense
                    icon="chevron_left"
                    color="grey-6"
                    size="sm"
                    class="q-mr-sm"
                    @click="
                      $refs.scrollArea.setScrollPosition(
                        'horizontal',
                        Math.max(
                          0,
                          $refs.scrollArea.getScrollPosition().left - 150
                        ),
                        300
                      )
                    "
                  />

                  <!-- Área scrolleable -->
                  <div class="col">
                    <q-scroll-area
                      ref="scrollArea"
                      style="height: 46px"
                      :bar-style="{ display: 'none' }"
                      :thumb-style="{ display: 'none' }"
                    >
                      <div class="row no-wrap q-gutter-sm q-px-xs">
                        <q-chip
                          v-for="d in departamentos"
                          :key="d.id"
                          clickable
                          outline
                          :color="activeTab === d.id ? 'primary' : 'grey-5'"
                          :text-color="
                            activeTab === d.id ? 'primary' : 'grey-7'
                          "
                          icon="apartment"
                          @click="
                            () => {
                              activeTab = d.id
                              consultarEmpleadosDepartamento(d.id)
                            }
                          "
                        >
                          {{ d.nombre }}
                        </q-chip>
                      </div>
                    </q-scroll-area>
                  </div>

                  <!-- Botón derecho -->
                  <q-btn
                    flat
                    round
                    dense
                    icon="chevron_right"
                    color="grey-6"
                    size="sm"
                    class="q-ml-sm"
                    @click="
                      $refs.scrollArea.setScrollPosition(
                        'horizontal',
                        $refs.scrollArea.getScrollPosition().left + 150,
                        300
                      )
                    "
                  />
                </div>
              </q-card-section>

              <!-- Resumen rápido -->
              <q-card-section class="q-pt-sm q-pb-sm">
                <div class="row q-col-gutter-md">
                  <div class="col-6 col-md-3">
                    <q-item class="mini-stat hover-lift" clickable>
                      <q-item-section avatar>
                        <q-avatar icon="groups" class="bg-primary text-white" />
                      </q-item-section>
                      <q-item-section>
                        <div class="text-caption text-grey-6">Empleados</div>
                        <div class="text-h6">{{ empleados?.length || 0 }}</div>
                      </q-item-section>
                    </q-item>
                  </div>
                  <div class="col-6 col-md-3">
                    <q-item class="mini-stat hover-lift" clickable>
                      <q-item-section avatar>
                        <q-avatar
                          icon="workspace_premium"
                          class="bg-amber text-white"
                        />
                      </q-item-section>
                      <q-item-section>
                        <div class="text-caption text-grey-6">Jefaturas</div>
                        <div class="text-h6">
                          {{ totalJefaturas || 0 }}
                        </div>
                      </q-item-section>
                    </q-item>
                  </div>
                  <div class="col-6 col-md-3">
                    <q-item class="mini-stat hover-lift" clickable>
                      <q-item-section avatar>
                        <q-avatar icon="event" class="bg-green-6 text-white" />
                      </q-item-section>
                      <q-item-section>
                        <div class="text-caption text-grey-6">
                          Antigüedad media
                        </div>
                        <div class="text-h6">
                          {{ promedioAntiguedad?.label || '—' }}
                        </div>
                      </q-item-section>
                    </q-item>
                  </div>
                  <div class="col-6 col-md-3">
                    <q-item class="mini-stat hover-lift" clickable>
                      <q-item-section avatar>
                        <q-avatar icon="badge" class="bg-blue-6 text-white" />
                      </q-item-section>
                      <q-item-section>
                        <div class="text-caption text-grey-6">
                          Cargos únicos
                        </div>
                        <div class="text-h6">
                          {{ cargosUnicos?.length || 0 }}
                        </div>
                      </q-item-section>
                    </q-item>
                  </div>
                </div>
              </q-card-section>

              <!-- Vista empleados del dpto activo: grid adaptativa (reemplaza a timeline si prefieres) -->
              <q-separator />
              <q-card-section class="q-pt-md">
                <div
                  class="row q-col-gutter-md"
                  style="height: 450px; overflow: auto"
                >
                  <div
                    v-for="empleado in empleados"
                    :key="empleado.id"
                    class="col-12 col-sm-6 col-md-6"
                  >
                    <q-card
                      flat
                      bordered
                      class="rounded-borders hover-lift emp-card"
                    >
                      <q-card-section class="row items-center q-gutter-sm">
                        <q-avatar size="56px" class="avatar-ring">
                          <img
                            :src="empleado.foto_url || getAvatarUrl(empleado)"
                          />
                        </q-avatar>
                        <div class="col">
                          <div class="text-subtitle2 text-weight-bold ellipsis">
                            {{ empleado.nombres }} {{ empleado.apellidos }}
                          </div>
                          <div class="text-caption text-grey-7 ellipsis">
                            {{ empleado.cargo }}
                          </div>
                          <div class="text-lowercase text-grey-6 ellipsis">
                            {{ empleado.email }}
                          </div>
                        </div>
                      </q-card-section>
                      <q-separator />
                      <q-card-actions
                        align="between"
                        class="text-caption text-grey-7"
                      >
                        <div class="row items-center q-gutter-xs">
                          <q-icon name="las la-user-tie" size="16px" />
                          <span class="text-weight-bold">JEFE:</span>
                          <span>{{ empleado.jefe }}</span>
                        </div>
                        <q-chip
                          v-if="empleado.extension"
                          size="sm"
                          color="teal-5"
                          text-color="white"
                          icon="call"
                        >
                          {{ empleado.extension }}
                        </q-chip>
                      </q-card-actions>
                    </q-card>
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>

        <!-- Seccion descargate la app movil  -->
        <q-card
          class="q-pa-lg q-mx-auto q-my-xl app-download-card bg-primary"
          flat
        >
          <div class="row items-center q-col-gutter-xl">
            <!-- Icono grande -->
            <div class="col-auto">
              <q-avatar size="80px" class="app-download-avatar">
                <q-icon name="las la-mobile" size="40px" />
              </q-avatar>
            </div>

            <!-- Texto -->
            <div class="col">
              <div class="text-h5 text-weight-bold q-mb-sm">
                ¡Descarga nuestra App Móvil!
              </div>
              <div class="text-subtitle2">
                Lleva la intranet contigo a donde vayas.
              </div>
            </div>

            <!-- Botones -->
            <div class="col-12 col-sm-auto">
              <q-card class="q-pa-md app-download-btns" flat bordered>
                <div class="row items-center q-gutter-md no-wrap">
                  <!-- Android -->
                  <q-btn
                    color="green-6"
                    icon="android"
                    label="Android"
                    no-caps
                    glossy
                    unelevated
                    rounded
                    :href="link_app_movil ?? `${url_sistema}/firstred-app.apk`"
                    target="_blank"
                  />

                  <!-- iOS -->
                  <div class="column items-center">
                    <small class="text-grey-7">Próximamente…</small>
                    <q-btn
                      color="white"
                      text-color="black"
                      icon="apple"
                      label="iOS"
                      no-caps
                      unelevated
                      rounded
                      @click="notificarProximamente"
                    />
                  </div>
                </div>
              </q-card>
            </div>
          </div>
        </q-card>
      </div>

      <!--SECCION IZQUIERDA-->
      <div class="col-12 col-md-3">
        <!-- Card Empleado -->
        <q-card class="q-mb-sm custom-shadow no-border rounded">
          <div class="q-pa-md text-center">
            <div class="q-mt-md">
              <p class="text-h5 text-weight-bold">
                <strong>¡ BIENVENIDO !</strong>
              </p>
              <div
                class="q-mb-md text-subtitle text-primary q-pa-sm"
                style="
                  font-family: Impact, sans-serif;
                  font-size: 30px;
                  text-transform: uppercase;
                "
              >
                {{ store.user?.nombres }} {{ store.user?.apellidos }}
              </div>
              <div>
                <q-chip
                  outline
                  color="primary"
                  text-color="white"
                  icon="las la-envelope"
                  class="q-ml-sm"
                  dense
                >
                  <small class="q-pa-sm text-bold text-primary">{{
                    store.user?.email
                  }}</small>
                </q-chip>
              </div>
              <div>
                <q-chip
                  outline
                  color="primary"
                  text-color="white"
                  icon="las la-user-graduate"
                  class="q-ml-sm"
                  dense
                >
                  <small class="q-pa-sm text-bold text-primary">{{
                    store.user?.cargo
                  }}</small>
                </q-chip>
              </div>
            </div>

            <div class="column q-gutter-xs q-mt-md q-mb-md q-mx-auto">
              <q-btn
                href="https://drive.google.com/drive/folders/11bJYA0SbPeGaESQfi6TKaFQEa_RaxlE6?usp=drive_link"
                color="blue-14"
                class="bg-blue-1"
                icon-right="las la-external-link-alt"
                label="Manuales"
                target="_blank"
                unelevated
                outline
                no-caps
              />
              <q-btn
                :href="correo"
                color="blue-14"
                class="bg-blue-1"
                icon-right="las la-external-link-alt"
                label="Ir a mi correo"
                target="_blank"
                unelevated
                outline
                no-caps
              />

              <!--               <q-btn
                icon-right="las la-external-link-alt"
                label="Plugins"
                class="bg-blue-1"
                outline
                no-caps
                color="blue-14"
                unelevated
                href="https://drive.google.com/drive/folders/1KypTE2iv-2pHbwQxpzVhVPEhf5Ra8fow?usp=sharing"
                target="_blank"
              ></q-btn> -->

              <q-btn
                v-for="documento in documentosIntranet"
                :key="documento.id"
                :href="documento.link"
                target="_blank"
                :label="documento.name"
                class="bg-teal-1"
                no-caps
                outline
                unelevated
                icon-right="las la-external-link-alt"
                :color="documento.color"
              >
              </q-btn>
            </div>
          </div>
        </q-card>

        <!--Sección de Extensiones-->
        <q-card flat class="q-mb-sm">
          <q-expansion-item
            style="
              background-color: darkslategrey;
              color: white;
              font-size: 13px;
              font-weight: bold;
              border-radius: 5px;
            "
            label="EXTENSIONES TELEFÓNICAS"
            icon="bi-telephone-fill"
            header-class="text-white"
            default-opened
          >
            <div
              v-if="empleadosConExtension.length > 0"
              class="extensiones-scroll bg-solid q-pa-sm"
            >
              <q-card
                v-for="(empleado, index) in empleadosConExtension"
                :key="index"
                class="extensiones-item"
              >
                <!-- Círculo de la extensión -->
                <div class="extensiones-circle">
                  {{ empleado.extension }}
                </div>

                <!-- Información del empleado -->
                <div class="extensiones-info text-left">
                  <div class="text-primary">
                    {{ empleado.nombres }} {{ empleado.apellidos }}
                  </div>
                  <div class="text-grey-10">
                    {{ empleado.cargo }}
                  </div>
                  <div class="text-grey-5">
                    DPTO.
                    {{ empleado.departamento }}
                  </div>
                </div>
              </q-card>
            </div>

            <div v-else class="sin-datos bg-solid">
              No hay empleados con extensión disponible.
            </div>
          </q-expansion-item>
        </q-card>

        <!--Sección de Vacantes-->
        <q-card
          v-if="vacantesDisponibles"
          flat
          bordered
          class="q-mb-sm"
          style="border-radius: 10px; overflow: hidden"
        >
          <q-expansion-item
            style="
              text-align-last: center;
              background-color: gray;
              color: white;
              font-size: 13px;
              font-weight: bold;
              border-radius: 10px;
            "
            icon="bi-megaphone-fill"
            label="VACANTES"
            :default-opened="true"
          >
            <q-carousel
              v-if="vacantesDisponibles.length > 0"
              v-model="carousel_vacantes"
              swipeable
              animated
              :arrows="vacantesDisponibles.length > 1"
              height="450px"
              control-text-color="teal"
              autoplay
              autoplay-interval="3000"
              infinite
            >
              <q-carousel-slide
                v-for="(vacante, index) in vacantesDisponibles"
                :key="index"
                :name="index"
                class="bg-white q-pa-sm"
              >
                <div class="bg-white rounded-8">
                  <img
                    :src="vacante.imagen_publicidad"
                    style="
                      width: 100%;
                      height: 250px;
                      object-fit: cover;
                      border-radius: 8px;
                    "
                  />
                  <p class="text-white bg-primary">{{ vacante.nombre }}</p>
                  <div
                    class="q-px-xs text-caption text-grey text-justify"
                    style="cursor: pointer"
                    @click="visualizarVacante(vacante)"
                  >
                    <p>{{ acortarDescripcion($q, vacante.descripcion) }}</p>
                    <q-tooltip
                      anchor="center middle"
                      self="bottom middle"
                      :offset="[0, 12]"
                    >
                      Ver vacante
                    </q-tooltip>
                  </div>
                  <q-separator />
                  <div class="row q-pa-sm text-black" style="font-size: 11px">
                    <div class="col-6">
                      <q-icon class="bi-clock-fill text-green" />
                      <strong class="q-px-sm">
                        {{
                          dayjs() > dayjs(vacante.fecha_caducidad)
                            ? 'FINALIZADO'
                            : 'FINALIZA ' +
                              dayjs().to(vacante.fecha_caducidad).toUpperCase()
                        }}
                      </strong>
                    </div>
                    <div class="col-6">
                      <q-icon class="bi-geo-alt-fill text-red" />
                      <strong class="q-px-sm">
                        {{ vacante.canton }}
                      </strong>
                    </div>
                  </div>
                </div>
              </q-carousel-slide>
            </q-carousel>
            <div
              v-else
              style="background-color: WHITE; color: #555; padding: 20px"
            >
              No hay vacantes disponibles
            </div>
          </q-expansion-item>
        </q-card>

        <!--Formulario de Solicitudes-->
        <q-expansion-item
          style="
            background-color: slategray;
            color: white;
            font-size: 12px;
            font-weight: bold;
            text-align: center;
            border-radius: 10px;
          "
          icon="bi-bookmark-heart"
          dense-toogle
          label="SOLICITUDES"
          :default-opened="false"
          class="q-mb-sm"
        >
          <div style="background-color: WHITE; padding: 20px">
            <q-form @submit.prevent="enviarSolicitud">
              <q-select
                v-model="solicitud.tipo_solicitud"
                :options="tiposSolicitudes"
                label="Tipo de Solicitud"
                emit-value
                outlined
                dense
                style="
                  margin-bottom: 16px;
                  border-radius: 10px;
                  background-color: midnightblue;
                "
              ></q-select>
              <q-btn
                type="submit"
                color="green"
                label="REALIZAR"
                style="
                  width: 100%;
                  font-weight: bold;
                  letter-spacing: 0.5px;
                  border-radius: 10px;
                  background-color: blue;
                  color: white;
                "
                outline
              ></q-btn>
            </q-form>
          </div>
        </q-expansion-item>

        <!--Calendario de Eventos-->

        <q-expansion-item
          style="
            background-color: #555;
            color: white;
            font-size: 12px;
            font-weight: bold;
            text-align: center;
            border-radius: 10px;
          "
          icon="bi-calendar-event"
          label="EVENTOS DEL MES"
          :default-opened="true"
        >
          <q-card-section
            style="margin: 0; background-color: #ffffff; color: black"
          >
            <div class="q-py-sm bg-primary text-white text-bold text-center">
              <i class="bi bi-cake2" style="margin-right: 10px"></i>
              CUMPLEAÑEROS
            </div>
            <q-separator />

            <q-card-section
              style="
                display: flex;
                justify-content: center;
                height: 130px;
                border-radius: 0 0 15px 15px;
                background-color: white;
              "
            >
              <q-scroll-area
                class="bg-white-4 rounded-borders"
                style="height: 100px; overflow-x: auto; width: 100%"
              >
                <div
                  class="row no-wrap items-center q-gutter-x-sm"
                  style="
                    display: flex;
                    flex-wrap: nowrap;
                    justify-content: center;
                    padding-left: 30px;
                    height: 100px;
                    max-width: 900px;
                  "
                >
                  <div
                    v-for="empleado in empleadosCumpleaneros"
                    :key="empleado.id"
                    class="avatar-item-container"
                    style="margin-right: 15px"
                  >
                    <q-avatar
                      size="xl"
                      class="avatar-item"
                      @click="openCumpleanerosModal(empleado)"
                      style="cursor: pointer"
                    >
                      <img
                        :src="
                          empleado.foto_url == null
                            ? `https://ui-avatars.com/api/?name=${empleado.nombres.substr(
                                0,
                                1
                              )}+${empleado.apellidos.substr(
                                0,
                                1
                              )}&bold=true&background=008000&color=ffff`
                            : empleado.foto_url
                        "
                      />
                      <q-badge
                        floating
                        class="bottom-left bg-primary text-white"
                      >
                        {{ new Date(empleado.fecha_nacimiento).getUTCDate() }}
                      </q-badge>
                      <q-tooltip anchor="bottom middle" self="bottom middle">
                        {{ empleado.nombres }} {{ empleado.apellidos }}
                      </q-tooltip>
                    </q-avatar>
                  </div>
                </div>
              </q-scroll-area>
            </q-card-section>

            <!-- Modal para ver información de los Cumpleañeros -->
            <q-dialog v-model="isCumpleanerosModalOpen">
              <q-card class="custom-cumpleaneros-modal">
                <q-card-section class="custom-modal-section q-pa-lg">
                  <!-- Imagen del empleado -->
                  <q-avatar size="150px" class="custom-avatar q-mb-md">
                    <img
                      :src="
                        selectedEmpleado.foto_url ||
                        `https://ui-avatars.com/api/?name=${selectedEmpleado.nombres.substr(
                          0,
                          1
                        )}+${selectedEmpleado.apellidos.substr(
                          0,
                          1
                        )}&bold=true&background=008000&color=ffff`
                      "
                    />
                  </q-avatar>

                  <!-- Gorro de cumpleaños -->
                  <img
                    src="../../../../assets/hat-birthday.png"
                    alt="Gorro de Cumpleaños"
                    class="birthday-hat"
                  />

                  <!-- Nombre completo -->
                  <div class="custom-name text-h6 q-mb-xs">
                    <p class="custom-antiguedad text-caption q-mb-md">
                      🎉 ¡¡ FELICITACIONES !! 🎉
                    </p>
                    {{ selectedEmpleado.nombres }}
                    {{ selectedEmpleado.apellidos }}
                  </div>

                  <!-- Cargo -->
                  <div class="custom-cargo text-subtitle2 q-mb-sm">
                    {{ selectedEmpleado.cargo }}
                  </div>

                  <!-- Correo electrónico -->
                  <div class="custom-email text-subtitle2 q-mb-xs">
                    <q-badge color="primary"
                      >{{ selectedEmpleado.email }}
                    </q-badge>
                  </div>

                  <!-- Antigüedad -->
                  <div class="custom-antiguedad text-caption q-mb-md">
                    <strong>Antigüedad: </strong
                    >{{
                      calcularAntiguedad(selectedEmpleado.fecha_vinculacion)
                    }}
                  </div>

                  <!-- Edad que cumple -->
                  <div class="custom-age text-h3 q-mt-lg">
                    {{ calcularEdadEsteAno(selectedEmpleado.fecha_nacimiento) }}
                    <strong>AÑOS</strong>
                  </div>
                </q-card-section>

                <!-- Globos en los costados del modal -->
                <div class="balloon left-balloon">
                  <img
                    src="../../../../assets/globos.png"
                    alt="Globo Izquierda"
                  />
                </div>
                <div class="balloon right-balloon">
                  <img
                    src="../../../../assets/globos.png"
                    alt="Globo Derecha"
                  />
                </div>

                <!-- Botón cerrar -->
                <div class="close-button-container">
                  <q-btn
                    class="glossy"
                    round
                    color="red"
                    icon="close"
                    @click="isCumpleanerosModalOpen = false"
                  />
                </div>
              </q-card>
            </q-dialog>
          </q-card-section>

          <q-card-section style="background-color: #ffffff; color: #003f68">
            <div>
              <Qalendar
                :events="eventosFormateados"
                :config="configuracion"
                @event-click="verEvento"
              />
              <!--Modal para Visualizar Evento-->
              <q-dialog
                v-model="dialogoVisible"
                transition-show="scale"
                transition-hide="scale"
                class="event-modal"
              >
                <q-card class="event-card">
                  <q-card-section class="event-card-section">
                    <div class="event-card-title">
                      {{ eventoSeleccionado?.titulo }}
                    </div>
                    <q-badge>{{ eventoSeleccionado?.autor }}</q-badge>
                    <q-card class="event-card-description">
                      <q-scroll-area style="height: 100px; max-width: 300px">
                        {{ eventoSeleccionado?.descripcion }}
                      </q-scroll-area>
                    </q-card>
                    <div class="event-card-time">
                      <q-badge color="green-6"
                        >{{ eventoSeleccionado?.fecha_hora_inicio }}
                      </q-badge>
                      -
                      <q-badge color="amber"
                        >{{ eventoSeleccionado?.fecha_hora_fin }}
                      </q-badge>
                    </div>
                  </q-card-section>
                  <q-card-actions align="right" class="event-card-actions">
                    <q-btn flat label="Cerrar" color="primary" v-close-popup />
                  </q-card-actions>
                </q-card>
              </q-dialog>
            </div>
          </q-card-section>
        </q-expansion-item>
      </div>
    </div>

    <!-- Botón de

        <q-input v-model="searchQuery" label="Buscar módulo" @input="filtrarMenu(searchQuery)" />
    <q-list>
      <q-item v-for="link in resultadosBusqueda" :key="link.link">
        <q-item-section>{{ link.label }}</q-item-section>
      </q-item>
    </q-list>

    búsqueda -->

    <!-- Componente de modales -->
    <modales-entidad
      :comportamiento="modales"
      :fullWidth="false"
      :maximized="false"
      :persistente="false"
    />
  </q-page>
</template>

<!--Estilos del calendario Qalendar-->
<style lang="scss">
@import 'qalendar/dist/style.css';

.tab-active-intranet {
  font-weight: bold;
  color: $primary;
  // font-size: 1.5rem;
}

/* Estilo para pintar todo el cuadro del día con evento */
.qalendar-day.has-event {
  background-color: #e0f7fa !important;
  /* Color de fondo personalizado */
  border-radius: 4px !important;
  /* Ajuste del radio de borde */
  color: white !important;
  /* Color del texto */
  font-weight: bold;
  /* Hace que el texto sea negrita para destacar */
}
</style>

<!--Estilos de Intranet Page-->
<style scoped>
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

.absolute-bottom-right {
  position: absolute;
  bottom: 10px;
  right: 10px;
}

.rounded-borders {
  border-radius: 8px;
}

.carousel-slide-noticias {
  display: flex;
  align-items: center;
}

h5 {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.text-subtitle {
  font-size: 1rem;
  color: #666;
  margin-bottom: 1rem;
}

.icon-content-modulos {
  cursor: pointer;
  justify-content: center;
  font-size: 100px;
}

.icon-content-empleado {
  cursor: pointer;
  margin: 0 10px;
  font-size: 100px;
}

.q-gutter-x-sm {
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
}

.fixed-size-card-departamentos {
  border-radius: 15px;

  height: 560px;
  display: flex;
  flex-direction: column;
}

.fixed-size-card-departamentos .q-expansion-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.fixed-size-card-departamentos .q-expansion-item .q-card-section,
.fixed-size-card-departamentos .q-expansion-item .q-tab-panels {
  flex: 1;
  overflow-y: auto;
}

.department-card {
  border: 1px solid #ccc;
  border-radius: 15px;
  overflow-y: auto;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.department-details {
  display: flex;
  gap: 20px;
  padding: 20px;
}

.empleado-nombre {
  color: #00796b;
  font-weight: bold;
  font-size: 18px;
}

.column {
  flex: 1;
  overflow-y: auto;
}

.column h3 {
  margin-bottom: 10px;
}

.column ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.column ul li {
  margin-bottom: 8px;
}

.column ul li strong {
  font-weight: bold;
  color: #333;
}

.overlapping {
  border: 2px solid white;
  position: absolute;
}

.noticias-image {
  max-width: 125%;
  max-height: 100%;
}

.noticias-description {
  text-align: justify;
  padding-right: 75px;
}

@media (max-width: 768px) {
  .icon-container-modulos {
    display: flex;
    flex-wrap: wrap;

    align-content: center;
  }

  .icon-link-modulos {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .icon-content-modulos {
    font-size: 12px;
  }

  .badge-below-icon {
    margin-top: 15px;
    /* Añade un espacio entre el icono y el badge */
  }

  .noticias-image {
    height: auto;
  }
}

@media (max-width: 480px) {
  .icon-content-modulos {
    font-size: 60px;
  }
}

.fixed-bottom-left {
  position: fixed;
  bottom: 16px;
  left: 16px;
}

.avatar-container {
  position: relative;
}

.avatar-item-container {
  position: relative;
  margin-left: -15px;
  /* Superposición de los avatares */
}

.avatar-item:hover {
  transform: scale(1.5);
  z-index: 10;
}

.avatar-item {
  border: 2px solid white;
  /* Añadir un borde blanco para separar los avatares */
  border-radius: 50%;
  transition: transform 0.3s ease, z-index 0s;
}

.bottom-left {
  bottom: -3px;
  left: auto;
  right: auto;
  top: auto;
}

.solicitudes-card {
  transition: transform 0.2s ease-in-out;
}

.solicitudes-card:hover {
  transform: translateY(-5px);
}

.q-expansion-item__header {
  background-color: #f5f5f5;
  border-radius: 15px;
  padding: 8px 16px;
}

.q-btn {
  font-weight: bold;
}

.no-news-card {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
  /* La misma altura que el carrusel */
  border-radius: 15px;
  background-color: #f5f5f5;
  color: #555;
}

.no-news-gif {
  width: 100%;
  max-height: 200px;
  object-fit: cover;
  border-radius: 15px;
}

/* .text-h5 {
  font-size: 1.25rem;
  font-weight: 500;
} */

.text-subtitle1 {
  font-size: 1rem;
  font-weight: 400;
}

.text-body2 {
  font-size: 0.875rem;
  font-weight: 400;
}

/* .noticia-modal-dialog {
  border-radius: 15px;
  overflow: hidden;
  max-width: 50%;
} */

.noticia-modal-card {
  border-radius: 5px;
  overflow: auto;
  position: relative;
  /* Añadir esta línea para posicionamiento relativo */
}

.noticia-modal-content {
  padding: 0 40px;
}

.noticia-modal-image {
  width: 100%;
  height: 25%;
  border-radius: 15px 15px 15px 15px;
}

.noticia-modal-header {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}

.noticia-modal-categories {
  display: flex;
  gap: 5px;
}

.noticia-modal-chip {
  background-color: #f5f5f5;
  color: #333;
}

.noticia-modal-autor-container {
  display: flex;
  flex-direction: column;
  color: #666;
  font-size: 12px;
}

.noticia-modal-autor,
.noticia-modal-fecha {
  margin: 0;
}

.noticia-modal-body {
  margin-top: 20px;
}

.noticia-modal-titulo {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
}

.noticia-modal-descripcion {
  font-size: 16px;
  line-height: 1.5;
  text-align: justify;
}

.noticia-modal-close-btn {
  color: red;
  background-color: rgba(255, 0, 0, 0.7);
  border-radius: 50%;
  padding: 10px;
  /* position: absolute; */
  /* Cambiado de 'fixed' a 'absolute' */
  /* top: 10px; */
  /* Ajusta la posición según sea necesario */
  /* right: 450px; */
  /* Ajusta según sea necesario */
  /* z-index: 1000; */
  /* Asegúrate de que esté por encima de otros elementos */
}

.event-modal {
  max-width: 90vw;
  max-height: 90vh;
}

.event-card {
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  border-radius: 15px;
  background: #ffffff;
}

.event-card-section {
  padding: 20px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.event-card-title {
  font-size: 1.5em;
  font-weight: bold;
  margin-bottom: 10px;
}

.event-card-description {
  margin: 15px 0;
  color: #333333;
}

.event-card-time {
  display: flex;
  justify-content: space-between;
  margin: 10px 0;
}

.event-card-actions {
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  padding: 10px 20px;
}

/**Estilos para el Modal de los Cumpleañeros */

/* Contenedor principal del modal */
.custom-cumpleaneros-modal {
  width: 400px;
  height: 600px;
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
}

/* Estilos de la sección del modal */
.custom-modal-section {
  text-align: center;
}

/* Avatar personalizado */
.custom-avatar {
  border: 2px solid #ccc;
}

/* Estilo del nombre completo */
.custom-name {
  font-weight: bold;
}

/* Estilo del cargo */
.custom-cargo {
  color: #666;
}

/* Estilo del correo electrónico */
.custom-email {
  font-size: 9x;
  color: #333;
}

/* Estilo del teléfono */
.custom-phone {
  color: #333;
}

/* Estilo de la antigüedad */
.custom-antiguedad {
  font-size: 14px;
  color: grey;
}

/* Estilo de la edad */
.custom-age {
  font-weight: bold;
  font-size: 30px;
  color: #0066ff;
}

/* Etiqueta para los años */
.custom-age-label {
  font-size: 14px;
  color: grey;
}

.birthday-hat {
  position: absolute;
  top: -10px;
  /* Ajusta según el diseño */
  right: 115px;
  /* Ajusta según el diseño */
  width: 50px;
  /* Ajusta el tamaño del gorro */
  height: auto;
  z-index: 1;
}

/* Estilo para los globos */
.balloon {
  position: absolute;
  width: 10px;
  /* Tamaño más pequeño para los globos */
  height: 10px;
  /* Tamaño más pequeño para los globos */
  z-index: 1;
}

.left-balloon {
  top: 60%;
  /* Ajusta según el diseño */
  left: 25px;
  /* Ajusta según el diseño */
  transform: translateY(-50%);
}

.right-balloon {
  top: 60%;
  /* Ajusta según el diseño */
  right: 75px;
  /* Ajusta según el diseño */
  transform: translateY(-50%);
}

.close-button-container {
  position: absolute;
  top: 10px;
  /* Ajusta el valor según necesites */
  right: 10px;
  /* Ajusta el valor según necesites */
}

/**Estilos para las extensiones */
.extensiones-card {
  border-radius: 12px;
  overflow: hidden;
  background-color: #ffffff;
  /* Fondo del cuerpo blanco */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  max-width: 350px;
}

.extensiones-card-header {
  background-color: #00796b;
  /* Color del header */
  color: white;
  font-weight: bold;
  font-size: 13px;
  border-radius: 12px 12px 0 0;
  /* Redondeo solo arriba si quieres */
}

.extensiones-header {
  background-color: #ffffff;
  color: white;
  font-weight: bold;
  font-size: 13px;
  padding: 8px 12px;
  border-radius: 8px;
}

.extensiones-scroll {
  max-height: 250px;
  /* Altura más pequeña */
  overflow-y: auto;
  padding: 8px;
}

/* Scroll más fino */
.extensiones-scroll::-webkit-scrollbar {
  width: 6px;
}

.extensiones-scroll::-webkit-scrollbar-thumb {
  background-color: #00796b;
  border-radius: 3px;
}

.extensiones-scroll::-webkit-scrollbar-track {
  background-color: #f1f1f1;
}

.extensiones-item {
  display: flex;

  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
  padding: 8px;
  /* Más compacto */
  margin-bottom: 8px;
  /* Menos espacio entre items */
}

.extensiones-item:hover {
  transform: translateY(-1px);
}

.extensiones-circle {
  width: 60px;
  /* Más pequeño */
  height: 60px;
  border-radius: 50%;
  border: 1px solid #ffffff;
  color: #000000;
  font-size: 20px;
  /* Tamaño reducido */
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #e0f2f1;
  flex-shrink: 0;
}

.extensiones-info {
  margin-left: 12px;
  /* Más pegado al círculo */
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.sin-datos {
  padding: 12px;
  text-align: center;
  color: #666;
  font-size: 13px;
}

.app-download-card {
  max-width: 900px;
  border-radius: 18px;
  color: #fff;
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.15);
}

.app-download-avatar {
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(6px);
  box-shadow: inset 0 0 0 2px rgba(255, 255, 255, 0.35);
}

.app-download-btns {
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(8px);
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.1);
}

.app-download-btns .q-btn {
  font-weight: 600;
  padding: 10px 18px;
  letter-spacing: 0.3px;
  border-radius: 999px;
  /* pill look */
}
</style>

<script src="./IntranetPage.ts"></script>
