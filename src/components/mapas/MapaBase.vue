<!-- components/mapas/MapaBase.vue -->
<template>
  <div ref="mapContainer" :style="{ height, width }"></div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import L, { LatLng } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css'

const props = defineProps({
  height: { type: String, default: '500px' },
  width: { type: String, default: '100%' },
  center: {
    type: Array as () => LatLng<[number, number]>,
    default: () => [-2.17, -79.92]
  },
  zoom: { type: Number, default: 12 }
})

const emit = defineEmits(['map-ready'])

const mapContainer = ref<HTMLElement>()
let map: L.Map

onMounted(() => {
  map = L.map(mapContainer.value!).setView(props.center, props.zoom)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map)
  setTimeout(()=>
  emit('map-ready', map)
  ,1000)
})

onBeforeUnmount(() => {
  map?.remove()
})
</script>

<style>
.custom-div-icon {
  background: none;
  border: none;
}
</style>