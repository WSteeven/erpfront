<!-- components/mapas/RutasDinamicas.vue -->
<template>
  <!-- Este componente recibe el mapa ya inicializado -->
</template>

<script setup lang="ts">
import { watch, ref } from 'vue'
import L from 'leaflet'
import { useMapa } from 'components/mapas/composables/useMapa';
import type { GrupoMapa, PuntoMapa } from 'components/mapas/types/mapa';

const props = defineProps<{
  map: L.Map
  grupos: GrupoMapa[]|undefined
}>()
let puntosParaAjustar: PuntoMapa[] = []
const { limpiarMapa, dibujarRuta, dibujarMarcador,actualizarMarcador, ajustarVista } = useMapa()
const todosPuntos = ref<PuntoMapa[]>([])

// src/components/mapas/RutasDinamicas.vue
watch(
    () => [props.map, props.grupos],
    ([map, grupos]) => {
      console.log('RutasDinamicas WATCH DISPARADO', { map: !!map, grupos: grupos?.length })
      if (!map || !Array.isArray(grupos)) return  // ← PROTEGE

      console.log('RutasDinamicas: map y grupos listos', { map, grupos }) // ← DEBUG

      limpiarMapa(map)
      todosPuntos.value = []

      grupos.forEach(grupo => {
        console.log('Procesando grupo:', grupo.nombre_alternativo, 'activo:', grupo.activo)
        console.log('Vehículo:', grupo.vehiculo?.coordenadas)
        console.log('Tareas pendientes:', grupo.tareas.filter(t => t.estado_tarea === 'PENDIENTE').length)

        if (!grupo.activo) return

        // === TAREAS PENDIENTES ===
        const tareasPendientes = grupo.tareas
            .filter(t => ['PENDIENTE', 'INICIADA'].includes(t.estado_tarea))
            .map(t => ({
              lat: Number(t.coordenadas.lat),
              lng: Number(t.coordenadas.lng),
              titulo: t.nombre,
              descripcion: t.estado,
              estado: t.estado_tarea,
              id: t.id
            }))
            .filter(p => !isNaN(p.lat) && !isNaN(p.lng))  // ← FILTRA COORDENADAS INVÁLIDAS

        if (tareasPendientes.length === 0) return

        // === MARCADOR VEHÍCULO ===
        if (grupo.vehiculo) {
          const v = grupo.vehiculo
          const lat = Number(v.coordenadas.lat)
          const lng = Number(v.coordenadas.lng)
          if (!isNaN(lat) && !isNaN(lng)) {
            dibujarMarcador(
                map,
                `vehiculo-${grupo.placa}`,
                { lat, lng, titulo: grupo.nombre_alternativo },
                `<i class="bi bi-truck" style="color: ${grupo.color}; font-size: 32px;"></i>`,
                `<b>${grupo.nombre_alternativo}</b>`
            )
          }
        }

        // === RUTA ENTRE TAREAS ===
        const waypoints = tareasPendientes.map(p => L.latLng(Number(p.lat), Number(p.lng)))
        dibujarRuta(map, waypoints, grupo.color || '#007bff')

        // === MARCADORES NUMERADOS ===
        tareasPendientes.forEach((p, i) => {
          const color = p.estado === 'PENDIENTE' ? '#ffc107' : '#17a2b8'
          actualizarMarcador(
              map,
              `tarea-${p.id}`,
              p,
              `<div style="background:${color};color:white;width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:bold;font-size:14px;border:3px solid white;">
            ${i + 1}
          </div>`,
              `<b>${p.titulo}</b><br>${p.descripcion}`
          )
        })

        puntosParaAjustar.push(...tareasPendientes)
      })

      ajustarVista(map, puntosParaAjustar)
    },
    { immediate: true }
)
</script>