<template>
  <l-map
    ref="mapRef"
    :zoom="zoom"
    :center="center"
    style="height: 400px; width: 100%"
  >
    <!--      style="height: 100%; width: 100%"-->
    <l-tile-layer
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      attribution="&copy; OpenStreetMap contributors"
    />

    <!-- Si es una lista de puntos -->
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
import { computed, onMounted, watch, ref } from 'vue'
import { LMap, LTileLayer, LMarker, LPopup } from '@vue-leaflet/vue-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import iconUrl from 'leaflet/dist/images/marker-icon.png'
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png'
import shadowUrl from 'leaflet/dist/images/marker-shadow.png'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({ iconRetinaUrl, iconUrl, shadowUrl })

const props = defineProps({
  puntos: {
    type: Array,
    default: () => []
  },
  zoom: {
    type: Number,
    default: 15
  },
  autoFit: {
    type: Boolean,
    default: true
  }
})

const mapRef = ref()

// Normalizar (acepta un solo punto o varios)
const puntosNormalizados = computed(() => {
  return Array.isArray(props.puntos) ? props.puntos : [props.puntos]
})

// Centro inicial (primer punto o un default)
const center = computed(() => {
  if (puntosNormalizados.value.length === 0) return [0, 0]
  return [puntosNormalizados.value[0].lat, puntosNormalizados.value[0].lng]
})

/*onMounted(() => {
  if (puntosNormalizados.value.length) {
    center.value = [
      puntosNormalizados.value[0].lat,
      puntosNormalizados.value[0].lng
    ]
  }

  // Si se quiere ajustar el mapa a todos los puntos
  if (props.autoFit && mapRef.value && puntosNormalizados.value.length > 1) {
    const bounds = puntosNormalizados.value.map(p => [p.lat, p.lng])
    mapRef.value.leafletObject.fitBounds(bounds, { padding: [20, 20] })
  }
})*/

// 🗺️ Si hay varios puntos → ajustar mapa automáticamente
watch(
    () => puntosNormalizados.value,
    (val) => {
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
