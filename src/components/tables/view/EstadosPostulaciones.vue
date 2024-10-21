<template>
  <q-chip v-if="opcionesEstadosPostulaciones.includes(props.propsTable.value)">
    <q-icon name="bi-circle-fill" class="q-mr-xs"></q-icon
    >{{ propsTable.value }}
  </q-chip>
</template>

<script setup>
import { opcionesEstadosPostulaciones } from 'config/seleccionContratacionPersonal.utils'

const props = defineProps({
  propsTable: {
    type: Object,
    required: true
  }
})
</script>
