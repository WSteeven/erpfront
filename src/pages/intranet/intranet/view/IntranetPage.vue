<template>
  <q-page padding>
    <!--Fila 01-->
    <div class="row q-col-gutter-sm q-mt-md q-mx-md q-mb-md">
      <div class="col-12 col-md-9 q-px-md">
        <!--Noticias-->
        <q-carousel
          class="carousel-noticias"
          style="border-radius: 15px; overflow: hidden"
          animated
          v-model="carousel_noticias"
          navigation
          navigation-position="right"
          height="400px"
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
            v-for="(news, index) in newsList"
            :key="index"
            :name="index"
            class="carousel-slide-noticias row q-py-md"
          >
            <q-img
              :src="news.image"
              :alt="news.title"
              class="col-12 col-md-5 rounded-borders noticias-image"
            />
            <div class="col-12 col-md-5 q-pl-md">
              <h5 class="noticias-title q-mb-sm">{{ news.title }}</h5>
              <p class="noticias-description q-mb-md">{{ news.description }}</p>
              <q-btn
                class="noticias-read-more bottom-right q-mb-md"
                color="primary"
                @click="readMore(news.link)"
              >
                Leer más
              </q-btn>
            </div>
          </q-carousel-slide>
        </q-carousel>

        <br />

        <!--Mis Modulos-->
        <div class="col-12 col-md-9">
          <q-card
            class="my-modulos-card"
            style="border-radius: 15px; background-color: white"
          >
            <q-card-section style="background-color: #555">
              <div
                class="text-h6"
                style="
                  text-align: center;
                  color: white;
                  font-weight: bold;
                  padding: 10px 0;
                "
              >
                MIS MÓDULOS
              </div>
            </q-card-section>
            <q-card-section
              class="icon-container-modulos"
              style="
                display: flex;
                justify-content: center;
                flex-wrap: wrap;
                padding: 20px;
              "
            >
              <a
                v-for="(modulo, index) in modulosPermitidos"
                :key="index"
                :href="modulo.link"
                target="_blank"
                class="icon-link-modulos"
                style="margin: 10px"
              >
                <q-icon
                  :name="modulo.icon"
                  class="icon-content-modulos"
                  color="blue-grey-9"
                  size="40px"
                >
                  <q-tooltip anchor="top middle" self="bottom middle">{{
                    modulo.title
                  }}</q-tooltip>
                </q-icon>
              </a>
            </q-card-section>
          </q-card>
        </div>

        <br />

        <!-- Departamentos -->
        <div class="col-12 col-md-9">
          <q-card class="fixed-size-card-departamentos">
            <q-card flat bordered class="departamentos-card">
              <q-expansion-item
                style="
                  text-align-last: center;
                  background-color: orangered;
                  color: blanchedalmond;
                  font-size: 13px;
                  font-weight: bold;
                "
                icon="bi-buildings-fill"
                label="DEPARTAMENTOS"
                expand-separator
                :default-opened="true"
              >
                <div style="background-color: midnightblue">
                  <q-tabs
                    v-model="activeTab"
                    class="text-teal"
                    active-color="teal"
                    indicator-color="teal"
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

                <div style="flex: 1; overflow-y: auto; color: orangered">
                  <q-tab-panels v-model="activeTab" animated>
                    <q-tab-panel
                      v-for="departamento in departamentos"
                      :key="departamento.id"
                      :name="departamento.id"
                    >
                      <q-card-section>
                        <q-scroll-area class="full-width" style="height: 400px">
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
                                  <q-badge color="primary">
                                    {{ empleado.telefono }}
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

            <q-dialog v-model="employeeDialog">
              <q-card>
                <q-card-section>
                  <div class="text-h6">Detalles del Empleado</div>
                </q-card-section>
                <q-card-section>
                  <q-avatar size="lg" class="q-mr-md">
                    <img
                      :src="
                        selectedEmployee.foto_url ||
                        getAvatarUrl(selectedEmployee)
                      "
                    />
                  </q-avatar>
                  <div class="q-my-md">
                    <p class="text-h6 q-mb-none">
                      {{
                        selectedEmployee.nombres +
                        ' ' +
                        selectedEmployee.apellidos
                      }}
                    </p>
                    <q-badge rounded color="blue" class="q-mt-sm">
                      <small>{{ selectedEmployee.cargo }}</small>
                    </q-badge>
                    <q-badge rounded color="green" class="q-mt-sm q-ml-sm">
                      <small>{{ selectedEmployee.telefono }}</small>
                    </q-badge>
                  </div>
                </q-card-section>
                <q-card-actions align="right">
                  <q-btn flat label="Cerrar" v-close-popup />
                </q-card-actions>
              </q-card>
            </q-dialog>
          </q-card>
        </div>
      </div>

      <!--SECCION IZQUIERDA-->
      <div class="col-12 col-md-3 q-px-md q-mt-md">
        <!-- Card Empleado -->
        <q-card
          class="empleado-card"
          style="border-radius: 15px; overflow: hidden"
        >
          <div class="q-pa-md text-center">
            <q-img
              :src="imagenPerfil"
              width="90px"
              height="90px"
              style="border-radius: 50%"
            />
            <div class="q-mt-md">
              <p><strong>BIENVENIDO!</strong></p>
              <div
                class="text-h6"
                style="
                  font-family: Impact, sans-serif;
                  font-size: 30px;
                  color: midnightblue;
                "
              >
                {{ store.nombreUsuario }}
              </div>

              <div style="font-size: 16px; color: #555">
                <q-badge rounded color="white" label="👤" />
                <q-badge color="primary">{{ store.user?.email }}</q-badge>
              </div>
              <div style="font-size: 14px; color: #555">
                <q-badge rounded color="white" label="🎓" />
                <q-badge rounded color="orange">{{
                  store.user?.cargo
                }}</q-badge>
              </div>
            </div>
            <div class="q-mt-md">
              <q-badge rounded color="green" style="font-size: 16px"
                >DOCUMENTOS</q-badge
              >
            </div>
            <!-- Documentos -->
            <div
              class="q-mt-md flex justify-center rounded-lg"
              style="
                padding: 10px;
                background-color: cadetblue;
                border: 1px solid #ccc;
                border-radius: 10px;
              "
            >
              <a
                v-for="documento in documentosIntranet"
                :key="documento.id"
                :href="documento.link"
                target="_blank"
                class="social-link-empleado"
                :style="{ color: documento.color }"
              >
                <q-icon
                  :name="documento.icon"
                  size="md"
                  class="icon-content-empleado"
                >
                  <q-tooltip anchor="top middle" self="bottom middle">{{
                    documento.name
                  }}</q-tooltip>
                </q-icon>
              </a>
            </div>
          </div>
        </q-card>
        <br />
        <!--Calendario de Eventos-->
        <q-card class="eventos-card" style="border-radius: 15px">
          <q-card-section>
            <div
              class="text-h6"
              style="text-align-last: center; color: lightseagreen"
            >
              EVENTOS DEL MES
            </div>
          </q-card-section>

          <div
            class="text-h6"
            style="
              text-align-last: center;
              color: white;
              background-color: midnightblue;
            "
          >
            CUMPLEAÑEROS
          </div>
          <q-separator />

          <q-card-section
            style="display: flex; justify-content: center; height: 130px"
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
                  padding-left: 30px; /* Añadir padding izquierdo */
                  height: 100px;
                  max-width: 900px;
                "
              >
                <div
                  v-for="empleado in empleadosCumpleaneros"
                  :key="empleado.id"
                  class="avatar-item-container"
                  style="margin-right: 15px; size: 5px"
                >
                  <q-avatar size="70px" class="avatar-item">
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
                      {{ new Date(empleado.fecha_nacimiento).getDate() }}
                    </q-badge>
                    <q-tooltip anchor="bottom middle" self="bottom middle">
                      {{ empleado.nombres }} {{ empleado.apellidos }}
                    </q-tooltip>
                  </q-avatar>
                </div>
              </div>
            </q-scroll-area>
          </q-card-section>

          <q-separator />
          <q-card-section>
            <q-date
              v-model="selectedDate"
              :mask="maskFecha"
              :events="eventDates"
              :event-color="getColor"
              minimal
              @update:model-value="verEvento"
              style="width: max-content"
            />
          </q-card-section>
        </q-card>
        <br />
        <q-separator />
        <!--Formulario de Solicitudes-->
        <q-card class="solicitudes-card" style="border-radius: 15px">
          <q-card-section>
            <div
              class="text-h6"
              style="text-align-last: center; color: lightseagreen"
            >
              SOLICITUDES
            </div>
          </q-card-section>
          <q-card-section>
            <q-form @submit.prevent="enviarSolicitud">
              <q-select
                v-model="solicitud.tipo_solicitud"
                :options="tiposSolicitudes"
                label="Tipo de Solicitud"
                emit-value
                map-options
                required
              ></q-select>
              <q-input
                v-model="solicitud.descripcion"
                label="Descripción"
                type="textarea"
                autogrow
                required
              ></q-input>
              <q-input
                v-model="solicitud.fecha_inicio"
                label="Fecha de Inicio"
                mask="####-##-##"
                filled
                required
              >
                <template v-slot:append>
                  <q-icon name="event" />
                </template>
                <q-popup-proxy
                  ref="qDateInicio"
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date v-model="solicitud.fecha_inicio" mask="YYYY-MM-DD" />
                </q-popup-proxy>
              </q-input>

              <q-input
                v-model="solicitud.fecha_fin"
                label="Fecha de Fin"
                mask="####-##-##"
                filled
                required
              >
                <template v-slot:append>
                  <q-icon name="event" />
                </template>
                <q-popup-proxy
                  ref="qDateFin"
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date v-model="solicitud.fecha_fin" mask="YYYY-MM-DD" />
                </q-popup-proxy>
              </q-input>
              <br />
              <q-btn type="submit" color="primary" label="Enviar"></q-btn>
            </q-form>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Botón flotante -->
    <q-btn
      icon="search"
      color="primary"
      round
      fab
      class="fixed-bottom-left"
      @click="openSearchDialog"
    />
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
  margin: 0 10px;
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
  width: 100%;
}

@media (max-width: 768px) {
  .icon-container-modulos {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }

  .icon-link-modulos {
    margin: 5px;
  }

  .icon-content-modulos {
    font-size: 80px;
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
</style>

<script src="./IntranetPage.ts"></script>
