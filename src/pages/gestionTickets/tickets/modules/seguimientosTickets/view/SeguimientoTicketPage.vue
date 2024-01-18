<template>
  <q-page>
    <div class="text-center text-primary q-mb-md">
      Ticket {{ ticket.codigo }}
    </div>

    <div class="row bg-body-table rounded q-pa-md border-grey">
      <div class="col-12">
        <label class="q-mb-sm block">Asunto</label>
        <div class="q-mb-md text-bold">{{ ticket.asunto }}</div>
      </div>

      <div class="col-12">
        <label class="q-mb-sm block">Descripción</label>
        <b>{{ ticket.descripcion }}</b>
      </div>
    </div>

    <div
      id="responsables"
      class="row items-center bg-body-table border-grey rounded q-mb-lg"
    >
      <div class="col-12">
        <div class="row q-px-md items-center q-pt-md">
          <div
            class="col-12 col-sm-6 col-md-6 text-primary"
            :class="{ 'text-center q-mb-md': $q.screen.xs }"
          >
            <div class="text-subtitle2 text-shadow">
              Linea de tiempo del ticket
            </div>
            <small
              >Seleccione un responsable para filtrar las actividades
              registradas de la linea de tiempo del ticket</small
            >
          </div>
        </div>
      </div>

      <div class="col-12">
        <q-scroll-area
          ref="scrollAreaRef"
          style="height: 250px; max-width: 100%"
          class="q-pa-sm"
        >
          <div
            v-if="lineaTiempo"
            class="row q-gutter-md items-center no-wrap bg-body-table rounded q-pa-xs"
          >
            <div
              v-for="(linea, index) in lineaTiempo"
              :key="index"
              class="row items-center no-wrap"
            >
              <q-card
                class="custom-shadow2 text-grey-8 rounded-card cursor-pointer q-card-hover q-card-press bg-body-table"
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
                color="grey-6"
                class="q-ml-md"
              ></q-icon>
            </div>
          </div>
        </q-scroll-area>
      </div>

      <div class="col-12 q-mb-sm">
        <div
          class="row justify-center"
          :class="{
            'justify-center': $q.screen.xs,
            'justify-end': !$q.screen.xs,
          }"
        >
          <q-btn
            icon="bi-chevron-left"
            color="blue-6"
            class="bg-primary q-pr-md q-mr-sm custom-shadow2"
            @click="anterior"
            rounded
            no-caps
            dense
          ></q-btn>
          <q-btn
            icon-right="bi-chevron-right"
            color="blue-6"
            class="bg-primary q-pl-md custom-shadow2"
            @click.stop="siguiente"
            rounded
            no-caps
            dense
          ></q-btn>
        </div>
      </div>
    </div>

    <q-card class="rounded-card custom-shadow q-pa-md">
      <div class="row">
        <div class="col-12 text-center q-mb-md">
          <q-chip
            class="text-primary text-center bg-blue-2"
            :class="{ 'q-py-xl': $q.screen.xs }"
          >
            <q-icon name="bi-clock-history" class="q-mr-sm"></q-icon>
            <span class="text-wrap">
              {{ mensajeFiltro }}
            </span>
          </q-chip>
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
            :ajustar-celdas="true"
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
  background-color: #fff;
}
</style>
