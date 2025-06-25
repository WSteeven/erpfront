<template>
  <q-page>
    <!-- <div class="row">
      <div class="col-12 text-center q-mb-md">
        <img
          alt="Logo FIRSTRED"
          :src="!$q.dark.isActive ? logoClaro : logoOscuro"
          :height="$q.screen.xs ? 40 : 80"
          class="custom-shadow"
        />
      </div>

      <div class="col-12 text-center q-mx-auto q-mb-md">
        <div class="text-h5 text-bold">Bienvenido</div>
      </div>
    </div> -->

    <!-- <q-tabs
      v-model="tabs"
      no-caps
      bordered
      dense
      active-class="tab-active-intranet"
      indicator-color="transparent"
      class="q-mb-none q-mx-xfl"
      align="center"
    >
      <q-tab
        v-for="opcion in tabsMenu"
        :key="opcion"
        :name="opcion + ''"
        class="bordde rounded shadow-chip q-mb-xl bg-body q-pa-md q-mx-sm"
        href="#mis_modulos"
      >
        <q-icon name="las la-newspaper" size="md" class="q-mb-md"></q-icon>
        {{ opcion }}
      </q-tab>
    </q-tabs> -->

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
                icon="visibility"
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
                color="warning"
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
            <img
              src="../../../../assets/latam2.gif"
              alt="Sin noticias"
              style="width: 100%; border-radius: 15px"
            />
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
          <div class="q-py-md text-h5 text-bold q-mb-sm">Mis módulos</div>

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

        <!-- Departamentos -->
        <div class="col-12 col-md-9">
          <q-card class="fixed-size-card-departamentos">
            <q-card flat bordered class="departamentos-card">
              <q-expansion-item
                style="
                  text-align-last: center;
                  font-size: 20px;
                  font-weight: bold;
                "
                icon="bi-buildings-fill"
                header-class="text-bold bg-primary text-white"
                label="DEPARTAMENTOS"
                expand-separator
                :default-opened="true"
              >
                <div>
                  <q-tabs
                    v-model="activeTab"
                    align="left"
                    active-class="tab-active"
                    indicator-color="primary"
                    dense
                    class="border-bottom"
                  >
                    <q-tab
                      v-for="departamento in departamentos"
                      :key="departamento.id"
                      :name="departamento.id"
                      :label="departamento.nombre"
                      @click="consultarEmpleadosDepartamento(departamento.id)"
                    />
                  </q-tabs>
                </div>

                <div style="flex: 1; overflow-y: auto; color: blue">
                  <q-tab-panels v-model="activeTab" animated>
                    <q-tab-panel
                      v-for="departamento in departamentos"
                      :key="departamento.id"
                      :name="departamento.id"
                    >
                      <q-card-section>
                        <q-scroll-area
                          class="full-width"
                          style="
                            height: 400px;
                            font-size: 14px;
                            justify-items: center;
                          "
                        >
                          <div class="q-pa-md">
                            <q-list>
                              <q-item
                                v-for="empleado in empleados"
                                :key="empleado.id"
                                clickable
                                v-ripple
                                @click="showEmployeeDetails(empleado)"
                              >
                                <q-item-section avatar>
                                  <q-avatar>
                                    <img
                                      :src="
                                        empleado.foto_url ||
                                        getAvatarUrl(empleado)
                                      "
                                    />
                                  </q-avatar>
                                </q-item-section>
                                <q-item-section>
                                  <q-item-label>
                                    {{
                                      empleado.nombres +
                                      ' ' +
                                      empleado.apellidos
                                    }}
                                  </q-item-label>
                                  <q-item-label caption>
                                    {{ empleado.cargo }}
                                  </q-item-label>
                                </q-item-section>
                                <q-item-section side>
                                  <q-badge
                                    style="color: white"
                                    color="orangered"
                                  >
                                    {{ empleado.email }}
                                  </q-badge>
                                </q-item-section>
                              </q-item>
                            </q-list>
                          </div>
                        </q-scroll-area>
                      </q-card-section>
                    </q-tab-panel>
                  </q-tab-panels>
                </div>
              </q-expansion-item>
            </q-card>
          </q-card>
        </div>

        <!-- Seccion descargate la app movil  -->
        <div class="col-12 col-md-9 q-pt-md">
          <q-card
            class="q-pa-md q-mx-auto q-my-lg shadow-2 rounded-borders bg-primary text-white"
            style="max-width: 900px"
          >
            <div class="row items-center q-col-gutter-md">
              <div class="col-auto">
                <q-icon name="smartphone" size="64px" />
              </div>

              <div class="col">
                <div class="text-h6 q-mb-xs">¡Descarga nuestra App Móvil!</div>
                <div class="text-subtitle2">
                  Lleva la intranet contigo a donde vayas.
                </div>
              </div>

              <q-card class="q-pa-md q-my-md bg-grey-2" flat bordered>
                <div class="row items-center q-col-gutter-lg justify-center">
                  <!-- Botón Android -->
                  <div class="column items-center">
                    <q-btn
                      color="green"
                      icon="android"
                      label="Android"
                      :href="`${url_sistema}/firstred-app.apk`"
                      target="_blank"
                      unelevated
                      rounded
                    />
                  </div>

                  <!-- Botón iOS con texto arriba -->
                  <div class="column items-center">
                    <small class="text-grey-7">Próximamente...</small>
                    <q-btn
                      color="white"
                      text-color="black"
                      icon="apple"
                      label="iOS"
                      target="_blank"
                      unelevated
                      @click="notificarProximamente"
                      rounded
                    />
                  </div>
                </div>
              </q-card>
            </div>
          </q-card>
        </div>
      </div>

      <!--SECCION IZQUIERDA-->
      <div class="col-12 col-md-3">
        <!-- Card Empleado -->
        <q-card class="q-mb-sm custom-shadow no-border rounded">
          <div class="q-pa-md text-center">
            <div class="q-mt-md">
              <p><strong>BIENVENIDO!</strong></p>
              <div
                class="q-mb-md"
                style="
                  font-family: Impact, sans-serif;
                  font-size: 30px;
                  color: midnightblue;
                  text-transform: uppercase;
                "
              >
                {{ store.nombreUsuario }}
              </div>

              <div style="font-size: 16px; color: #555" class="q-mb-sm">
                <q-icon name="las la-user-alt" size="sm" />
                <small class="q-pa-sm">{{ store.user?.email }}</small>
              </div>

              <div style="font-size: 14px; color: #555">
                <!-- <q-badge rounded color="white" label="🎓" /> -->
                <q-icon name="las la-user-graduate" size="sm" />
                <small class="q-pa-sm">{{ store.user?.cargo }}</small>
              </div>
            </div>

            <div class="column q-gutter-xs q-mt-md">
              <q-btn
                href="https://drive.google.com/drive/folders/1Zv3eTjramxByFRht-L5Gz_nrulgFE32V?usp=sharing_eip_m&ts=64386770"
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

              <q-btn
                icon-right="las la-external-link-alt"
                label="Plugins"
                class="bg-blue-1"
                outline
                no-caps
                color="blue-14"
                unelevated
                href="https://drive.google.com/drive/folders/1KypTE2iv-2pHbwQxpzVhVPEhf5Ra8fow?usp=sharing"
                target="_blank"
              ></q-btn>

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
        <q-card flat bordered class="q-mb-sm">
          <q-expansion-item
            label="EXTENSIONES TELEFÓNICAS"
            icon="bi-telephone-fill"
            header-class="text-white"
            default-opened
            style="background: #ff9149"
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
                <div class="extensiones-info">
                  <div class="empleado-nombre">
                    {{ empleado.nombres }} {{ empleado.apellidos }}
                  </div>
                  <div class="empleado-cargo">
                    {{ empleado.cargo }}
                  </div>
                  <div class="empleado-departamento">
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
          class="vacantes-card q-mb-sm"
          style="border-radius: 15px; overflow: hidden"
        >
          <q-expansion-item
            style="
              text-align-last: center;
              background-color: #0118d8;
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
              height="260px"
              control-text-color="teal"
              autoplay
              autoplay-interval="3000"
              infinite
            >
              <q-carousel-slide
                v-for="(vacante, index) in vacantesDisponibles"
                :key="index"
                :name="index"
              >
                <div class="border-grey rounded-8">
                  <p class="text-black">{{ vacante.nombre }}</p>
                  <div
                    class="block q-px-xs text-caption text-grey text-justify"
                    @click="visualizarVacante(vacante)"
                  >
                    <p>{{ acortarDescripcion($q, vacante.descripcion) }}</p>
                  </div>
                  <q-separator />
                  <div class="row q-pa-sm text-black" style="font-size: 11px">
                    <div class="col-6">
                      <q-icon class="bi-clock-fill" />
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
                      <q-icon class="bi-geo-alt-fill" />
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
            background-color: #0118d8;
            color: white;
            font-size: 12px;
            font-weight: bold;
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
            background-color: #ff9149;
            color: white;
            font-size: 12px;
            font-weight: bold;
            border-radius: 10px;
          "
          icon="bi-calendar-event"
          label="EVENTOS DEL MES"
          :default-opened="true"
        >
          <q-card-section
            style="margin: 0; background-color: #ffffff; color: black"
          >
            <div
              class="q-py-sm"
              style="
                text-align: center;
                background-color: #ffecdb;
                border-radius: 50px;
                color: #ff9149;
              "
            >
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
                      <q-badge floating class="bottom-left" color="orange">
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

                  <!-- Teléfono -->
                  <div class="custom-phone text-subtitle2 q-mb-sm">
                    <q-badge color="orange">
                      {{ selectedEmpleado.telefono }}
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

.column {
  flex: 1;
  overflow-y: auto;
}

.column h3 {
  margin-bottom: 10px;
  color: #0066ff;
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
  top: 10px; /* Ajusta el valor según necesites */
  right: 10px; /* Ajusta el valor según necesites */
}

/**Estilos para las extensiones */
.extensiones-card {
  border-radius: 12px;
  overflow: hidden;
  background-color: #ffffff; /* Fondo del cuerpo blanco */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  max-width: 350px;
}

.extensiones-card-header {
  background-color: #00796b; /* Color del header */
  color: white;
  font-weight: bold;
  font-size: 13px;
  border-radius: 12px 12px 0 0; /* Redondeo solo arriba si quieres */
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
  max-height: 250px; /* Altura más pequeña */
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
  align-items: center;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
  padding: 8px; /* Más compacto */
  margin-bottom: 8px; /* Menos espacio entre items */
}

.extensiones-item:hover {
  transform: translateY(-1px);
}

.extensiones-circle {
  width: 60px; /* Más pequeño */
  height: 60px;
  border-radius: 50%;
  border: 1px solid #ffffff;
  color: #000000;
  font-size: 20px; /* Tamaño reducido */
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #e0f2f1;
  flex-shrink: 0;
}

.extensiones-info {
  margin-left: 12px; /* Más pegado al círculo */
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.empleado-nombre {
  font-size: 10px; /* Más pequeño */
  font-weight: 600;
  color: #303d86;
}

.empleado-cargo {
  font-size: 10px;
  color: #ff5e00;
}

.empleado-departamento {
  font-size: 12px;
  color: #9a9a9a;
}

.sin-datos {
  padding: 12px;
  text-align: center;
  color: #666;
  font-size: 13px;
}
</style>

<script src="./IntranetPage.ts"></script>
