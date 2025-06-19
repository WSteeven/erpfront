import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class TipoTicket extends EntidadAuditable {
  nombre: string | null
  activo: boolean
  categoria_tipo_ticket: number | null
  categoria_tipo_ticket_id: number | null
  departamento: number | null

  destinatario: number | string | null = null
  destinatario_id: number | null = null
  
  constructor() {
    super()
    this.nombre = null
    this.activo = true
    this.categoria_tipo_ticket = null
    this.categoria_tipo_ticket_id = null
    this.departamento = null
  }
}
