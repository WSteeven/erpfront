import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
import { PuntoMapa } from 'components/mapas/types/mapa'

export class PosicionHunter extends EntidadAuditable {
  source: string | null
  imei: number | null
  placa: string | null
  lat: number | null
  lng: number | null
  velocidad: number | null
  rumbo: number | null
  alt: string | null
  fecha: string | null
  encendido: boolean
  direccion: string | null
  tipo_reporte: string | null
  estado: string | null
  flags_binarios: any | null
  flags: any | null
  received_at: string | null
  coordenadas: PuntoMapa|null

  constructor() {
    super()
    this.coordenadas = null
  }
}