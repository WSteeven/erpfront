<template>
  <q-dialog v-model="mostrar" maximized>
    <q-card class="bg-black rounded-card no-border" flat>
      <div class="row q-gutter-sm justify-center closeButton">
        <q-btn
          round
          push
          color="positive"
          glossy
          icon="bi-arrow-clockwise"
          @click="rotateImage()"
        />

        <q-btn
          push
          dense
          color="white"
          rounded
          outline
          icon="bi-dash"
          @click="zoomOut()"
        />

        <q-btn
          dense
          push
          outline
          rounded
          color="white"
          icon="bi-plus"
          @click="zoomIn()"
        />

        <q-btn
          round
          push
          color="negative"
          glossy
          icon="bi-x"
          @click="() => (mostrar = false)"
        />
      </div>

      <q-card-section
        class="rounded-footer text-center q-pa-none q-overflow-auto"
      >
        <q-img
          :src="imagen"
          fit="contain"
          :width="$q.screen.xs ? '100%' : '80%'"
          height="100vh"
          spinner-color="white"
          class="q-overflow-auto"
          :img-style="{
            transform: 'rotate(' + rotation + 'deg) scale(' + zoomLevel + ')',
          }"
        >
        </q-img>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const mostrar = ref(false)
const imagen = ref()
const rotation = ref(0)
const zoomLevel = ref(1)

function abrir(urlImagen) {
  mostrar.value = true
  imagen.value = urlImagen
}

function rotateImage() {
  rotation.value += 90
}

function zoomIn() {
  zoomLevel.value += 0.1
}

function zoomOut() {
  zoomLevel.value -= 0.1
}

defineExpose({
  abrir,
})
</script>

<style scoped>
.image-container {
  position: relative;
  width: 200px; /* Ancho deseado para la imagen */
}

.zoomable-image {
  width: 100%;
  transform: scale(1);
  transition: transform 0.3s ease-in-out;
}

.zoom-controls {
  position: absolute;
  bottom: 10px;
  left: 0;
}

.button {
  margin-right: 10px;
}

.zoomable-image:hover {
  transform: scale(var(--zoom, 1));
}
</style>
