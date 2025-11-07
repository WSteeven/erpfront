<!-- src/components/mapas/MapaRutas.vue -->
<template>
  <div ref="mapContainer" :style="{ height, width }"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css'
import { useMapaRutas } from './useMapaRutas'
import type { Tarea, GrupoRuta } from './types/mapa'

const props = defineProps<{
  grupos: GrupoRuta[],
  tareasSinGrupo: Tarea[],
  height?: string
  width?: string
}>()

const mapContainer = ref<HTMLElement>()
let map: L.Map | null = null
const { renderizarGrupos } = useMapaRutas()

onMounted(() => {
  map = L.map(mapContainer.value!).setView([-2.17, -79.92], 12)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map!)
  renderizarGrupos(map!, props.grupos, props.tareasSinGrupo)
})

watch(() => props.grupos, (nuevos) => {
  if (map) renderizarGrupos(map, nuevos, props.tareasSinGrupo)
}, { deep: true })
</script>

<style>
.custom-icon { background: transparent; border: none; }
</style>