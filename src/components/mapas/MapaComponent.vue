<template>
  <l-map
    ref="mapRef"
    :zoom="zoom"
    :center="center"
    :style="{ height: height, width: width }"
  >
    <l-tile-layer
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      attribution="&copy; OpenStreetMap contributors"
    />

    <l-marker
      v-for="(punto, index) in puntosNormalizados"
      :key="index"
      :lat-lng="[punto.lat, punto.lng]"
    >
      <l-popup>
        <div class="text-body2">
          <strong>{{ punto.titulo || 'Punto ' + (index + 1) }}</strong
          ><br />
          <span v-if="punto.descripcion">{{ punto.descripcion }}</span>
        </div>
      </l-popup>
    </l-marker>
  </l-map>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { LMap, LMarker, LPopup, LTileLayer } from '@vue-leaflet/vue-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

import iconUrl from 'leaflet/dist/images/marker-icon.png'
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png'
import shadowUrl from 'leaflet/dist/images/marker-shadow.png'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({ iconRetinaUrl, iconUrl, shadowUrl })

const props = defineProps({
  puntos: { type: Array, default: () => [] },
  zoom: { type: Number, default: 15 },
  autoFit: { type: Boolean, default: true },
  height: { type: String, default: '300px' },
  width: { type: String, default: '100%' }
})

const mapRef = ref()
let map
const messageShown = ref(false)

const puntosNormalizados = computed(() =>
  Array.isArray(props.puntos) ? props.puntos : [props.puntos]
)

const center = computed(() => {
  if (puntosNormalizados.value.length === 0) return [0, 0]
  return [puntosNormalizados.value[0].lat, puntosNormalizados.value[0].lng]
})

// Desactivar zoom con la rueda a menos que se presione Ctrl
const handleWheel = e => {
  // Si se mantiene presionado Ctrl → permitir zoom solo en el mapa, no en la página
  if (e.ctrlKey) {
    e.stopPropagation()
    e.preventDefault() // Evita el zoom global del navegador
    map.scrollWheelZoom.enable()
    return
  }

  // Si NO se presiona Ctrl → bloquear el zoom y mostrar mensaje
  e.preventDefault()
  if (!messageShown.value) {
    alert('Mantén presionada la tecla Ctrl + rueda del ratón para hacer zoom.')
    messageShown.value = true
    setTimeout(() => (messageShown.value = false), 1000)
  }
  map.scrollWheelZoom.disable()
}


onMounted(() => {
  // console.log('MapaComponent montado', mapRef.value)
  // Esperar 1 segundo antes de bloquear el zoom con la rueda
  setTimeout(() => {
    map = mapRef.value?.leafletObject
    if (map) {
      map.scrollWheelZoom.disable()
      // console.log('Zoom con rueda deshabilitado después de 1s')
      map
        .getContainer()
        .addEventListener('wheel', handleWheel, { passive: false })
    // } else {
    //   console.warn('No se encontró el objeto del mapa')
    }
  }, 1000)

})

onBeforeUnmount(() => {
  const map = mapRef.value?.leafletObject
  if (map) {
    map.getContainer().removeEventListener('wheel', handleWheel)
  }
})

// Ajustar el mapa a los puntos
watch(
  () => puntosNormalizados.value,
  val => {
    const map = mapRef.value?.leafletObject
    if (map && val.length > 1) {
      const bounds = L.latLngBounds(val.map(p => [p.lat, p.lng]))
      map.fitBounds(bounds, { padding: [30, 30] })
    } else if (map && val.length === 1) {
      map.setView([val[0].lat, val[0].lng], props.zoom)
    }
  },
  { immediate: true }
)
</script>

<style scoped>
.l-map {
  border-radius: 8px;
  overflow: hidden;
}
</style>
