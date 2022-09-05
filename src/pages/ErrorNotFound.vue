<template>
  <div
    class="fullscreen text-white text-center q-pa-md flex flex-center fondo-gradiente"
  >
    <div>
      <div style="font-size: 30vh">404</div>

      <div class="text-h2" style="opacity: 0.4">
        No se encuentra el recurso solicitado
      </div>

      <q-btn
        class="q-mt-xl"
        color="white"
        text-color="secondary"
        unelevated
        to="/"
        label="Ver tablero"
        no-caps
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ErrorNotFound',
})
</script>
