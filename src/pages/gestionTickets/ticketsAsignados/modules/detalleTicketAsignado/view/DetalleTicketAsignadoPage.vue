<template>
  <div class="row q-col-gutter-sm bg-white">
    <div class="col-12 col-md-3">
      <label class="q-mb-sm block">Código del ticket</label>
      <b>{{ ticket.codigo }}</b>
    </div>

    <div class="col-12 col-md-3">
      <label class="q-mb-sm block">Asunto</label>
      <b>{{ ticket.asunto }}</b>
    </div>

    <div class="col-12 col-md-6">
      <label class="q-mb-sm block">Descripción</label>
      <b>{{ ticket.descripcion }}</b>
    </div>

    <div class="col-12 col-md-3">
      <label class="q-mb-sm block">Prioridad</label>
      <b>{{ ticket.prioridad }}</b>
    </div>

    <div v-if="ticket.fecha_hora_limite" class="col-12 col-md-3">
      <label class="q-mb-sm block">Fecha y hora límite</label>
      <b>{{ ticket.fecha_hora_limite }}</b>
    </div>

    <div class="col-12 col-md-3">
      <label class="q-mb-sm block">Estado</label>
      <b>{{ ticket.estado }}</b>
    </div>

    <div class="col-12 col-md-3">
      <label class="q-mb-sm block">Tipo de ticket</label>
      <b>{{ ticket.tipo_ticket }}</b>
    </div>

    <div v-if="ticket.departamento_responsable" class="col-12 col-md-3">
      <label class="q-mb-sm block">Actual departamento responsable</label>
      <b>{{ ticket.departamento_responsable }}</b>
    </div>

    <div v-if="ticket.responsable" class="col-12 col-md-3">
      <label class="q-mb-sm block">Actual empleado responsable</label>
      <b>{{ ticket.responsable }}</b>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Ticket } from 'pages/gestionTickets/tickets/domain/Ticket'

defineProps({
  ticket: {
    type: Object as () => Ticket,
    required: true,
  },
})
</script>
