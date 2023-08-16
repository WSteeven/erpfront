import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class TicketRechazado extends EntidadAuditable {
  fecha_hora: string | null
  motivo: string | null
  responsable: string | null

  constructor() {
    super()
    this.fecha_hora = null
    this.motivo = null
    this.responsable = null
  }
}
