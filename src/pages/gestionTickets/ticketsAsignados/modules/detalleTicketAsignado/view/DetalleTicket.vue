<template>
  <div class="row q-col-gutter-sm">
    <div class="col-12 col-md-3 q-mb-md">
      <label class="q-mb-sm text-bold block">Código del ticket</label>
      <span>{{ ticket.codigo }}</span>
    </div>

    <div class="col-12 col-md-3 q-mb-md">
      <label class="q-mb-sm text-bold block">Asunto</label>
      <span>{{ ticket.asunto }}</span>
    </div>

    <div class="col-12 col-md-3 q-mb-md">
      <label class="q-mb-sm text-bold block">Prioridad</label>
      <span>{{ ticket.prioridad }}</span>
    </div>

    <div v-if="ticket.fecha_hora_limite" class="col-12 col-md-3 q-mb-md">
      <label class="q-mb-sm text-bold block">Fecha y hora límite</label>
      <span>{{ ticket.fecha_hora_limite }}</span>
    </div>

    <div class="col-12 col-md-3 q-mb-md">
      <label class="q-mb-sm text-bold block">Estado actual</label>
      <estados-subtareas :propsTable="{ value: ticket.estado }" />
    </div>

    <div v-if="ticket.tiempo_hasta_finalizar" class="col-12 col-md-3 q-mb-md">
      <label class="q-mb-sm text-bold block"
        >Tiempo total hasta finalizar</label
      >
      <q-icon name="bi-star-fill" color="orange-3" class="q-mr-sm"></q-icon>
      <span>{{ ticket.tiempo_hasta_finalizar }}</span>
    </div>

    <div v-if="ticket.tiempo_ocupado_pausas" class="col-12 col-md-3 q-mb-md">
      <label class="q-mb-sm text-bold block">Tiempo total pausado</label>
      <q-icon name="bi-pause-circle" color="pink-8" class="q-mr-sm"></q-icon>
      <span>{{ ticket.tiempo_ocupado_pausas }}</span>
    </div>

    <div class="col-12 col-md-3 q-mb-md">
      <label class="q-mb-sm text-bold block">Categoria tipo de ticket</label>
      <span>{{ ticket.categoria_tipo_ticket }}</span>
    </div>

    <div class="col-12 col-md-3 q-mb-md">
      <label class="q-mb-sm text-bold block">Tipo de ticket</label>
      <span>{{ ticket.tipo_ticket }}</span>
    </div>

    <div v-if="ticket.solicitante" class="col-12 col-md-3 q-mb-md">
      <label class="q-mb-sm text-bold block">Solicitante</label>
      <span>{{ ticket.solicitante }}</span>
    </div>

    <div v-if="ticket.departamento_responsable" class="col-12 col-md-3 q-mb-md">
      <label class="q-mb-sm text-bold block"
        >Actual departamento responsable</label
      >
      <span>{{ ticket.departamento_responsable }}</span>
    </div>

    <div v-if="ticket.responsable" class="col-12 col-md-3 q-mb-md">
      <label class="q-mb-sm text-bold block">Actual empleado responsable</label>
      <span>{{ ticket.responsable }}</span>
    </div>

    <div v-if="ticket.fecha_hora_solicitud" class="col-12 col-md-3 q-mb-md">
      <label class="q-mb-sm text-bold block">Fecha hora solicitud</label>
      <span>{{ ticket.fecha_hora_solicitud }}</span>
    </div>

    <div class="col-12 q-mb-md">
      <label class="q-mb-sm text-bold block">Descripción</label>
      <div
        v-html="ticket.descripcion"
        class="border-grey bg-grey-1 rounded q-pa-sm"
      ></div>
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
