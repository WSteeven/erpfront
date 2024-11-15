import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class Subactividad extends EntidadAuditable {
  id: number | null
  nombre: string | null
  responsable: number | null
  fecha_inicio: string | null
  fecha_fin: string | null
  estado_avance: number | null
  periodicidad: string | null
  observaciones: string | null
  actividad_id: number | null

  constructor() {
    super()
    this.id = null
    this.nombre = null
    this.responsable = null
    this.fecha_inicio = null
    this.fecha_fin = null
    this.estado_avance = null
    this.periodicidad = null
    this.observaciones = null
    this.actividad_id = null
  }
}
