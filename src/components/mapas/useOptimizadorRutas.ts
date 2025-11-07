// src/components/mapas/useOptimizadorRutas.ts
import L from 'leaflet'
import type { GrupoRuta, Tarea } from './types/mapa'

export function useOptimizadorRutas() {
  const calcularDistancia = (a: L.LatLng, b: L.LatLng) => a.distanceTo(b)

  // src/components/mapas/useOptimizadorRutas.ts
  const optimizar = (
      grupos: GrupoRuta[],
      tareasLibres: Tarea[]
  ): { gruposOptimizados: GrupoRuta[], ahorroKm: number } => {
    const gruposMutables = grupos.map(g => ({ ...g, tareas: [...g.tareas] }))

    // === 1. ASIGNAR AL MÁS CERCANO ===
    tareasLibres.forEach(tarea => {
      let mejorGrupo = gruposMutables[0]
      let menorDist = Infinity

      gruposMutables.forEach(grupo => {
        if (!grupo.vehiculo) return
        const v = L.latLng(grupo.vehiculo.coordenadas.lat, grupo.vehiculo.coordenadas.lng)
        const t = L.latLng(tarea.coordenadas.lat, tarea.coordenadas.lng)
        const d = v.distanceTo(t)
        if (d < menorDist) {
          menorDist = d
          mejorGrupo = grupo
        }
      })
      mejorGrupo.tareas.push(tarea)
    })

    // === 2. MEJORAR CON INTERCAMBIOS (TODAS LAS TAREAS) ===
    let mejorado = true
    let iteraciones = 0
    const maxIter = 100

    while (mejorado && iteraciones < maxIter) {
      mejorado = false
      iteraciones++

      for (let i = 0; i < gruposMutables.length; i++) {
        for (let j = i + 1; j < gruposMutables.length; j++) {
          const g1 = gruposMutables[i]
          const g2 = gruposMutables[j]
          if (!g1.vehiculo || !g2.vehiculo) continue

          // Probar intercambiar CUALQUIER par de tareas
          for (let a = 0; a < g1.tareas.length; a++) {
            for (let b = 0; b < g2.tareas.length; b++) {
              const t1 = g1.tareas[a]
              const t2 = g2.tareas[b]

              const v1 = L.latLng(g1.vehiculo.coordenadas.lat, g1.vehiculo.coordenadas.lng)
              const v2 = L.latLng(g2.vehiculo.coordenadas.lat, g2.vehiculo.coordenadas.lng)

              const actual = v1.distanceTo(L.latLng(t1.coordenadas.lat, t1.coordenadas.lng)) +
                  v2.distanceTo(L.latLng(t2.coordenadas.lat, t2.coordenadas.lng))

              const nuevo = v1.distanceTo(L.latLng(t2.coordenadas.lat, t2.coordenadas.lng)) +
                  v2.distanceTo(L.latLng(t1.coordenadas.lat, t1.coordenadas.lng))

              if (nuevo < actual - 50) { // margen de 50m
                // INTERCAMBIAR
                ;[g1.tareas[a], g2.tareas[b]] = [t2, t1]
                mejorado = true
              }
            }
          }
        }
      }
    }
    const calcularKM = (grupos: GrupoRuta[]) => {
      let total = 0
      grupos.forEach(g => {
        if (!g.vehiculo || g.tareas.length === 0) return
        const v = L.latLng(
            g.vehiculo.coordenadas.lat,
            g.vehiculo.coordenadas.lng
        )
        g.tareas.forEach(t => {
          const p = L.latLng(t.coordenadas.lat, t.coordenadas.lng)
          total += v.distanceTo(p) / 1000
        })
      })
      return total
    }

    // === CALCULAR AHORRO ===
    const kmAntes = calcularKM(grupos)
    const kmDespues = calcularKM(gruposMutables)
    const ahorro = kmAntes - kmDespues

    return {
      gruposOptimizados: gruposMutables,
      ahorroKm: ahorro / 1000
    }
  }
  return { optimizar }
}