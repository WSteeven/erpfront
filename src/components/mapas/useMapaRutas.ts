// src/components/mapas/useMapaRutas.ts
import { ref } from 'vue'
import L from 'leaflet'
import 'leaflet-routing-machine'
import type { GrupoRuta, Tarea } from './types/mapa'

export function useMapaRutas(onCrearSubtarea?: (tareaId: any, grupoId: number, latLng: L.LatLng) => void) {
  const routingControls = ref<L.Routing.Control[]>([])
  const marcadores = ref<Map<string, L.Marker>>(new Map())
  const leyenda = ref<L.Control | null>(null) // Nueva referencia para la leyenda

  const limpiar = (map: L.Map) => {
    // Limpiar controles de rutas
    routingControls.value.forEach(c => map.removeControl(c))
    // Limpiar marcadores
    marcadores.value.forEach(m => m.remove())
    // Limpiar leyenda si existe
    if (leyenda.value) {
      map.removeControl(leyenda.value)
      leyenda.value = null
    }
    routingControls.value = []
    marcadores.value.clear()
  }

  const crearIcono = (html: string, size = 34) =>
    L.divIcon({
      html,
      iconSize: [size, size],
      iconAnchor: [size / 2, size],
      className: 'custom-icon'
    })

  const dibujarRutaPunteada = (
    map: L.Map,
    from: L.LatLng,
    to: L.LatLng,
    color: string
  ) => {
    const control = L.Routing.control({
      waypoints: [from, to],
      lineOptions: {
        styles: [{ color, weight: 5, opacity: 0.8, dashArray: '12, 12' }]
      },
      router: L.Routing.osrmv1({
        serviceUrl: 'https://routing.openstreetmap.de/routed-car/route/v1'
      }),
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: false,
      show: false,
      createMarker: () => null
    }).addTo(map)
    routingControls.value.push(control)
  }

  const dibujarRuta = (map: L.Map, waypoints: L.LatLng[], color: string) => {
    const control = L.Routing.control({
      waypoints,
      lineOptions: { styles: [{ color, weight: 6, opacity: 0.9 }] },
      router: L.Routing.osrmv1({
        serviceUrl: 'https://routing.openstreetmap.de/routed-car/route/v1'
      }),
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: false,
      show: false,
      createMarker: () => null
    }).addTo(map)
    routingControls.value.push(control)
  }

  const botonHtml = (tareaId:number, grupoId:number|null)=>`
    <div style="margin-top: 10px; text-align: right;">
      <button 
        class="btn-crear-subtarea" 
        data-tarea-id="${tareaId}"
        data-grupo-id="${grupoId??0}"
        style="
          background: #007bff; 
          color: white; 
          border: none; 
          padding: 6px 12px; 
          border-radius: 4px; 
          font-size: 12px; 
          cursor: pointer;
          box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        "
        onmouseover="this.style.background='#0056b3'"
        onmouseout="this.style.background='#007bff'"
      >
        Crear subtarea
      </button>
    </div>
  `

  const dibujarMarcador = (
    map: L.Map,
    id: string,
    punto: { lat: number; lng: number },
    iconHtml: string,
    popup: string,
    grupoId: number | null
  ) => {
    const latLng = L.latLng(punto.lat, punto.lng)
    const icon = crearIcono(iconHtml)
    let marker = marcadores.value.get(id)
    if (marker) {
      marker.setLatLng(latLng).setIcon(icon)
    } else {
      marker = L.marker(latLng, { icon }).bindPopup(popup).addTo(map)
      marcadores.value.set(id, marker)
    }
    // Escuchar clics en el botón
    marker.on('popupopen', () => {
      const btn = document.querySelector(
        `.btn-crear-subtarea[data-tarea-id="${id}"]`
      ) as HTMLElement
      if (btn) {
        btn.onclick = e => {
          e.stopPropagation()
          // Emitir evento global para que el componente padre lo capture
          if(onCrearSubtarea)
            onCrearSubtarea(id, grupoId, L.latLng(punto.lat, punto.lng))
          else {
            console.log('problemas cuando diste click')}
          // window.dispatchEvent(
          //   new CustomEvent('crear-subtarea', {
          //     detail: {
          //       tareaId: id,
          //       grupoId: grupoId,
          //       markerId: id,
          //       latLng: latLng
          //     }
          //   })
          // )
        }
      }
    })
  }

  const renderizarGrupos = (
    map: L.Map,
    grupos: GrupoRuta[],
    tareasSinAsignar: Tarea[]
  ) => {
    limpiar(map)

    // === DIBUJAR GRUPOS Y TAREAS ===
    grupos.forEach(grupo => {
      // Vehículo
      dibujarMarcador(
        map,
        `vehiculo-${grupo.id}`,
        grupo.vehiculo.coordenadas,
        `<i class="bi bi-car-front-fill" style="color:${grupo.color};font-size:36px;transform:rotate(45deg);"></i>`,
        `<b>${grupo.nombre}</b><br>Placa: ${grupo.vehiculo.placa}`,
        0
      )

      if (!grupo.tareas.length) return


      // Ruta entre tareas
      const waypoints = grupo.tareas.map(t =>
        L.latLng(t.coordenadas.lat, t.coordenadas.lng)
      )
      dibujarRuta(map, waypoints, grupo.color)

      // Tareas numeradas
      grupo.tareas.forEach((tarea, i) => {
        dibujarMarcador(
          map,
          `${tarea.id}`,
          tarea.coordenadas,
          `<div style="background:${
            tarea.color
          };color:black;width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:bold;font-size:10px;border:3px solid white;">${
            tarea.orden_trabajo ?? i + 1
          }</div>`,
          `<b>${grupo.nombre} - OT ${tarea.id}</b><br>${
            tarea.titulo
          }<br>${botonHtml(tarea.id, grupo.id)}`,
          grupo.id
        )
      })

      // Ruta punteada: vehículo → tarea más cercana
      if (grupo.vehiculo && grupo.tareas.length > 0) {
        const vehiculoLatLng = L.latLng(
          grupo.vehiculo.coordenadas.lat,
          grupo.vehiculo.coordenadas.lng
        )
        let tareaCercana = grupo.tareas[0]
        let menorDistancia = Infinity
        grupo.tareas.forEach(tarea => {
          const punto = L.latLng(tarea.coordenadas.lat, tarea.coordenadas.lng)
          const distancia = vehiculoLatLng.distanceTo(punto)
          if (distancia < menorDistancia) {
            menorDistancia = distancia
            tareaCercana = tarea
          }
        })
        const puntoCercano = L.latLng(
          tareaCercana.coordenadas.lat,
          tareaCercana.coordenadas.lng
        )
        dibujarRutaPunteada(map, vehiculoLatLng, puntoCercano, grupo.color)
      }
    })

    // === DIBUJAR TAREAS SIN ASIGNAR + SUGERENCIA ===
    tareasSinAsignar.forEach(tarea => {
      dibujarMarcador(
        map,
        `${tarea.id}`,
        tarea.coordenadas,
        `<div style="background:#6c757d;color:white;width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:bold;font-size:15px;border:3px solid white;"> ? </div>`,
        `<b>Tarea sin asignar</b><br>${tarea.titulo}<br>${botonHtml(tarea.id, 0)}`,
        0
      )

      let grupoCercano: GrupoRuta | null = null
      let menorDistancia = Infinity
      grupos.forEach(grupo => {
        if (!grupo.vehiculo) return
        const vehiculoPos = L.latLng(
          grupo.vehiculo.coordenadas.lat,
          grupo.vehiculo.coordenadas.lng
        )
        const tareaPos = L.latLng(tarea.coordenadas.lat, tarea.coordenadas.lng)
        const distancia = vehiculoPos.distanceTo(tareaPos)
        if (distancia < menorDistancia) {
          menorDistancia = distancia
          grupoCercano = grupo
        }
      })

      if (grupoCercano && grupoCercano.vehiculo) {
        const vehiculoPos = L.latLng(
          grupoCercano.vehiculo.coordenadas.lat,
          grupoCercano.vehiculo.coordenadas.lng
        )
        const tareaPos = L.latLng(tarea.coordenadas.lat, tarea.coordenadas.lng)
        dibujarRutaPunteada(map, vehiculoPos, tareaPos, grupoCercano.color)
        const marker = marcadores.value.get(`${tarea.id}`)
        if (marker) {
          marker.bindPopup(`
            <b>Tarea sin asignar</b><br>
            ${tarea.titulo}<br><br>
            <i style="color:${grupoCercano.color}">Sugerencia: ${
            grupoCercano.nombre
          }</i><br>
            <small>Distancia: ${(menorDistancia / 1000).toFixed(2)} km</small>
            <br>${botonHtml(
              tarea.id,
              0
          )}
          `)
        }
      }
    })

    map.setZoom(map.getZoom(), { animate: false }) // ← fuerza sin animación

    // === AJUSTAR VISTA ===
    /*const allPoints = grupos.flatMap(g => [
              g.vehiculo.coordenadas,
              ...g.tareas.map(t => t.coordenadas)
            ])
            if (allPoints.length) {
              const bounds = L.latLngBounds(allPoints.map(p => [p.lat, p.lng]))
              map.fitBounds(bounds, { padding: [50, 50] })
            }*/

    // === LEYENDA ===
    // Solo creamos la leyenda si no existe
    if (!leyenda.value) {
      leyenda.value = L.control({ position: 'bottomright' })
      leyenda.value.onAdd = () => {
        const div = L.DomUtil.create('div', 'mapa-leyenda')
        div.innerHTML = `
          <div style="background:white;padding:10px;border-radius:8px;box-shadow:0 2px 10px rgba(0,0,0,0.2);font-size:13px;">
            <b>Leyenda</b><br>
            <span style="color:#666">—— Ruta planificada</span><br>
            <span style="color:#666">---- Ruta sugerida</span><br>
            <span style="color:#6c757d">? Tarea sin grupo</span>
          </div>
        `
        return div
      }
      leyenda.value.addTo(map)
    }
  }

  return { renderizarGrupos }
}
