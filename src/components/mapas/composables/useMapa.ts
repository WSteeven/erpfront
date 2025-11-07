//│   └── useMapa.ts           ← Lógica central del mapa

// composables/useMapa.ts
import {ref} from 'vue'
import L from 'leaflet'
import 'leaflet-routing-machine'
import {PuntoMapa} from 'components/mapas/types/mapa';

export function useMapa() {
    const routingControls = ref<L.Routing.Control[]>([])
    const marcadores = ref<Map<string, L.Marker>>(new Map())   // <-- REUTILIZABLE

    const limpiarMapa = (map: L.Map) => {
        routingControls.value.forEach(c => map.removeControl(c))
        marcadores.value.forEach(m => m.remove())
        routingControls.value = []
        marcadores.value.clear()
    }

    const actualizarMarcador = (map: L.Map, id: string, punto: PuntoMapa, html: string, popup?: string) => {
        const existing = marcadores.value.get(id)
        const latLng = L.latLng(Number(punto.lat), Number(punto.lng))

        if (existing) {
            existing.setLatLng(latLng)
            existing.setIcon(crearIcono(html))
            if (popup) existing.setPopupContent(popup)
        } else {
            const marker = L.marker(latLng, { icon: crearIcono(html) })
            if (popup) marker.bindPopup(popup)
            marker.addTo(map)
            marcadores.value.set(id, marker)
        }
    }
    /**
     * Crea un icono personalizado con HTML (para L.divIcon)
     * @param html - HTML del icono (i, div, svg, etc.)
     * @param size - [ancho, alto] en píxeles
     * @param anchor - [x, y] punto de anclaje (centro inferior por defecto)
     * @returns L.DivIcon
     */
    const crearIcono = (
        html: string,
        size: [number, number] = [30, 30],
        anchor: [number, number] = [size[0] / 2, size[1]]
    ): L.DivIcon => {
        return L.divIcon({
            html,
            iconSize: size,
            iconAnchor: anchor,
            popupAnchor: [0, -size[1]], // popup arriba del icono
            className: 'custom-div-icon', // evita estilos por defecto de Leaflet
        })
    }
    const dibujarRuta = (map: L.Map, waypoints: L.LatLng[], color: string) => {
        // Limpia rutas previas del mismo grupo (opcional)
        routingControls.value.forEach(ctrl => map.removeControl(ctrl))
        routingControls.value = []

        const control = L.Routing.control({
            waypoints,
            lineOptions: { styles: [{ color, weight: 5, opacity: 0.8 }] },
            router: L.Routing.osrmv1({
                serviceUrl: 'https://routing.openstreetmap.de/routed-car/route/v1'   // <-- SIN BLOQUEO
            }),
            addWaypoints: false,
            draggableWaypoints: false,
            fitSelectedRoutes: false,
            show: false,
            createMarker: () => null
        }).addTo(map)

        routingControls.value.push(control)
        return control
    }

    const dibujarMarcador = (map: L.Map,id:string,  punto: PuntoMapa, iconHtml: string, popup?: string) => {
        const icon = L.divIcon({
            html: iconHtml,
            iconSize: [30, 30],
            className: 'custom-div-icon',
            iconAnchor: [15, 30]
        })

        const marker = L.marker([punto.lat, punto.lng], { icon })
        if (popup) marker.bindPopup(popup)
        marker.addTo(map)
        marcadores.value.set(id, marker)
        return marker
    }

    const ajustarVista = (map: L.Map, puntos: PuntoMapa[]) => {
        if (puntos.length === 0) return
        const bounds = L.latLngBounds(puntos.map(p => [p.lat, p.lng]))
        map.fitBounds(bounds, { padding: [50, 50] })
    }

    return {
        limpiarMapa,actualizarMarcador,
        dibujarRuta,
        dibujarMarcador,
        ajustarVista,
        routingControls,
        marcadores
    }
}