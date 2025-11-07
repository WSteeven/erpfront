<template>
  <div id="map" style="height: 500px; width: 100%"></div>
</template>

<script setup>
import { onMounted, watch, ref } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet-routing-machine'
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css'

// 📦 Props: arreglo de rutas con puntos y color
const props = defineProps({
  rutas: {
    type: Array,
    default: () => []
  }
})

let map = null
const routingControls = ref([])

onMounted(() => {
  map = L.map('map').setView([-2.17, -79.92], 12)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map)

  dibujarRutas()
})

// 🔄 Redibujar rutas cuando cambie el array
watch(
  () => props.rutas,
  () => {
    dibujarRutas()
    console.log('objeto map:',map)
  },
  { deep: true }
)

// 🧩 Función principal
function dibujarRutas() {
  // 1️⃣ Limpiar rutas previas
  routingControls.value.forEach(ctrl => map?.removeControl(ctrl))
  routingControls.value = []

  const allPoints = []

  // 2️⃣ Iterar sobre cada ruta
  props.rutas.forEach(ruta => {
    console.log('ruta', ruta)
    if (
      !ruta?.puntos ||
      !Array.isArray(ruta?.puntos) ||
      ruta?.puntos.length === 0
    )
      return
    console.log('ruta valida', ruta)

    const puntos = ruta.puntos.map(p =>
      L.latLng(parseFloat(p.lat), parseFloat(p.lng))
    )
    console.log('puntos', puntos)
    allPoints.push(...puntos)

    // Si solo tiene un punto, mostramos un marcador
    if (puntos.length === 1) {
      L.marker(puntos[0], {
        icon: L.divIcon({
          html: `<i class="bi bi-geo-alt-fill" style="color:${
            ruta.color || '#007bff'
          };font-size:22px"></i>`,
          iconSize: [24, 24],
          className: ''
        })
      })
        .bindPopup(`<b>${ruta.nombre}</b>`)
        .addTo(map)
      return
    }

    // 3️⃣ Trazar la ruta usando OSRM (vehicular)
    const control = L.Routing.control({
      waypoints: puntos,
      lineOptions: {
        styles: [{ color: ruta.color || '#007bff', weight: 4, opacity: 0.8 }]
      },
      router: L.Routing.osrmv1({
        serviceUrl: 'https://router.project-osrm.org/route/v1'
      }),
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: false,
      show: false
    }).addTo(map)

    routingControls.value.push(control)
  })

  // 4️⃣ Ajustar el mapa para mostrar todo
  console.log(allPoints)
  if (allPoints.length > 0) {
    const bounds = L.latLngBounds(allPoints)
    map.fitBounds(bounds, { padding: [40, 40] })
  }
}
</script>

<style>
/* Opcional: estilos del marcador y ruta */
.leaflet-routing-container {
  display: none !important; /* oculta el panel lateral de Leaflet Routing Machine */
}
</style>
