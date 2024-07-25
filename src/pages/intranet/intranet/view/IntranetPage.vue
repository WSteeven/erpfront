<template>
  <q-page padding>
    
    <!--Fila 01-->
    <div class="row q-col-gutter-sm q-mt-md q-mx-md q-mb-md">
      <div class="col-4 col-md-9">
        <!--Noticias-->
        <q-carousel
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
            class="row q-py-md"
          >
            <q-img
              :src="news.image"
              :alt="news.title"
              class="col-md-5 rounded-borders"
            />
            <div class="col-md-5 q-pl-md">
              <h5 class="q-mb-sm">{{ news.title }}</h5>
              <p class="q-mb-md">{{ news.description }}</p>
              <q-btn
                class="bottom-right q-mb-md"
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
        <div class="col-4 col-md-9 items-lg-center">
          <q-card class="my-custom-card" style="border-radius: 15px">
            <q-card-section>
              <div
                class="text-h6"
                style="text-align-last: center; color: lightseagreen"
              >
                MIS MÓDULOS
              </div>
            </q-card-section>
            <q-card-section class="icon-container">
              <a
                v-for="(modulo, index) in modulosPermitidos"
                :key="index"
                :href="modulo.link"
                target="_blank"
                class="icon-link"
              >
                <q-icon
                  :name="modulo.icon"
                  size="100px"
                  class="icon-content"
                  color="blue-14"
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
        <!--Departamentos-->
        <div class="col-4 col-md-9">
          <q-card class="department-card">
            <q-card-section>
              <div
                class="text-h6"
                style="text-align-last: center; color: lightseagreen"
              >
                DEPARTAMENTOS
              </div>
            </q-card-section>
            <q-card-section class="department-details">
              <div class="column">
                <q-card style="max-height: 300px; overflow-y: auto">
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
                      </q-expansion-item>
                    </q-list>
                  </q-card-section>
                </q-card>
              </div>
              <div class="column" style="max-height: 300px; overflow-y: auto">
                <q-card
                  v-for="(empleado, index) in empleados"
                  :key="index"
                  class="q-my-md q-px-md"
                >
                  <div class="row q-col-gutter-sm q-my-xs q-mx-md">
                    <q-avatar size="lg" class="q-mr-md">
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
                    <div class="col-6 col-md-9 q-my-md">
                      <p class="text-h6 q-mb-none">
                        {{ empleado.nombres + ' ' + empleado.apellidos }}
                      </p>
                      <q-badge rounded color="blue" class="q-mt-sm"
                        ><small>{{ empleado.cargo }}</small></q-badge
                      >
                      <q-badge rounded color="green" class="q-mt-sm q-ml-sm"
                        ><small>{{ empleado.telefono }}</small></q-badge
                      >
                    </div>
                  </div>
                </q-card>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
      <!--Columna izquierda-->
      <div class="col-5 col-md-3">
        <!--Buscar-->
        <q-input
          v-model="search"
          filled
          type="search"
          hint=""
          placeholder="Buscar"
          style="border-radius: 15px; overflow: hidden"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
        <!--Card Empleado-->
        <q-card class="my-card" style="border-radius: 15px; overflow: hidden">
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
              <div>
                <br /><br />
                <q-badge rounded color="green">DOCUMENTOS</q-badge>
              </div>
            </div>
            <div class="col">
              <q-card-section class="text-left">
                {{ store.nombreUsuario }}
                <q-badge color="primary">{{ store.user?.email }}</q-badge>
                <q-badge rounded color="orange">{{
                  store.user?.cargo
                }}</q-badge>
              </q-card-section>
              <!--Documentos-->
              <q-card-section class="q-gutter-x-sm">
                <a
                  v-for="social in socialNetworks"
                  :key="social.id"
                  :href="social.link"
                  target="_blank"
                  class="social-link"
                >
                  <q-icon :name="social.icon" size="md" class="icon-content">
                    <q-tooltip anchor="top middle" self="bottom middle">{{
                      social.name
                    }}</q-tooltip>
                  </q-icon>
                </a>
              </q-card-section>
            </div>
          </div>
        </q-card>
        <br />
        <!--Calendario de Eventos-->
        <q-card style="border-radius: 15px">
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
            style="text-align-last: center; color: mediumslateblue"
          >
            Cumpleañeros
          </div>
          <q-separator />
          <q-card-section>
            <q-carousel
              v-model="carousel_cumpleanos_mes"
              transition-prev="slide-right"
              transition-next="slide-left"
              swipeable
              animated
              padding
              :slides-per-page="1"
              arrows
              height="110px"
              class="bg-white-3 rounded-borders"
              autoplay
              infinite
            >
              <q-carousel-slide
                v-for="(empleado, index) in empleadosCumpleaneros"
                :key="empleado.id"
                :name="index"
              >
                <div class="row justify-start items-center q-gutter-xs">
                  <q-avatar size="80px">
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
                    <q-badge floating color="orange">{{
                      new Date(empleado.fecha_nacimiento).getDate()
                    }}</q-badge>
                    <q-tooltip anchor="top middle" self="bottom middle"
                      >{{ empleado.nombres }}
                      {{ empleado.apellidos }}</q-tooltip
                    >
                  </q-avatar>
                  <q-avatar size="80px" v-if="empleadosCumpleaneros[index + 1]">
                    <img
                      :src="
                        empleadosCumpleaneros[index + 1].foto_url == null
                          ? `https://ui-avatars.com/api/?name=${empleadosCumpleaneros[
                              index + 1
                            ].nombres.substr(0, 1)}+${empleadosCumpleaneros[
                              index + 1
                            ].apellidos.substr(
                              0,
                              1
                            )}&bold=true&background=008000&color=ffff`
                          : empleadosCumpleaneros[index + 1].foto_url
                      "
                    />
                    <q-badge floating color="orange">{{
                      new Date(
                        empleadosCumpleaneros[index + 1].fecha_nacimiento
                      ).getDate()
                    }}</q-badge>
                    <q-tooltip anchor="top middle" self="bottom middle"
                      >{{ empleadosCumpleaneros[index + 1].nombres }}
                      {{
                        empleadosCumpleaneros[index + 1].apellidos
                      }}</q-tooltip
                    >
                  </q-avatar>
                </div>
              </q-carousel-slide>
            </q-carousel>
          </q-card-section>
          <q-separator />
          <q-card-section>
            <q-date
              v-model="date"
              :mask="maskFecha"
              :events="eventos"
              :event-color="date => (date[9] % 2 === 0 ? 'teal' : 'orange')"
              minimal
              @update:model-value="verEvento(date)"
              style="width: max-content"
            />
          </q-card-section>
        </q-card>
        <br />
        <q-separator />
        <!--Formulario de Solicitudes-->
        <q-card style="border-radius: 15px">
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

    <!--Fila 02-->
    <div class="row q-col-gutter-sm q-ml-sm q-pl-sm"></div>
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

.carousel-slide {
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

.icon-content {
  cursor: pointer;
  margin: 0 10px;
}

.q-gutter-x-sm {
  display: flex;
  flex-wrap: nowrap;
  /* Evita que los íconos se envuelvan a la siguiente línea */
  overflow-x: auto;
  /* Permite desplazamiento horizontal si los íconos no caben en la pantalla */
}

.department-card {
  border: 1px solid #ccc;
  /* Borde para destacar la tarjeta */
  border-radius: 15px;
  /* Bordes redondeados */
  overflow-y: auto;
  /* Barras de desplazamiento vertical cuando sea necesario */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  /* Sombra suave para efecto de elevación */
}

.department-details {
  display: flex;
  gap: 20px;
  /* Espacio entre las columnas */
  padding: 20px;
}

.column {
  flex: 1;
  overflow-y: auto;
  /* Barras de desplazamiento vertical cuando sea necesario */
  /* Las columnas ocupan el mismo espacio */
}

.column h3 {
  margin-bottom: 10px;
  /* Espacio debajo del título de cada departamento */
  color: #0066ff;
  /* Color del título para destacarlo */
}

.column ul {
  list-style-type: none;
  /* Quita los puntos de la lista */
  padding: 0;
  margin: 0;
}

.column ul li {
  margin-bottom: 8px;
  /* Espacio entre los elementos de la lista */
}

.column ul li strong {
  font-weight: bold;
  /* Texto en negrita para los detalles importantes */
  color: #333;
  /* Color de texto para los detalles */
}

.overlapping {
  border: 2px solid white;
  position: absolute;
}

</style>

<script src="./IntranetPage.ts"></script>
