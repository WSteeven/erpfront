<template>
  <q-page>
    <div class="text-center text-subtitle2 q-mb-md">
      Ticket {{ ticket.codigo }}
    </div>

    <div class="column q-col-gutter-sm q-mb-md">
      <div class="col-12">
        <label class="q-mb-sm block">Asunto</label>
        <b>{{ ticket.asunto }}</b>
      </div>

      <div class="col-12">
        <label class="q-mb-sm block">Descripción</label>
        <b>{{ ticket.descripcion }}</b>
      </div>
    </div>

    <div
      id="responsables"
      class="row items-center bg-blue-5 rounded-header q-pt-sm"
    >
      <div class="col-12">
        <div class="row q-px-md items-center">
          <div class="col-12 col-sm-6 col-md-6 text-white">
            <div class="text-subtitle2 text-shadow">
              Linea de tiempo del ticket
            </div>
            <small
              >Seleccione un responsable para filtrar las actividades
              registradas de la linea de tiempo del ticket</small
            >
          </div>

          <div class="col-12 col-sm-6 col-md-6 q-mb-md">
            <div
              class="row"
              :class="{
                'justify-center': $q.screen.xs,
                'justify-end': !$q.screen.xs,
              }"
            >
              <q-btn
                icon="bi-chevron-left"
                color="primary"
                class="bg-primary q-pr-md q-mr-sm"
                label="Anterior"
                @click="anterior"
                rounded
                no-caps
                dense
              ></q-btn>
              <q-btn
                icon-right="bi-chevron-right"
                color="primary"
                class="bg-primary q-pl-md"
                label="Siguiente"
                @click.stop="siguiente"
                rounded
                no-caps
                dense
              ></q-btn>
            </div>
          </div>
        </div>
      </div>

      <div class="col-12 rounded">
        <q-scroll-area
          ref="scrollAreaRef"
          style="height: 250px; max-width: 100%"
          class="q-pa-sm"
        >
          <div v-if="lineaTiempo" class="row q-gutter-md items-center no-wrap">
            <div
              v-for="(linea, index) in lineaTiempo"
              :key="index"
              class="row items-center no-wrap"
            >
              <q-card
                class="custom-shadow2 text-white rounded-card cursor-pointer q-card-hover q-card-press bg-primary"
                style="width: 180px"
                @click="filtrarActividades(linea, index)"
              >
                <q-badge
                  v-if="filtrado && indice === index"
                  color="transparent"
                  floating
                  class="q-mt-xs"
                >
                  <q-icon
                    name="bi-check-circle-fill"
                    color="white"
                    size="sm"
                  ></q-icon>
                </q-badge>

                <q-card-section
                  class="column q-gutter-sm items-center text-center"
                >
                  <!-- <q-icon name="boy" size="50px" color="grey"></q-icon> -->
                  <div class="circulo">
                    <q-img
                      :src="linea.foto"
                      height="50px"
                      :fit="'contain'"
                    ></q-img>
                  </div>
                  <small>{{ linea.departamento }}</small>
                  <b>{{ linea.responsable }}</b>
                  <small>{{ linea.estado }}</small>
                  <small>{{ linea.created_at }}</small>
                </q-card-section>
              </q-card>

              <q-icon
                name="bi-caret-right-fill"
                size="md"
                color="primary"
                class="q-ml-md"
              ></q-icon>
            </div>
          </div>
        </q-scroll-area>
      </div>
      <!--
      <div class="col-12 rounded">
        <q-scroll-area
          ref="scrollAreaRef"
          style="height: 200px; max-width: 100%"
          class="q-pa-sm"
        >
          <div class="row q-gutter-md items-center no-wrap">
            <q-card
              class="custom-shadow2 rounded-card bg-primary text-white cursor-pointer q-card-hover q-card-press"
              style="width: 180px"
            >
              <q-card-section class="column q-gutter-sm items-center">
                <q-icon name="boy" size="50px"></q-icon>
                <span class="text-primary">.</span>
                <b>Todas las actividades</b>
                <span class="text-primary">...</span>
              </q-card-section>
            </q-card>

            <q-card
              class="custom-shadow2 no-border rounded-card cursor-pointer q-card-hover q-card-press"
              style="width: 180px"
            >
              <q-card-section class="column q-gutter-sm items-center">
                <q-icon name="boy" size="50px" color="grey"></q-icon>
                <span class="text-primary">Recursos Humanos</span>
                <b>1. Glenda Mendoza</b>
                <span>1 hora con 30 minutos</span>
              </q-card-section>
            </q-card>

            <q-icon
              name="bi-caret-right-fill"
              size="md"
              color="primary"
            ></q-icon>

            <q-card
              class="custom-shadow2 no-border rounded-card cursor-pointer q-card-hover q-card-press"
              style="width: 180px"
            >
              <q-card-section class="column q-gutter-sm items-center">
                <q-icon name="boy" size="50px" color="grey"></q-icon>
                <span class="text-primary">Informática</span>
                <b>2. Wilson Córdova</b>
                <span>1 hora con 30 minutos</span>
              </q-card-section>
            </q-card>

            <q-icon
              name="bi-caret-right-fill"
              size="md"
              color="primary"
            ></q-icon>

            <q-card
              class="custom-shadow2 no-border rounded-card cursor-pointer q-card-hover q-card-press"
              style="width: 180px"
            >
              <q-card-section class="column q-gutter-sm items-center">
                <q-icon name="boy" size="50px" color="grey"></q-icon>
                <span class="text-primary">Recursos Humanos</span>
                <b>3. Glenda Mendoza</b>
                <span>1 hora con 30 minutos</span>
              </q-card-section>
            </q-card>

            <q-icon
              name="bi-caret-right-fill"
              size="md"
              color="primary"
            ></q-icon>

            <q-card
              class="custom-shadow2 no-border rounded-card cursor-pointer q-card-hover q-card-press"
              style="width: 180px"
            >
              <q-card-section class="column q-gutter-sm items-center">
                <q-icon name="boy" size="50px" color="grey"></q-icon>
                <span class="text-primary">Recursos Humanos</span>
                <b>4. Glenda Mendoza</b>
                <span>1 hora con 30 minutos</span>
              </q-card-section>
            </q-card>

            <q-icon
              name="bi-caret-right-fill"
              size="md"
              color="primary"
            ></q-icon>

            <q-card
              class="custom-shadow2 no-border rounded-card cursor-pointer q-card-hover q-card-press"
              style="width: 180px"
            >
              <q-card-section class="column q-gutter-sm items-center">
                <q-icon name="boy" size="50px" color="grey"></q-icon>
                <span class="text-primary">Recursos Humanos</span>
                <b>5. Glenda Mendoza</b>
                <span>1 hora con 30 minutos</span>
              </q-card-section>
            </q-card>

            <q-icon
              name="bi-caret-right-fill"
              size="md"
              color="primary"
            ></q-icon>

            <q-card
              class="custom-shadow2 no-border rounded-card cursor-pointer q-card-hover q-card-press"
              style="width: 180px"
            >
              <q-card-section class="column q-gutter-sm items-center">
                <q-icon name="boy" size="50px" color="grey"></q-icon>
                <span class="text-primary">Recursos Humanos</span>
                <b>6. Glenda Mendoza</b>
                <span>1 hora con 30 minutos</span>
              </q-card-section>
            </q-card>

            <q-icon
              name="bi-caret-right-fill"
              size="md"
              color="primary"
            ></q-icon>

            <q-card
              class="custom-shadow2 no-border rounded-card cursor-pointer q-card-hover q-card-press"
              style="width: 180px"
            >
              <q-card-section class="column q-gutter-sm items-center">
                <q-icon name="boy" size="50px" color="grey"></q-icon>
                <span class="text-primary">Recursos Humanos</span>
                <b>7. Glenda Mendoza</b>
                <span>1 hora con 30 minutos</span>
              </q-card-section>
            </q-card>

            <q-icon
              name="bi-caret-right-fill"
              size="md"
              color="primary"
            ></q-icon>

            <q-card
              class="custom-shadow2 no-border rounded-card cursor-pointer q-card-hover q-card-press"
              style="width: 180px"
            >
              <q-card-section class="column q-gutter-sm items-center">
                <q-icon name="boy" size="50px" color="grey"></q-icon>
                <span class="text-primary">Recursos Humanos</span>
                <b>8. Glenda Mendoza</b>
                <span>1 hora con 30 minutos</span>
              </q-card-section>
            </q-card>

            <q-icon
              name="bi-caret-right-fill"
              size="md"
              color="primary"
            ></q-icon>

            <q-card
              class="custom-shadow2 no-border rounded-card cursor-pointer q-card-hover q-card-press"
              style="width: 180px"
            >
              <q-card-section class="column q-gutter-sm items-center">
                <q-icon name="boy" size="50px" color="grey"></q-icon>
                <span class="text-primary">Recursos Humanos</span>
                <b>9. Glenda Mendoza</b>
                <span>1 hora con 30 minutos</span>
              </q-card-section>
            </q-card>

            <q-icon
              name="bi-caret-right-fill"
              size="md"
              color="primary"
            ></q-icon>

            <q-card
              class="custom-shadow2 no-border rounded-card cursor-pointer q-card-hover q-card-press"
              style="width: 180px"
            >
              <q-card-section class="column q-gutter-sm items-center">
                <q-icon name="boy" size="50px" color="grey"></q-icon>
                <span class="text-primary">Médico</span>
                <b>10. Jeferson Freire</b>
                <span>1 hora con 30 minutos</span>
              </q-card-section>
            </q-card>
          </div>
        </q-scroll-area>
      </div>

    --></div>

    <q-card class="rounded-card custom-shadow no-border q-pa-md">
      <!--<div class="row justify-center q-gutter-md q-pt-xl q-pb-md">
        <div class="text-positive full-width text-center text-h3">6 horas</div>
        <div class="text-center full-width text-bold">
          Tiempo total del ticket
        </div>
      </div> -->
      <!-- {{ actividadesRealizadas }} -->
      <div class="row">
        <div class="col-12 text-center q-mb-md">
          <q-chip class="text-primary text-center bg-blue-2">{{
            mensajeFiltro
          }}</q-chip>
        </div>

        <div class="col-12 q-mb-md">
          <tabla-filas-dinamicas
            :listado="actividadesFiltradas"
            :configuracion-columnas="columnasActividades"
            :entidad="ActividadRealizadaSeguimientoTicket"
            :accion1="verFotografia"
            :mostrarAccion1Header="permitirSubir"
            titulo="Cronología de actividades realizadas"
            @guardarFila="(fila) => guardarFilaActividad(fila)"
          ></tabla-filas-dinamicas>
        </div>
        <!-- :editarFilaLocal="false" -->

        <div class="col-12 q-mb-md">
          <archivo-seguimiento
            ref="refArchivoSeguimiento"
            :mixin="mixinArchivoSeguimiento"
            :endpoint="endpoint"
            :permitir-subir="permitirSubir"
            :permitir-eliminar="permitirSubir"
          >
            <template #boton-subir>
              <q-btn
                v-if="mostrarBotonSubir"
                color="positive"
                push
                no-caps
                class="full-width q-mb-lg"
                @click="subirArchivos()"
              >
                <q-icon name="bi-upload" class="q-mr-sm" size="xs"></q-icon>
                Subir archivos seleccionados</q-btn
              >
            </template>
          </archivo-seguimiento>
        </div>
      </div>
    </q-card>

    <visor-imagen ref="refVisorImagen"></visor-imagen>
  </q-page>
</template>

<script src="./SeguimientoTicketPage.ts"></script>

<style lang="scss" scoped>
#responsables {
  position: relative;
  bottom: -10px;
}

.background-shadow {
  background-image: linear-gradient(127deg, #f2f2f2 80%, #dee3e4);
}

.circulo {
  border-radius: 100px !important;
  overflow: hidden !important;
  height: 40px;
  width: 40px;
}
</style>
