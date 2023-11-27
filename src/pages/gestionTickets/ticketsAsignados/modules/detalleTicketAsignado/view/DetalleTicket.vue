<template>
  <div class="row q-col-gutter-sm">
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
      <label class="q-mb-sm block">Estado actual</label>
      <estados-subtareas :propsTable="{ value: ticket.estado }" />
    </div>

    <div v-if="ticket.tiempo_hasta_finalizar" class="col-12 col-md-3">
      <label class="q-mb-sm block">Tiempo total hasta finalizar</label>
      <q-icon name="bi-star-fill" color="orange-3" class="q-mr-sm"></q-icon>
      <b>{{ ticket.tiempo_hasta_finalizar }}</b>
    </div>

    <div v-if="ticket.tiempo_ocupado_pausas" class="col-12 col-md-3">
      <label class="q-mb-sm block">Tiempo total pausado</label>
      <q-icon name="bi-pause-circle" color="pink-8" class="q-mr-sm"></q-icon>
      <b>{{ ticket.tiempo_ocupado_pausas }}</b>
    </div>

    <div class="col-12 col-md-3">
      <label class="q-mb-sm block">Categoria tipo de ticket</label>
      <b>{{ ticket.categoria_tipo_ticket }}</b>
    </div>

    <div class="col-12 col-md-3">
      <label class="q-mb-sm block">Tipo de ticket</label>
      <b>{{ ticket.tipo_ticket }}</b>
    </div>

    <div v-if="ticket.solicitante" class="col-12 col-md-3">
      <label class="q-mb-sm block">Solicitante</label>
      <b>{{ ticket.solicitante }}</b>
    </div>

    <div v-if="ticket.departamento_responsable" class="col-12 col-md-3">
      <label class="q-mb-sm block">Actual departamento responsable</label>
      <b>{{ ticket.departamento_responsable }}</b>
    </div>

    <div v-if="ticket.responsable" class="col-12 col-md-3">
      <label class="q-mb-sm block">Actual empleado responsable</label>
      <b>{{ ticket.responsable }}</b>
    </div>

    <div v-if="ticket.fecha_hora_solicitud" class="col-12 col-md-3">
      <label class="q-mb-sm block">Fecha hora solicitud</label>
      <b>{{ ticket.fecha_hora_solicitud }}</b>
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
