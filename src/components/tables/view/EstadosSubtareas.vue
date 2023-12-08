<template>
  <!-- CREADO -->
  <q-chip
    v-if="props.propsTable.value === estadosTrabajos.CREADO"
    :class="{ 'bg-yellow-1': !$q.dark.isActive }"
    class="text-warning q-mx-none"
  >
    <q-icon name="bi-circle-fill" color="warning" class="q-mr-xs"></q-icon
    >{{ estadosTrabajos.CREADO }}
  </q-chip>

  <!-- ASIGNADO -->
  <q-chip
    v-if="props.propsTable.value === estadosTrabajos.ASIGNADO"
    :class="{ 'bg-indigo-1': !$q.dark.isActive }"
    class="text-indigo-4 q-mx-none"
  >
    <q-icon name="bi-circle-fill" color="indigo-3" class="q-mr-xs"></q-icon
    >{{ estadosTrabajos.ASIGNADO }}
  </q-chip>

  <!-- REASIGNADO -->
  <q-chip
    v-if="props.propsTable.value === estadosTickets.REASIGNADO"
    :class="{ 'bg-blue-grey-1': !$q.dark.isActive }"
    class="text-blue-grey-5 q-mx-none"
  >
    <q-icon name="bi-circle-fill" color="blue-grey-5" class="q-mr-xs"></q-icon
    >{{ estadosTickets.REASIGNADO }}
  </q-chip>

  <!-- AGENDADO -->
  <q-chip
    v-if="props.propsTable.value === estadosTrabajos.AGENDADO"
    :class="{ 'bg-deep-purple-1': !$q.dark.isActive }"
    class="text-deep-purple q-mx-none"
  >
    <q-icon name="bi-circle-fill" color="deep-purple-5" class="q-mr-xs"></q-icon
    >{{ estadosTrabajos.AGENDADO }}
  </q-chip>

  <!-- EJECUTANDO -->
  <q-chip
    v-if="props.propsTable.value === estadosTrabajos.EJECUTANDO"
    :class="{ 'bg-yellow-1': !$q.dark.isActive }"
    class="text-warning q-mx-none"
  >
    <q-icon name="bi-circle-fill" color="warning" class="q-mr-xs"></q-icon
    >{{ estadosTrabajos.EJECUTANDO }}
  </q-chip>

  <!-- PAUSADO -->
  <q-chip
    v-if="props.propsTable.value === estadosTrabajos.PAUSADO"
    :class="{ 'bg-grey-2': !$q.dark.isActive }"
    class="text-grey-8 q-mx-none"
  >
    <q-icon name="bi-circle-fill" color="grey-6" class="q-mr-xs"></q-icon
    >{{ estadosTrabajos.PAUSADO }}
  </q-chip>

  <!-- PENDIENTE-->
  <q-chip
    v-if="props.propsTable.value === estadosTrabajos.PENDIENTE"
    :class="{ 'bg-orange-1': !$q.dark.isActive }"
    class="text-orange q-mx-none"
  >
    <q-icon name="bi-circle-fill" color="accent" class="q-mr-xs"></q-icon
    >{{ estadosTrabajos.PENDIENTE }}
  </q-chip>

  <!-- SUSPENDIDO -->
  <q-chip
    v-if="props.propsTable.value === estadosTrabajos.SUSPENDIDO"
    :class="{ 'bg-red-1': !$q.dark.isActive }"
    class="text-red q-mx-none"
  >
    <q-icon name="bi-circle-fill" color="red" class="q-mr-xs"></q-icon
    >{{ estadosTrabajos.SUSPENDIDO }}
  </q-chip>

  <!-- CANCELADO -->
  <q-chip
    v-if="props.propsTable.value === estadosTrabajos.CANCELADO"
    class="bg-red-1 text-red q-mx-none"
  >
    <q-icon
      name="bi-exclamation-circle-fill"
      color="red"
      class="q-mr-xs"
    ></q-icon
    >{{ estadosTrabajos.CANCELADO }}
  </q-chip>

  <!-- RECHAZADO -->
  <q-chip
    v-if="props.propsTable.value === estadosTickets.RECHAZADO"
    class="bg-red-1 text-red q-mx-none"
  >
    <q-icon name="bi-circle-fill" color="red" class="q-mr-xs"></q-icon
    >{{ estadosTickets.RECHAZADO }}
  </q-chip>

  <!-- REALIZADO -->
  <q-chip
    v-if="props.propsTable.value === estadosTrabajos.REALIZADO"
    :class="{ 'bg-green-1': !$q.dark.isActive }"
    class="text-green q-mx-none"
  >
    <q-icon name="bi-circle-fill" color="positive" class="q-mr-xs"></q-icon
    >{{ estadosTrabajos.REALIZADO }}
  </q-chip>

  <!-- FINALIZADO -->
  <q-chip
    v-if="props.propsTable.value === estadosTrabajos.FINALIZADO"
    :class="{ 'bg-green-1': !$q.dark.isActive }"
    class="text-light-green q-mx-none"
  >
    <q-icon name="bi-circle-fill" color="light-green" class="q-mr-xs"></q-icon
    >{{ estadosTrabajos.FINALIZADO }}
  </q-chip>

  <!-- FINALIZADO SOLUCIONADO -->
  <q-chip
    v-if="props.propsTable.value === estadosTickets.FINALIZADO_SOLUCIONADO"
    :class="{ 'bg-green-1': !$q.dark.isActive }"
    class="q-mx-none"
    style="color: #9ba98c"
  >
    <q-icon
      name="bi-circle-fill"
      style="color: #9ba98c"
      class="q-mr-xs"
    ></q-icon
    >{{ estadosTickets.FINALIZADO_SOLUCIONADO }}
  </q-chip>

  <!-- FINALIZADO SIN SOLUCION -->
  <q-chip
    v-if="props.propsTable.value === estadosTickets.FINALIZADO_SIN_SOLUCION"
    :class="{ 'bg-green-1': !$q.dark.isActive }"
    class="text-light-green q-mx-none"
  >
    <q-icon name="bi-circle-fill" color="light-green" class="q-mr-xs"></q-icon
    >{{ estadosTickets.FINALIZADO_SIN_SOLUCION }}
  </q-chip>

  <q-chip
    v-if="props.propsTable.value === estadosTickets.CALIFICADO"
    :class="{ 'bg-green-2': !$q.dark.isActive }"
    class="text-green-10 q-mx-none"
  >
    <q-icon name="bi-circle-fill" color="green-10" class="q-mr-xs"></q-icon
    >{{ estadosTickets.CALIFICADO }}
  </q-chip>
</template>

<script setup>
import { estadosTickets } from 'config/tickets.utils'
import { estadosTrabajos } from 'config/utils'

const props = defineProps({
  propsTable: {
    type: Object,
    required: true,
  },
})
</script>
