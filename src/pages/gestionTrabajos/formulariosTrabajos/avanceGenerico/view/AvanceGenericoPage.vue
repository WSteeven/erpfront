<template>
  <div class="q-mb-md">
    <trabajo-realizado></trabajo-realizado>
  </div>
  <tabla-observaciones></tabla-observaciones>
</template>

<script lang="ts" setup>
import TrabajoRealizado from 'pages/gestionTrabajos/formulariosTrabajos/trabajosRealizados/view/TablaTrabajoRealizadoPage.vue'
import TablaObservaciones from 'gestionTrabajos/formulariosTrabajos/tablaObservaciones/view/TablaObservacion.vue'
defineEmits(['cerrar-modal', 'guardado'])
</script>
