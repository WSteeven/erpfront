<template>
  <q-dialog v-model="mostrar" maximized>
    <q-card class="bg-black rounded-card no-border" flat>
      <div
        class="row q-gutter-sm q-pb-sm justify-center closeButton bg-grey-10 full-width"
      >
        <div class="col-12 text-center">
          <q-btn
            color="white"
            flat
            label="Girar"
            no-caps
            icon="bi-arrow-clockwise"
            @click="rotateImage()"
          />

          <q-btn
            label="Alejar"
            no-caps
            dense
            color="white"
            flat
            icon="bi-dash"
            @click="zoomOut()"
          />

          <q-btn
            label="Acercar"
            no-caps
            dense
            flat
            color="white"
            icon="bi-plus"
            @click="zoomIn()"
          />

          <q-btn
            label="Tamaño Original"
            icon="aspect_ratio"
            flat
            no-caps
            color="white"
            @click="resetZoom()"
          />

          <q-btn
            flat
            color="white"
            icon="close"
            @click="() => (mostrar = false)"
          />
        </div>

        <div class="row col-12 q-col-gutter-x-sm q-px-lg text-white">
          <div v-if="texto1" class="col-12 col-md-3 text-h6">{{ texto1 }}</div>
          <div v-if="texto2" class="col-12 col-md-3 text-h6">{{ texto2 }}</div>
          <div v-if="texto3" class="col-12 col-md-3 text-h6">{{ texto3 }}</div>
          <div v-if="texto4" class="col-12 col-md-3 text-h6">{{ texto4 }}</div>
          <div v-if="texto5" class="col-12 col-md-3 text-h6">{{ texto5 }}</div>
        </div>
      </div>

      <q-card-section
        class="rounded-footer text-center q-pa-none q-overflow-auto image-container"
        @mousedown="startDragging"
        @mousemove="onDrag"
        @mouseup="stopDragging"
        @mouseleave="stopDragging"
        @touchstart="startDragging"
        @touchmove="onDrag"
        @touchend="stopDragging"
        ref="container"
      >
        <q-img
          :src="imagen"
          fit="contain"
          :width="$q.screen.xs ? '100%' : '80%'"
          height="100vh"
          spinner-color="white"
          :style="imageStyle"
          @wheel="onWheelZoom"
          class="zoomable-image"
        >
        </q-img>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'

defineProps({
  texto1: String,
  texto2: String,
  texto3: String,
  texto4: String,
  texto5: String
})

// Estado para controlar el zoom y la posición
const scale = ref(1)
const position = ref({ x: 0, y: 0 })
const dragging = ref(false)
const dragStart = ref({ x: 0, y: 0 })
const lastPosition = ref({ x: 0, y: 0 })

const container = ref(null)

// Método para manejar el zoom con la rueda del mouse
const onWheelZoom = event => {
  const zoomFactor = 0.1
  if (event.deltaY < 0) {
    scale.value += zoomFactor // Zoom in
  } else {
    scale.value = Math.max(1, scale.value - zoomFactor) // Zoom out, sin reducir más allá del 100%
  }
}

// Métodos para manejar el arrastre de la imagen (drag)
const startDragging = event => {
  dragging.value = true
  dragStart.value = {
    x: event.type.includes('touch') ? event.touches[0].pageX : event.pageX,
    y: event.type.includes('touch') ? event.touches[0].pageY : event.pageY
  }
  lastPosition.value = { ...position.value }
}

const onDrag = event => {
  if (!dragging.value) return

  const currentX = event.type.includes('touch')
    ? event.touches[0].pageX
    : event.pageX
  const currentY = event.type.includes('touch')
    ? event.touches[0].pageY
    : event.pageY

  position.value = {
    x: lastPosition.value.x + (currentX - dragStart.value.x),
    y: lastPosition.value.y + (currentY - dragStart.value.y)
  }
}

const stopDragging = () => {
  dragging.value = false
}

// Computed style para aplicar el zoom y la posición
const imageStyle = computed(() => {
  return {
    transform: `translate(${position.value.x}px, ${position.value.y}px) scale(${scale.value}) rotate(${rotation.value}deg)`,
    transition: dragging.value ? 'none' : 'transform 0.3s ease',
    cursor: dragging.value ? 'grabbing' : 'grab'
  }
})

const mostrar = ref(false)
const imagen = ref()
const rotation = ref(0)
// const zoomLevel = ref(1)

function abrir(urlImagen) {
  mostrar.value = true
  imagen.value = urlImagen
}

function rotateImage() {
  console.log(rotation.value)
  rotation.value += 90 // Rotar 90 grados en cada clic
}

// Métodos para hacer zoom
const zoomIn = () => {
  scale.value = Math.min(scale.value + 0.2, 5) // Zoom máximo de 500%
}

const zoomOut = () => {
  scale.value = Math.max(scale.value - 0.2, 1) // No permitir menos de 100%
}

const resetZoom = () => {
  scale.value = 1 // Restablecer zoom a 100%
  position.value = { x: 0, y: 0 } // Restablecer posición
  rotation.value = 0 // Restablecer rotación
}

defineExpose({
  abrir
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

.image-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
  touch-action: none; /* Importante para evitar el comportamiento predeterminado de scroll en móviles */
}

.zoomable-image {
  width: 100%;
  height: auto;
  cursor: grab;
}
</style>
