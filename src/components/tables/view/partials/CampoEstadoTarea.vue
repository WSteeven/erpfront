<template>
  <q-chip :color="colorEstado" text-color="white" outline>
    <q-icon
      :name="iconoEstado"
      :color="colorEstado"
      size="sm"
      class="q-mr-xs"
    />
    {{ propsTable.value }}
  </q-chip>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  propsTable: {
    type: Object,
    required: true
  }
})

// Estado actual de la fila
const estado = computed(() =>
  (props.propsTable?.value || '').toString().trim().toUpperCase()
)

// Definir color según el estado
const colorEstado = computed(() => {
  switch (estado.value) {
    case 'INICIADA':
      return 'info' // azul
    case 'FINALIZADA':
      return 'positive' // verde
    case 'PENDIENTE':
      return 'warning' // amarillo
    case 'CANCELADA':
    case 'NO REALIZADA':
    case 'RIESGO DE PERDERSE':
      return 'negative' // rojo
    default:
      return 'grey' // por si llega un estado desconocido
  }
})

// Ícono según el estado (opcionalmente puedes personalizarlo más)
const iconoEstado = computed(() => {
  switch (estado.value) {
    case 'FINALIZADA':
      return 'bi-check-circle-fill'
    case 'INICIADA':
      return 'bi-play-circle-fill'
    case 'PENDIENTE':
      return 'bi-hourglass-split'
    case 'CANCELADA':
    case 'NO REALIZADA':
      return 'bi-x-circle-fill'
    case 'RIESGO DE PERDERSE':
      return 'bi-exclamation-triangle-fill'
    default:
      return 'bi-question-circle-fill'
  }
})
</script>
