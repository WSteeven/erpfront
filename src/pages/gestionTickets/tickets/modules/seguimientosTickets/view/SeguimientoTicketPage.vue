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
                Subir archivos seleccionados
              </q-btn>
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

        <!-- CHAT CON ANCHO COMPLETO Y SCROLL PERFECTO -->
        <!-- CHAT CON ANCHO 100% REAL -->
        <div
          class="bg-solid full-width rounded overflow-hidden shadow-2"
          style="height: 520px; display: flex; flex-direction: column"
        >
          <!-- Header CC -->
          <div class="q-pa-md q-pb-sm border-bottom">
            <div class="row items-center text-caption text-grey-7 q-mb-xs">
              <q-icon name="people" size="xs" class="q-mr-xs" />
              Miembros que pueden comentar
            </div>
            <div class="row q-col-gutter-xs text-caption">
              <span v-for="cc in ticket.cc" :key="cc" class="q-mr-md">
                <q-icon
                  name="bi-circle-fill"
                  color="positive"
                  size="8px"
                  class="q-mr-xs"
                />
                {{ cc }}
              </span>
            </div>
          </div>

          <!-- Área de mensajes -->
          <div
            ref="chatContainer"
            class="flex-grow-1 q-px-md q-py-sm"
            style="overflow-y: auto; min-height: 0"
          >
            <div
              v-if="comentarios.length"
              class="text-center text-grey-6 q-mt-xl"
            >
              <!-- EL TRUCO ESTÁ AQUÍ: class="chat-message-full" -->
              <q-chat-message
                v-for="comentario in comentarios"
                :key="comentario.id"
                :name="comentario.empleado"
                :avatar="comentario.avatar"
                :stamp="dayjs(comentario.stamp).fromNow()"
                :sent="comentario.sent"
                :bg-color="comentario.sent ? 'primary' : 'grey-4'"
                :text-color="comentario.sent ? 'white' : 'black'"
                class="chat-message-full q-mb-md"
              >
                <!-- Tu contenido normal -->
                <div
                  v-if="comentario.comentario"
                  v-html="nl2br(escapeHtml(comentario.comentario))"
                ></div>

                <!-- Adjuntos -->
                <div
                  v-if="comentario.adjuntos && comentario.adjuntos.length"
                  class="q-mt-md"
                >
                  <div
                    v-for="(adjunto, i) in comentario.adjuntos"
                    :key="i"
                    class="q-mb-sm"
                  >
                    <!-- Imagen -->
                    <img alt="imagen"
                      v-if="esImagen(adjunto.url)"
                      :src="adjunto.url"
                      style="
                        max-width: 320px;
                        border-radius: 12px;
                        cursor: pointer;
                      "
                      @click="abrirVisor(adjunto.url)"
                    />
                    <!-- Archivo -->
                    <q-btn
                      v-else
                      unelevated
                      rounded
                      no-caps
                      color="grey-3"
                      text-color="black"
                      :icon="iconArchivo(adjunto.tipo || adjunto.url)"
                      :label="adjunto.nombre || 'Archivo'"
                      :href="adjunto.url"
                      target="_blank"
                      class="q-pa-sm"
                    >
                      <q-tooltip>{{ adjunto.nombre }}</q-tooltip>
                    </q-btn>
                  </div>
                </div>
              </q-chat-message>
            </div>
            <div v-else class="text-center text-grey-6 q-my-xl">
              Aún no hay comentarios.
            </div>
          </div>
            <q-separator class="col-12 q-my-md" />

            <!-- Input inferior (sin cambios) -->
            <div class="q-pa-md q-pt-sm bg-surface">
              <div class="col-12">
                <div class="row items-end q-col-gutter-sm">
                  <!-- Texto -->
                  <div class="col">
                    <q-input v-model="comentarioTicket.comentario"
                             placeholder="Escribe un mensaje... (Ctrl + Enter para enviar)" outlined rounded dense autogrow
                             type="textarea" @keyup.ctrl.enter="enviarComentario" />
                  </div>

                  <!-- Adjuntar -->
                  <div class="col-auto">
                    <q-btn round flat icon="attach_file" color="grey-7">
                      <q-menu anchor="top end" self="top end">
                        <q-list style="min-width: 180px">
                          <q-item clickable v-close-popup @click="inputImagenRef?.click()">
                            <q-item-section avatar>
                              <q-icon name="image" color="primary" />
                            </q-item-section>
                            <q-item-section>Imagen</q-item-section>
                          </q-item>
                          <q-item clickable v-close-popup @click="inputArchivoRef?.click()">
                            <q-item-section avatar>
                              <q-icon name="description" color="green" />
                            </q-item-section>
                            <q-item-section>Archivo</q-item-section>
                          </q-item>
                        </q-list>
                      </q-menu>
                    </q-btn>

                    <!-- Inputs ocultos -->
                    <input ref="inputImagenRef" type="file" accept="image/*" multiple hidden @change="manejarAdjuntos" />
                    <input ref="inputArchivoRef" type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.zip" multiple hidden
                           @change="manejarAdjuntos" />
                  </div>

                  <!-- Enviar -->
                  <div class="col-auto">
                    <q-btn round color="primary" icon="send" :disable="
                    !comentarioTicket.comentario?.trim() && adjuntosTemp.length === 0
                  " @click="enviarComentario" />
                  </div>
                </div>

                <!-- Vista previa de adjuntos -->
                <div v-if="adjuntosTemp.length" class="q-mt-md row q-gutter-sm">
                  <div v-for="(file, index) in adjuntosTemp" :key="index" class="relative-position">
                    <img alt="vista previa" v-if="file.preview" :src="file.preview" style="
                    width: 100px;
                    height: 100px;
                    object-fit: cover;
                    border-radius: 8px;
                  " />
                    <div v-else class="bg-grey-3 rounded-borders" style="
                    width: 100px;
                    height: 100px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                  ">
                      <q-icon :name="iconArchivo(file.type)" size="2rem" />
                    </div>

                    <q-btn round dense flat size="xs" color="negative" icon="close" class="absolute-top-right"
                           style="margin: 4px" @click="adjuntosTemp.splice(index, 1)" />

                    <div class="text-caption text-center q-mt-xs text-truncate" style="max-width: 100px">
                      {{ file.name }}
                    </div>
                  </div>
                </div>
            </div>
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

// Forzar que q-chat-message ocupe todo el ancho
::v-deep(.q-message) {
  max-width: 100% !important;
  width: 100% !important;
}

::v-deep(.q-message-container) {
  width: 100% !important;
}

// Opcional: más espacio entre mensajes
::v-deep(.q-message) {
  margin-bottom: 16px !important;
}
</style>
