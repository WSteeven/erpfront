<template>
    <!-- Verdadero -->
  <q-icon
    v-if="props.propsTable.value"
    name="bi-check-circle-fill"
    color="positive"
    size="sm"
    class="q-mr-xs"
  ></q-icon>

  <!-- Falso -->
  <q-icon
    v-if="!props.propsTable.value"
    name="bi-x-circle-fill"
    color="negative"
    size="sm"
    class="q-mr-xs"
  ></q-icon>
</template>

<script setup>
const props = defineProps({
  propsTable: {
    type: Object,
    required: true,
  },
})
</script>
