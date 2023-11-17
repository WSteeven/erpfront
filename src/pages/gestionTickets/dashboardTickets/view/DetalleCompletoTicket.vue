<template>
  <div class="q-pa-md">
    <detalle-ticket :ticket="ticket"></detalle-ticket>

    <div class="col-12 q-mb-md">
      <archivo-seguimiento
        ref="refArchivoTicket"
        :mixin="mixinArchivoTicket"
        :endpoint="endpoint"
        :disable="true"
        :permitir-eliminar="false"
        :listar-al-guardar="false"
      ></archivo-seguimiento>
    </div>

    <q-card v-if="ticket.calificaciones.length" class="rounded-card q-mb-md">
      <q-card-section>
        <div class="text-bold q-mb-lg">
          <q-icon name="bi-stars"></q-icon>
          Calificaciones
        </div>
        <div
          v-for="item in ticket.calificaciones"
          :key="item.id"
          class="row q-col-gutter-sm q-mb-md"
        >
          <!-- Calificacion -->
          <div class="col-12 col-md-4">
            <label class="q-mb-sm block"
              >Calificación del {{ item.solicitante_o_responsable }}</label
            >
            <q-chip color="grey-3">
              <q-icon
                v-for="index in item.calificacion"
                :key="index"
                name="bi-star-fill"
                color="yellow-7"
                class="q-mr-xs"
              ></q-icon>
              {{ obtenerTexto(item.calificacion) }}
            </q-chip>
          </div>

          <!-- Observacion -->
          <div class="col-12 col-md-8">
            <label class="q-mb-sm block"
              >Observación del {{ item.solicitante_o_responsable }}</label
            >
            <q-input
              v-model="item.observacion"
              outlined
              disable
              dense
              autogrow
              type="textarea"
            >
            </q-input>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <essential-table
      v-if="pausas.length"
      titulo="Listado de pausas realizadas"
      :configuracionColumnas="columnasPausas"
      :datos="pausas"
      separador="cell"
      :alto-fijo="false"
      :permitir-buscar="false"
      :mostrar-footer="!pausas.length"
      estilos="margin-bottom: 16px;"
    ></essential-table>

    <essential-table
      v-if="rechazos.length"
      titulo="Listado de rechazos realizados"
      :configuracionColumnas="configuracionColumnasTicketRechazado"
      :datos="rechazos"
      separador="cell"
      :alto-fijo="false"
      :permitir-buscar="false"
      :mostrar-footer="!rechazos.length"
    ></essential-table>
  </div>

  <!-- <modales-entidad
    :comportamiento="modalesTicket"
    :mixin-modal="mixin"
    :accion="filtrarTickets"
    @guardado="guardado"
  /> -->
</template>

<script src="./DetalleCompletoTicket.ts"></script>
