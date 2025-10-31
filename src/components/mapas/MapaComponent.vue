<template>
  <div>
    <div v-if="center && center[0] && center[1]">
      <l-map
        ref="mapRef"
        :zoom="zoom"
        :center="center"
        :style="{ height, width }"
      >
        <l-tile-layer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        <l-marker
          v-for="(punto, index) in puntosNormalizados"
          :key="index"
          :lat-lng="[punto.lat, punto.lng]"
          :icon="getIcon(punto)"
          @click="emitirSeleccion(punto)"
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
    </div>
    <div v-else>
      <callout-component
        mensaje="Coordenadas no disponibles para mostrar el mapa"
        tipo="warning"
      />
    </div>
  </div>
</template>

<script setup>
import {
  ref,
  computed,
  watch,
  onMounted,
  onBeforeUnmount,
  onBeforeMount
} from 'vue'
import { LMap, LMarker, LPopup, LTileLayer } from '@vue-leaflet/vue-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

import iconUrl from 'leaflet/dist/images/marker-icon.png'
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png'
import shadowUrl from 'leaflet/dist/images/marker-shadow.png'
import CalloutComponent from 'components/CalloutComponent.vue'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({ iconRetinaUrl, iconUrl, shadowUrl })

const props = defineProps({
  puntos: { type: Array, default: () => [] },
  puntoSeleccionado: { type: [String, Number, Object], default: null },
  zoom: { type: Number, default: 15 },
  autoFit: { type: Boolean, default: true },
  height: { type: String, default: '300px' },
  width: { type: String, default: '100%' }
})
const emit = defineEmits(['punto-click', 'map-ready'])
/***************************************
 * ⚙️ VARIABLES REACTIVAS
 ***************************************/
const mapRef = ref()
let map
// let map: L.Map
const messageShown = ref(false)

/***************************************
 * 🔹 CÁLCULOS
 ***************************************/
const puntosNormalizados = computed(() =>
  Array.isArray(props.puntos) ? props.puntos : [props.puntos]
)

const center = computed(() => {
  if (puntosNormalizados.value.length === 0) return [0, 0]
  return [puntosNormalizados.value[0].lat, puntosNormalizados.value[0].lng]
})

/***************************************
 * 🎯 FUNCIONES
 ***************************************/
function getIcon(punto) {
  const isSelected =
    props.puntoSeleccionado &&
    (punto.id === props.puntoSeleccionado || punto === props.puntoSeleccionado)
  const color = isSelected ? punto.color || 'red' : punto.color || 'blue'

  return L.divIcon({
    className: 'custom-marker',
    html: `<i class="bi bi-geo-alt-fill" style="font-size: 24px; color: ${color};"></i>`,
    iconSize: [24, 24],
    iconAnchor: [12, 24]
  })
}

function emitirSeleccion(punto) {
  emit('punto-click', punto)
}

function centrarPunto(punto) {
  if (!map) return
  map.setView([punto.lat, punto.lng], 17, { animate: true })
}

/***************************************
 * 🧭 ZOOM CON CTRL
 ***************************************/
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

/***************************************
 * 🔄 CICLOS DE VIDA
 ***************************************/

onMounted(() => {
  // Esperar 1 segundo antes de bloquear el zoom con la rueda
  setTimeout(() => {
    // console.log('Despues de inicializado', mapRef.value?.leafletObject)
    map = mapRef.value?.leafletObject
    if (!map) return

    emit('map-ready', map)
    if (props.autoFit && props.puntos.length > 1) {
      const bounds = L.latLngBounds(props.puntos.map(p => [p.lat, p.lng]))
      map.fitBounds(bounds, { padding: [30, 30] })
    }
    if (map) {
      map.scrollWheelZoom.disable()
      map
        .getContainer()
        .addEventListener('wheel', handleWheel, { passive: false })
    }
  }, 1000)
})

onBeforeUnmount(() => {
  if (map) {
    map.getContainer().removeEventListener('wheel', handleWheel)
  }
})

/***************************************
 * 👀 WATCHERS
 ***************************************/
// Ajustar el mapa a los puntos
watch(
  () => props.puntos,
  val => {
    if (map && props.autoFit && val.length > 1) {
      const bounds = L.latLngBounds(val.map(p => [p.lat, p.lng]))
      map.fitBounds(bounds, { padding: [30, 30] })
    } else if (map && val.length === 1) {
      map.setView([val[0].lat, val[0].lng], props.zoom)
    }
  },
  { deep: true, immediate: true }
)

watch(
  () => props.puntoSeleccionado,
  nuevo => {
    if (!nuevo || !map) return
    const punto = puntosNormalizados.value.find(
      p => p.id === nuevo || p === nuevo
    )
    if (punto) centrarPunto(punto)
  }
)

defineExpose({ centrarPunto })
</script>

<style scoped>
.l-map {
  border-radius: 8px;
  overflow: hidden;
}

.custom-marker i {
  text-shadow: 0 0 2px white;
}
</style>
