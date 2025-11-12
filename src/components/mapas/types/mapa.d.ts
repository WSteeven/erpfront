import L from 'leaflet'
import { Tarea as TareaConecel } from 'src/pages/conecel/GestionTareas/tareas/domain/Tarea'

export interface PuntoMapa {
  lat: number
  lng: number
  titulo?: string
  descripcion?: string
  color?: string
  icono?: L.Icon | L.DivIcon | string
  id?: number | string
  estado?: string
  meta?: any
}



export interface Coordenadas {
    lat: number
    lng: number
}

export interface Vehiculo {
    placa: string
    coordenadas: Coordenadas
}

export interface Tarea extends TareaConecel{
    id: number
    titulo: string
    coordenadas: Coordenadas
    color?: string
}

export interface GrupoRuta {
    id: number
    nombre: string
    color: string
    vehiculo: Vehiculo
    tareas: Tarea[]
}


