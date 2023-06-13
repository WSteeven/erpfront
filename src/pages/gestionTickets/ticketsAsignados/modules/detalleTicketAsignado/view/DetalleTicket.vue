<template>
  <div class="row q-col-gutter-sm">
    <div class="col-12 col-md-3">
      <label class="q-mb-sm block">Código del ticket</label>
      <b>{{ ticket.codigo }}</b>
      <!-- <q-input :model-value="ticket.codigo" outlined disable dense> </q-input> -->
    </div>

    <div class="col-12 col-md-3">
      <label class="q-mb-sm block">Asunto</label>
      <b>{{ ticket.asunto }}</b>
      <!-- <q-input :model-value="ticket.asunto" outlined disable dense> </q-input> -->
    </div>

    <div class="col-12 col-md-6">
      <label class="q-mb-sm block">Descripción</label>
      <b>{{ ticket.descripcion }}</b>
      <!-- <q-input
        :model-value="ticket.descripcion"
        outlined
        disable
        dense
        autogrow
      >
      </q-input> -->
    </div>

    <div class="col-12 col-md-3">
      <label class="q-mb-sm block">Prioridad</label>
      <b>{{ ticket.prioridad }}</b>
      <!-- <q-input :model-value="ticket.prioridad" outlined disable dense></q-input> -->
    </div>

    <div v-if="ticket.fecha_hora_limite" class="col-12 col-md-3">
      <label class="q-mb-sm block">Fecha y hora límite</label>
      <b>{{ ticket.fecha_hora_limite }}</b>
      <!-- <q-input :model-value="ticket.fecha_hora_limite" outlined disable dense></q-input> -->
    </div>

    <div class="col-12 col-md-3">
      <label class="q-mb-sm block">Estado actual</label>
      <!-- <b>{{ ticket.estado }}</b> -->
      <!-- <q-input :model-value="ticket.estado" outlined disable dense> </q-input> -->
      <estados-subtareas :propsTable="{ value: ticket.estado }" />
    </div>

    <div class="col-12 col-md-3">
      <label class="q-mb-sm block">Tipo de ticket</label>
      <b>{{ ticket.tipo_ticket }}</b>
      <!-- <q-input :model-value="ticket.tipo_ticket" outlined disable dense></q-input> -->
    </div>

    <div v-if="ticket.departamento_responsable" class="col-12 col-md-3">
      <label class="q-mb-sm block">Actual departamento responsable</label>
      <b>{{ ticket.departamento_responsable }}</b>
      <!-- <q-input
        :model-value="ticket.departamento_responsable"
        outlined
        disable
        dense
      >
      </q-input> -->
    </div>

    <div v-if="ticket.responsable" class="col-12 col-md-3">
      <label class="q-mb-sm block">Actual empleado responsable</label>
      <b>{{ ticket.responsable }}</b>
      <!-- <q-input :model-value="ticket.responsable" outlined disable dense></q-input> -->
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Ticket } from 'pages/gestionTickets/tickets/domain/Ticket'
import EstadosSubtareas from 'components/tables/view/EstadosSubtareas.vue'

defineProps({
  ticket: {
    type: Object as () => Ticket,
    required: true,
  },
})
</script>
