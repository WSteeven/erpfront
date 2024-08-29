<template>
  <q-page padding>
    <div class="row q-col-gutter-sm q-mt-md q-mx-md q-mb-md">
      <!-- SECCION DERECHA -->
      <div class="col-12 col-md-9 q-px-md">
        <!-- Noticias -->
        <div>
          <q-carousel v-if="noticias.length > 0" class="carousel-noticias" style="border-radius: 15px; overflow: hidden"
            animated v-model="carousel_noticias" navigation navigation-position="right" height="400px" autoplay
            autoplay-interval="3000" infinite>
            <template v-slot:navigation-icon="{ active, btnProps, onClick }">
              <q-btn v-if="active" size="lg" icon="visibility" color="primary" flat round dense @click="onClick" />
              <q-btn v-else size="sm" :icon="btnProps.icon" color="warning" flat round dense @click="onClick" />
            </template>

            <q-carousel-slide v-for="(noticia, index) in noticias" :key="index" :name="index"
              class="carousel-slide-noticias row q-py-md">
              <q-img v-if="noticia.imagen_noticia" :src="noticia.imagen_noticia" :alt="noticia.titulo"
                class="col-12 col-md-5 noticias-image" style="border-radius: 15px" />
              <div class="col-12 col-md-7 q-pl-md">
                <h5 class="q-mb-sm q-pr-xl">{{ noticia.titulo }}</h5>
                <p class="noticias-description q-mb-md justify-text" v-html="getShortDescription(noticia.descripcion)">
                </p>
                <q-btn class="noticias-read-more bottom-right q-mb-md" color="primary"
                  @click="verNoticiaCompletaHandler(noticia.id)">
                  Ver Noticia
                </q-btn>
              </div>
            </q-carousel-slide>

          </q-carousel>
          <q-card v-else class="q-pa-md q-mt-md no-news-card" flat bordered>
            <q-card-section class="text-center q-pa-none">
              <q-img
                src="https://cdn.domestika.org/c_fill,dpr_auto,f_auto,q_auto,w_820/v1561146967/content-items/003/072/424/Untitled-2-original.gif?1561146967"
                class="no-news-gif" style="border-radius: 15px" contain />
              <div class="text-h5 q-mt-md">¡Bienvenid@ a la Intranet!</div>
              <div class="text-subtitle1 q-mt-sm">
                No hay noticias disponibles en este momento.
              </div>
              <div class="text-body2 q-mt-xs">
                Por favor, vuelve a revisar más tarde.
              </div>
            </q-card-section>
          </q-card>
        </div>
        <!--Modal para ver Noticias Completas-->
        <q-dialog v-model="modalNoticia" transition-show="scale" transition-hide="scale" class="noticia-modal-dialog">
          <q-card class="noticia-modal-card">
            <q-card-section class="row q-pb-none">
              <q-space />
              <q-btn flat icon="close" color="white" class="noticia-modal-close-btn" v-close-popup />
            </q-card-section>
            <q-card-section class="noticia-modal-content">
              <q-img :src="noticiaCompleta?.imagen_noticia" :alt="noticiaCompleta?.titulo"
                class="noticia-modal-image" />
              <div class="noticia-modal-header">
                <div class="noticia-modal-categories">
                  <q-badge>{{ noticiaCompleta?.categoria }}</q-badge>
                  <q-badge v-for="etiqueta in noticiaCompleta?.etiquetas" :key="etiqueta" class="noticia-modal-badge"
                    color="green-6">{{ etiqueta }}</q-badge>
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
                <div v-html="noticiaCompleta?.descripcion" class="noticia-modal-descripcion"></div>
              </div>
            </q-card-section>
          </q-card>
        </q-dialog>

        <br />

        <!--Mis Modulos-->
        <div class="col-12 col-md-9">
          <q-card class="my-modulos-card rounded ">
            <q-card-section style="background-color: #006831">
              <div class="text-h6" style="
                  text-align: center;
                  color: white;
                  font-size: 24px;
                  font-weight: bold;
                  padding: 0px 0;
                ">
                MIS MÓDULOS
              </div>
            </q-card-section>
            <q-card-section class="icon-container-modulos " style="
                display: flex;
                justify-content: center;
                flex-wrap: wrap;
                padding: 20px;
              ">
              <q-btn v-for="(modulo, index) in modulosPermitidos" :key="index" :to="modulo.link"
                class="icon-link-modulos " flat unelevated rounded dense style="
                  padding: xs lg;
                  margin: 10px;
                  flex-direction: column; /* Cambiar a column para alinear verticalmente */
                  align-items: center;
                ">
                <div style="
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                  ">
                  <q-icon :name="modulo.icon" class="icon-content-modulos text-color" size="40px">
                    <q-tooltip anchor="bottom middle" self="bottom middle">
                      {{ modulo.title }}
                    </q-tooltip>
                  </q-icon>
                  <div style="font-size: 9px; margin-top: 5px;" class="text-blue-grey-9">
                    {{ modulo.title }}
                  </div>
                </div>
              </q-btn>
            </q-card-section>
          </q-card>
        </div>

        <br />

        <!-- Departamentos -->
        <div class="col-12 col-md-9">
          <q-card class="fixed-size-card-departamentos">
            <q-card flat bordered class="departamentos-card">
              <q-expansion-item style="
                  text-align-last: center;
                  background-color: orangered;
                  color: white;
                  font-size: 20px;
                  font-weight: bold;
                " icon="bi-buildings-fill" label="DEPARTAMENTOS" expand-separator :default-opened="true">
                <div style="background-color: midnightblue">
                  <q-tabs v-model="activeTab" class="text-orange" active-color="orange" indicator-color="orangered">
                    <q-tab v-for="departamento in departamentos" :key="departamento.id" :name="departamento.id"
                      :label="departamento.nombre" @click="consultarEmpleadosDepartamento(departamento.id)"
                      style="color: white" />
                  </q-tabs>
                </div>

                <div style="flex: 1; overflow-y: auto; color: orangered">
                  <q-tab-panels v-model="activeTab" animated>
                    <q-tab-panel v-for="departamento in departamentos" :key="departamento.id" :name="departamento.id">
                      <q-card-section>
                        <q-scroll-area class="full-width" style="
                            height: 400px;
                            font-size: 14px;
                            justify-items: center;
                          ">
                          <div class="q-pa-md">
                            <q-list>
                              <q-item v-for="empleado in empleados" :key="empleado.id" clickable v-ripple
                                @click="showEmployeeDetails(empleado)">
                                <q-item-section avatar>
                                  <q-avatar>
                                    <img :src="empleado.foto_url ||
                                      getAvatarUrl(empleado)
                                      " />
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
                                  <q-badge style="color: white" color="orangered">
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
      </div>

      <!--SECCION IZQUIERDA-->
      <div class="col-12 col-md-3 q-px-md q-mt-md">
        <!-- Card Empleado -->
        <q-card class="empleado-card" style="border-radius: 15px; overflow: hidden">
          <div class="q-pa-md text-center">
            <div class="q-mt-md">
              <p><strong>BIENVENIDO!</strong></p>
              <div class="text-h6" style="
                  font-family: Impact, sans-serif;
                  font-size: 30px;
                  color: midnightblue;
                ">
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
              <q-btn href="https://jpconstrucred.com:2096/" color="secondary" icon-right="mail" label="Ir a mi correo" target="_blank"/>
            </div>
            <!-- Documentos -->
            <div class="q-mt-md flex justify-center rounded-lg" style="
                padding: 10px;
                background-color: white;
                border: 1px solid #ffffff;
                border-radius: 10px;
              ">
              <q-badge rounded color="green"
                style="font-size: 16px; height: 30px; max-width: 600px">DOCUMENTOS</q-badge>
              <a v-for="documento in documentosIntranet" :key="documento.id" :href="documento.link" target="_blank"
                class="social-link-empleado" :style="{ color: documento.color }">
                <q-icon :name="documento.icon" size="md" class="icon-content-empleado">
                  <q-tooltip anchor="top middle" self="bottom middle">{{
                    documento.name
                    }}</q-tooltip>
                </q-icon>
              </a>
            </div>
          </div>
        </q-card>
        <br />

        <!--Sección de Vacantes-->
        <q-card v-if="false" flat bordered class="vacantes-card" style="border-radius: 15px; overflow: hidden">
          <q-expansion-item style="
              text-align-last: center;
              background-color: rebeccapurple;
              color: white;
              font-size: 13px;
              font-weight: bold;
              border-radius: 10px;
            " icon="bi-megaphone-fill" label="VACANTES" :default-opened="false">
            <div style="background-color: WHITE; color: #555; padding: 20px">
              No hay vacantes disponibles
            </div>
          </q-expansion-item>
        </q-card>

        <br />

        <!--Formulario de Solicitudes-->
        <q-expansion-item style="
            background-color: #003f68;
            color: white;
            font-size: 12px;
            font-weight: bold;
            border-radius: 10px;
          " icon="bi-bookmark-heart" dense-toogle label="SOLICITUDES" :default-opened="false">
          <div style="background-color: WHITE; padding: 20px">
            <q-form @submit.prevent="enviarSolicitud">
              <q-select v-model="solicitud.tipo_solicitud" :options="tiposSolicitudes" label="Tipo de Solicitud"
                emit-value outlined dense style="
                  margin-bottom: 16px;
                  border-radius: 10px;
                  background-color: midnightblue;
                "></q-select>
              <q-btn type="submit" color="green" label="REALIZAR" style="
                  width: 100%;
                  font-weight: bold;
                  letter-spacing: 0.5px;
                  border-radius: 10px;
                  background-color: blue;
                  color: white;
                " outline></q-btn>
            </q-form>
          </div>
        </q-expansion-item>

        <br />

        <!--Calendario de Eventos-->

        <q-expansion-item style="
            background-color: orange;
            color: white;
            font-size: 12px;
            font-weight: bold;
            border-radius: 10px;
          " icon="bi-calendar-event" label="EVENTOS DEL MES" :default-opened="true">
          <q-card-section style="margin: 0; background-color: #ffffff; color: black">
            <div class="text-h6" style="
                text-align: center;
                color: white;
                background-color: midnightblue;
                padding: 10px 0;
                border-radius: 15px 15px 0px 0px;
              ">
              <i class="bi bi-cake2" style="margin-right: 10px"></i>
              CUMPLEAÑEROS
            </div>
            <q-separator />

            <q-card-section style="
                display: flex;
                justify-content: center;
                height: 130px;
                border-radius: 0 0 15px 15px;
                background-color: white;
              ">
              <q-scroll-area class="bg-white-4 rounded-borders" style="height: 100px; overflow-x: auto; width: 100%">
                <div class="row no-wrap items-center q-gutter-x-sm" style="
                    display: flex;
                    flex-wrap: nowrap;
                    justify-content: center;
                    padding-left: 30px; /* Añadir padding izquierdo */
                    height: 100px;
                    max-width: 900px;
                  ">
                  <div v-for="empleado in empleadosCumpleaneros" :key="empleado.id" class="avatar-item-container"
                    style="margin-right: 15px; size: 5px">
                    <q-avatar size="xl" class="avatar-item">
                      <img :src="empleado.foto_url == null
                          ? `https://ui-avatars.com/api/?name=${empleado.nombres.substr(
                            0,
                            1
                          )}+${empleado.apellidos.substr(
                            0,
                            1
                          )}&bold=true&background=008000&color=ffff`
                          : empleado.foto_url
                        " />
                      <q-badge floating class="bottom-left" color="orange">
                        {{ new Date(empleado.fecha_nacimiento).getDate() + 1 }}
                      </q-badge>
                      <q-tooltip anchor="bottom middle" self="bottom middle">
                        {{ empleado.nombres }} {{ empleado.apellidos }}
                      </q-tooltip>
                    </q-avatar>
                  </div>
                </div>
              </q-scroll-area>
            </q-card-section>
          </q-card-section>

          <q-card-section style="background-color: #ffffff; color: #003f68">
            <div>
              <Qalendar :events="eventosFormateados" :config="configuracion" @event-click="verEvento" />
              <!--Modal para Visualizar Evento-->
              <q-dialog v-model="dialogoVisible" transition-show="scale" transition-hide="scale" class="event-modal">
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
                      <q-badge color="green-6">{{
                        eventoSeleccionado?.fecha_hora_inicio
                        }}</q-badge>
                      -
                      <q-badge color="amber">{{
                        eventoSeleccionado?.fecha_hora_fin
                        }}</q-badge>
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
    <modales-entidad :comportamiento="modales" :fullWidth="false" :maximized="false" :persistente="false" />
  </q-page>
</template>

<!--Estilos del calendario Qalendar-->
<style>
@import 'qalendar/dist/style.css';
/* Estilo para pintar todo el cuadro del día con evento */
.qalendar-day.has-event {
  background-color: #e0f7fa !important; /* Color de fondo personalizado */
  border-radius: 4px !important; /* Ajuste del radio de borde */
  color: white !important; /* Color del texto */
  font-weight: bold; /* Hace que el texto sea negrita para destacar */
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

.text-h5 {
  font-size: 1.25rem;
  font-weight: 500;
}

.text-subtitle1 {
  font-size: 1rem;
  font-weight: 400;
}

.text-body2 {
  font-size: 0.875rem;
  font-weight: 400;
}

.noticia-modal-dialog {
  border-radius: 15px;
  overflow: hidden;
  max-width: 50%;
}

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
</style>

<script src="./IntranetPage.ts"></script>
