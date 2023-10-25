<template>
  <q-page>
    <div class="text-center text-subtitle2 q-mb-md">
      Ticket {{ ticket.codigo }}
    </div>

    <q-card class="rounded-card custom-shadow q-pa-md">
      <div class="column q-col-gutter-sm q-mb-lg">
        <div class="col-12">
          <label class="q-mb-sm block">Asunto</label>
          <b>{{ ticket.asunto }}</b>
        </div>

        <div class="col-12">
          <label class="q-mb-sm block">Descripción</label>
          <b>{{ ticket.descripcion }}</b>
        </div>
      </div>
      <div class="row">
        <div class="col-12 q-mb-md">
          <tabla-filas-dinamicas
            :listado="actividadesRealizadas"
            :configuracion-columnas="columnasActividades"
            :entidad="ActividadRealizadaSeguimientoTicket"
            :accion1="verFotografia"
            :mostrarAccion1Header="permitirSubir"
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
