import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class RegistroTendido extends EntidadAuditable {
  tipo_elemento: string | null
  propietario_elemento: string | null
  numero_elemento: string | null
  codigo_elemento: string | null
  progresiva_entrada: string | null
  progresiva_salida: string | null
  // Coordenadas del elemento
  coordenada_del_elemento_latitud: string | null
  coordenada_del_elemento_longitud: string | null
  // Coordenadas del cruce americano
  coordenada_cruce_americano_longitud: string | null
  coordenada_cruce_americano_latitud: string | null
  // Coordenadas del poste de anclaje 1
  coordenada_poste_anclaje1_longitud: string | null
  coordenada_poste_anclaje1_latitud: string | null
  // Coordenadas del poste de anclaje 2
  coordenada_poste_anclaje2_longitud: string | null
  coordenada_poste_anclaje2_latitud: string | null

  estado_elemento: string | null
  tiene_transformador: boolean
  cantidad_transformadores: number | null
  tiene_americano: boolean
  tiene_retenidas: boolean
  cantidad_retenidas: number | null
  instalo_manga: boolean
  instalo_reserva: boolean
  cantidad_reserva: number | null
  observaciones: string | null
  fecha: string | null
  hora: string | null
  imagen: string | null
  materiales_ocupados: any[]
  tension: string | null

  constructor() {
    super()
    this.tipo_elemento = null
    this.propietario_elemento = null
    this.numero_elemento = null
    this.codigo_elemento = null
    this.progresiva_entrada = null
    this.progresiva_salida = null
    this.coordenada_del_elemento_latitud = null
    this.coordenada_del_elemento_longitud = null
    this.coordenada_cruce_americano_longitud = null
    this.coordenada_cruce_americano_latitud = null
    this.coordenada_poste_anclaje1_longitud = null
    this.coordenada_poste_anclaje1_latitud = null
    this.coordenada_poste_anclaje2_longitud = null
    this.coordenada_poste_anclaje2_latitud = null
    this.estado_elemento = null
    this.tiene_transformador = false
    this.cantidad_transformadores = null
    this.tiene_americano = false
    this.tiene_retenidas = false
    this.cantidad_retenidas = null
    this.instalo_manga = false
    this.instalo_reserva = false
    this.cantidad_reserva = null
    this.observaciones = null
    this.fecha = null
    this.hora = null
    this.imagen = null
    this.materiales_ocupados = []
    this.tension = null
  }
}
