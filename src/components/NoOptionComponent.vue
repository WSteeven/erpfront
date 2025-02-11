<template>
  <q-item>
    <q-item-section class="text-grey">
      {{ message }}
    </q-item-section>
  </q-item>
</template>
<script setup lang="ts">
defineProps({
  message: {
    type: String,
    default: 'No hay resultados'
  }
})
</script>
