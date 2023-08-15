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
          round
          push
          color="negative"
          glossy
          icon="bi-x"
          @click="() => (mostrar = false)"
        />
      </div>

      <q-card-section class="rounded-footer text-center q-pa-none">
        <q-img
          :src="imagen"
          fit="contain"
          :width="$q.screen.xs ? '100%' : '80%'"
          height="100vh"
          spinner-color="white"
          :img-style="{ transform: 'rotate(' + rotation + 'deg)' }"
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

function abrir(urlImagen) {
  mostrar.value = true
  imagen.value = urlImagen
}

function rotateImage() {
  rotation.value += 90
}

defineExpose({
  abrir,
})
</script>
