<template>
  <q-page>
    <div class="bg-desenfoque rounded border-white q-pa-md">
      <div class="row q-mb-md">
        <div class="col-12 text-bold q-mb-md">
          <q-icon name="bi-ticket-detailed" class="q-mr-sm"></q-icon>
          Detalles del ticket
        </div>

        <div class="col-12 col-md-3">
          <label class="q-mb-sm text-bold block">Código</label>
          <div class="q-mb-md">{{ ticket.codigo }}</div>
        </div>

        <div class="col-12 col-md-9">
          <label class="q-mb-sm text-bold block">Asunto</label>
          <div class="q-mb-md">{{ ticket.asunto }}</div>
        </div>

        <div class="col-12">
          <label class="q-mb-sm text-bold block">Descripción</label>
          <div
            v-html="ticket.descripcion"
            class="border-white bg-solid q-pa-sm"
          ></div>
        </div>
      </div>

      <q-separator></q-separator>

      <div id="responsables" class="row items-center q-mb-md">
        <div class="col-12 q-mb-md">
          <div class="row items-center q-pt-md">
            <div
              class="col-12 col-sm-6 col-md-6"
              :class="{ 'text-center q-mb-md': $q.screen.xs }"
            >
              <div class="text-bold">
                <q-icon name="bi-clock-history" class="q-mr-sm"></q-icon>
                Linea de tiempo del ticket
              </div>
              <small
                >Seleccione un responsable para filtrar las actividades
                registradas de la linea de tiempo del ticket</small
              >
            </div>
          </div>
        </div>

        <div class="col-12 bg-solid q-pa-sm rounded q-mb-md">
          <q-scroll-area
            ref="scrollAreaRef"
            style="height: 250px; max-width: 100%"
          >
            <div
              v-if="lineaTiempo"
              class="row q-gutter-md items-center no-wrap q-pa-sm"
            >
              <div
                v-for="(linea, index) in lineaTiempo"
                :key="index"
                class="row items-center no-wrap"
              >
                <q-card
                  class="rounded cursor-pointer q-card-hover q-card-press bg-solid border-grey"
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

          <div
            class="row justify-center"
            :class="{
              'justify-center': $q.screen.xs,
              'justify-end': !$q.screen.xs
            }"
          >
            <q-btn
              icon="bi-chevron-left"
              class="bg-desenfoque text-primary q-pr-md q-mr-sm"
              @click="anterior"
              unelevated
              rounded
              no-caps
              dense
              label="Regresar"
            ></q-btn>
            <q-btn
              icon-right="bi-chevron-right"
              class="bg-desenfoque text-primary q-pl-md"
              @click.stop="siguiente"
              unelevated
              rounded
              no-caps
              dense
              label="Avanzar"
            ></q-btn>
          </div>
        </div>

        <div class="col-12">
          <q-separator class="q-mb-md"></q-separator>
        </div>

        <div class="col-12 text-bold q-mb-md">
          <q-icon name="bi-list" class="q-mr-sm"></q-icon>
          Actividades registradas
        </div>

        <div class="col-12 q-mb-md bg-solid rounded q-pa-sm">
          <!-- <q-chip
            class="text-primary text-center"
            :class="{ 'q-py-xl': $q.screen.xs }"
          > -->
          <div class="text-wrap q-pa-sm">
            <q-icon name="bi-clock-history" class="q-mr-sm"></q-icon>
            {{ mensajeFiltro }}
          </div>
          <!-- </q-chip> -->

          <tabla-filas-dinamicas
            :listado="actividadesFiltradas"
            :configuracion-columnas="columnasActividades"
            :entidad="ActividadRealizadaSeguimientoTicket"
            :accion1="verFotografia"
            :mostrarAccion1Header="permitirSubir"
            titulo="Cronología de actividades realizadas"
            @guardarFila="fila => guardarFilaActividad(fila)"
            :ajustar-celdas="true"
          ></tabla-filas-dinamicas>
        </div>

        <div class="col-12 q-mb-md">
          <q-separator></q-separator>
        </div>

        <div class="col-12 text-bold q-mb-md">
          <q-icon name="bi-archive" class="q-mr-sm"></q-icon>
          Archivos
        </div>

        <div class="col-12">
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

        <div class="col-12 q-mb-md">
          <q-separator></q-separator>
        </div>

        <div class="col-12 text-bold q-mb-md">
          <q-icon name="bi-chat-square-text" class="q-mr-sm"></q-icon>
          Comentarios
        </div>

        <div class="q-pa-md row col-12 justify-center bg-solid rounded">
          <div class="full-width q-col-gutter-sm row q-mb-md">
            <span v-for="cc in ticket.cc" :key="cc">
              <q-icon
                name="bi-circle-fill"
                color="positive"
                class="q-mr-sm"
              />{{ cc }}
            </span>
            <div class="full-width">
              <q-icon name="people" class="q-mr-sm"></q-icon>
              Miembros que pueden comentar
            </div>
          </div>

          <div class="col-12 q-mb-md">
            <q-separator></q-separator>
          </div>

          <div v-if="comentarios.length" style="width: 100%">
            <q-chat-message
              v-for="comentario in comentarios"
              :key="comentario.id"
              :name="comentario.empleado"
              :avatar="comentario.avatar"
              :text="comentario.comentario"
              :stamp="comentario.stamp"
              :sent="comentario.sent"
              :bg-color="comentario.sent ? 'primary' : 'grey-4'"
              :text-color="comentario.sent ? 'white' : 'black'"
            />
          </div>

          <div v-else>Aún no hay comentarios.</div>

          <div class="col-12 q-my-md">
            <q-separator></q-separator>
          </div>

          <div class="col-12">
            <q-input
              v-model="comentarioTicket.comentario"
              placeholder="Mensaje..."
              outlined
              rounded
              dense
              autogrow
              type="textarea"
              class="col-11"
              @keyup.enter="guardarComentario(comentarioTicket, false)"
            >
              <template #append>
                <q-btn
                  color="primary"
                  round
                  flat
                  @click="guardarComentario(comentarioTicket, false)"
                >
                  <q-icon name="send" color="primary"></q-icon>
                </q-btn>
              </template>
            </q-input>
          </div>
        </div>
      </div>

      <visor-imagen ref="refVisorImagen"></visor-imagen>
    </div>
  </q-page>
</template>

<script src="./SeguimientoTicketPage.ts"></script>

<style lang="scss" scoped>
#responsables {
  position: relative;
  // bottom: -10px;
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
