<template>
  <q-dialog v-model="visible" maximized>
    <q-card class="bg-black column" style="height: 100vh;">

      <!-- HEADER -->
      <div class="row items-center justify-between q-pa-sm bg-grey-10 text-white">

        <div>
          {{ indexActual + 1 }} / {{ imagenes.length }}
        </div>

        <div class="row q-gutter-sm">
          <q-btn flat icon="chevron_left" @click="anterior" :disable="indexActual === 0" />
          <q-btn flat icon="chevron_right" @click="siguiente" :disable="indexActual === imagenes.length - 1" />

          <q-btn flat icon="bi-arrow-clockwise" @click="rotateImage" />
          <q-btn flat icon="bi-dash" @click="zoomOut" />
          <q-btn flat icon="bi-plus" @click="zoomIn" />
          <q-btn flat icon="aspect_ratio" @click="resetZoom" />
          <q-btn flat icon="close" @click="visible = false" />
        </div>

      </div>

      <!-- IMAGEN -->
      <div
        class="col flex flex-center image-container"
        @mousedown="startDragging"
        @mousemove="onDrag"
        @mouseup="stopDragging"
        @mouseleave="stopDragging"
        @touchstart="handleSwipeStart"
        @touchmove="onDrag"
        @touchend="handleSwipeEnd"
      >
        <q-img
          :src="imagenActual.url"
          fit="contain"
          style="max-width: 100%; max-height: 100%;"
          :style="imageStyle"
          loading="lazy"
          @wheel="onWheelZoom"
        />
      </div>

      <!-- FOOTER -->
      <div class="bg-grey-10 text-white q-pa-sm text-center">
        <div class="text-subtitle2">
          {{ imagenActual.descripcion }}
        </div>
        <div class="text-caption">
          {{ imagenActual.fecha }}
        </div>
      </div>

    </q-card>
  </q-dialog>
</template>

<script setup>
import { onUnmounted, watch , ref, computed } from 'vue'

const visible = ref(false)
const imagenes = ref([])
const indexActual = ref(0)

// transformaciones
const scale = ref(1)
const position = ref({ x: 0, y: 0 })
const rotation = ref(0)

// drag
const dragging = ref(false)
const dragStart = ref({ x: 0, y: 0 })
const lastPosition = ref({ x: 0, y: 0 })

// swipe
const touchStartX = ref(0)

const imagenActual = computed(() => imagenes.value[indexActual.value] || {})

// =========================
// API pública
// =========================
function abrir(lista, index = 0) {
  imagenes.value = lista
  indexActual.value = index
  visible.value = true
  resetZoom()
}

// =========================
// navegación
// =========================
function siguiente() {
  if (indexActual.value < imagenes.value.length - 1) {
    indexActual.value++
    resetZoom()
  }
}

function anterior() {
  if (indexActual.value > 0) {
    indexActual.value--
    resetZoom()
  }
}

const handleKeydown = (e) => {
  if (!visible.value) return

  switch (e.key) {
    case 'ArrowRight':
      siguiente()
      break
    case 'ArrowLeft':
      anterior()
      break
    case 'Escape':
      visible.value = false
      break
  }
}


// =========================
// watches and hooks
// =========================
onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
watch(visible, (val) => {
  if (val) {
    window.addEventListener('keydown', handleKeydown)
  } else {
    window.removeEventListener('keydown', handleKeydown)
  }
})

// =========================
// zoom / rotate
// =========================
function zoomIn() {
  scale.value = Math.min(scale.value + 0.2, 5)
}

function zoomOut() {
  scale.value = Math.max(scale.value - 0.2, 1)
}

function rotateImage() {
  rotation.value += 90
}

function resetZoom() {
  scale.value = 1
  position.value = { x: 0, y: 0 }
  rotation.value = 0
}

// =========================
// wheel zoom
// =========================
function onWheelZoom(e) {
  const factor = 0.1
  if (e.deltaY < 0) zoomIn()
  else zoomOut()
}

// =========================
// drag
// =========================
function startDragging(e) {
  dragging.value = true
  dragStart.value = {
    x: e.type.includes('touch') ? e.touches[0].pageX : e.pageX,
    y: e.type.includes('touch') ? e.touches[0].pageY : e.pageY
  }
  lastPosition.value = { ...position.value }
}

function onDrag(e) {
  if (!dragging.value) return

  const x = e.type.includes('touch') ? e.touches[0].pageX : e.pageX
  const y = e.type.includes('touch') ? e.touches[0].pageY : e.pageY

  position.value = {
    x: lastPosition.value.x + (x - dragStart.value.x),
    y: lastPosition.value.y + (y - dragStart.value.y)
  }
}

function stopDragging() {
  dragging.value = false
}

// =========================
// swipe
// =========================
function handleSwipeStart(e) {
  touchStartX.value = e.changedTouches[0].screenX
}

function handleSwipeEnd(e) {
  const diff = e.changedTouches[0].screenX - touchStartX.value
  if (diff > 50) anterior()
  if (diff < -50) siguiente()
}

// =========================
// style
// =========================
const imageStyle = computed(() => ({
  transform: `translate(${position.value.x}px, ${position.value.y}px) scale(${scale.value}) rotate(${rotation.value}deg)`,
  transition: dragging.value ? 'none' : 'transform 0.3s ease',
  cursor: dragging.value ? 'grabbing' : 'grab'
}))

defineExpose({ abrir })
</script>

<style scoped>
.image-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
  touch-action: none;
}
</style>
