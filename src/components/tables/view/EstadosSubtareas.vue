<template>
  <!-- CREADO -->
  <q-chip
    v-if="props.propsTable.value === estadosSubtareas.CREADO"
    :class="{ 'bg-yellow-1': !$q.dark.isActive }"
    class="text-warning"
  >
    <q-icon name="bi-circle-fill" color="warning" class="q-mr-xs"></q-icon
    >{{ estadosSubtareas.CREADO }}
  </q-chip>

  <!-- ASIGNADO -->
  <q-chip
    v-if="props.propsTable.value === estadosSubtareas.ASIGNADO"
    :class="{ 'bg-purple-1': !$q.dark.isActive }"
    class="text-purple"
  >
    <q-icon name="bi-circle-fill" color="purple-5" class="q-mr-xs"></q-icon
    >{{ estadosSubtareas.ASIGNADO }}
  </q-chip>

  <!-- EJECUTANDO -->
  <q-chip
    v-if="props.propsTable.value === estadosSubtareas.EJECUTANDO"
    :class="{ 'bg-blue-1': !$q.dark.isActive }"
    class="text-blue"
  >
    <q-icon name="bi-circle-fill" color="blue" class="q-mr-xs"></q-icon
    >{{ estadosSubtareas.EJECUTANDO }}
  </q-chip>

  <!-- PAUSADO -->
  <q-chip
    v-if="props.propsTable.value === estadosSubtareas.PAUSADO"
    :class="{ 'bg-grey-3': !$q.dark.isActive }"
  >
    <q-icon name="bi-circle-fill" color="grey-6" class="q-mr-xs"></q-icon
    >{{ estadosSubtareas.PAUSADO }}
  </q-chip>

  <!-- SUSPENDIDO -->
  <q-chip
    v-if="props.propsTable.value === estadosSubtareas.SUSPENDIDO"
    :class="{ 'bg-red-1': !$q.dark.isActive }"
    class="text-red"
  >
    <q-icon name="bi-circle-fill" color="red" class="q-mr-xs"></q-icon
    >{{ estadosSubtareas.SUSPENDIDO }}
  </q-chip>

  <!-- CANCELADO -->
  <q-chip
    v-if="props.propsTable.value === estadosSubtareas.CANCELADO"
    class="bg-red-1 text-red"
  >
    <q-icon
      name="bi-exclamation-circle-fill"
      color="red"
      class="q-mr-xs"
    ></q-icon
    >{{ estadosSubtareas.CANCELADO }}
  </q-chip>

  <!-- REALIZADO -->
  <q-chip
    v-if="props.propsTable.value === estadosSubtareas.REALIZADO"
    :class="{ 'bg-green-1': !$q.dark.isActive }"
    class="text-green"
  >
    <q-icon name="bi-circle-fill" color="positive" class="q-mr-xs"></q-icon
    >{{ estadosSubtareas.REALIZADO }}
  </q-chip>

  <!-- FINALIZADO -->
  <q-chip
    v-if="props.propsTable.value === estadosSubtareas.FINALIZADO"
    :class="{ 'bg-green-1': !$q.dark.isActive }"
    class="text-light-green"
  >
    <q-icon name="bi-circle-fill" color="light-green" class="q-mr-xs"></q-icon
    >{{ estadosSubtareas.FINALIZADO }}
  </q-chip>
</template>

<script setup>
import { estadosSubtareas } from 'config/utils'

const props = defineProps({
  propsTable: {
    type: Object,
    required: true,
  },
})
</script>
