import L from 'leaflet'
import {PosicionHunter} from 'pages/conecel/GestionTareas/cuadrillaTarea/domain/PosicionHunter';
export interface PuntoMapa{
    lat: number
    lng: number
    titulo?: string
    descripcion?: string
    color?: string
    icono?: L.Icon |L.DivIcon|string
    id?:number|string
    estado?:string
    meta?:any
}

export interface GrupoMapa {
    id: number
    nombre_alternativo: string
    activo: boolean
    color: string
    vehiculo?: PosicionHunter
    tareas: Tarea[]
}

export interface RutaMapa {
    nombre: string
    color: string
    puntos: PuntoMapa[]
    tipo: 'ruta' | 'vehiculo-a-tarea' | 'tareas-finalizadas'
}

export interface Coordenadas {
    lat: number
    lng: number
}

export interface Vehiculo {
    placa: string
    coordenadas: Coordenadas
}

export interface Tarea {
    id: number
    titulo: string
    coordenadas: Coordenadas
}

export interface GrupoRuta {
    id: number
    nombre: string
    color: string
    vehiculo: Vehiculo
    tareas: Tarea[]
}


