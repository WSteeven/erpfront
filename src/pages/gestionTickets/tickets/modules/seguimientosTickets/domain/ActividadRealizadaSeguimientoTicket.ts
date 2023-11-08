import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export default class ActividadRealizadaSeguimientoTicket extends EntidadAuditable {
  fecha_hora: string | null
  actividad_realizada: string | null
  observacion: string | null
  fotografia: string | null
  ticket: number | null
  responsable: number | null

  constructor() {
    super()
    this.fecha_hora = null
    this.actividad_realizada = null
    this.observacion = null
    this.fotografia = null
    this.ticket = null
    this.responsable = null
  }
}
