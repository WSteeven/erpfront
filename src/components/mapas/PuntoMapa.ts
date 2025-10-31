import L from 'leaflet'
export interface PuntoMapa{
    lat: number
    lng: number
    titulo: string
    descripcion?: string
    color?: string
    icono?: L.Icon |L.DivIcon
    id?:number|string
    meta?:any
}