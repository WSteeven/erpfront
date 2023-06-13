import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class TipoTicket extends EntidadAuditable {
  nombre: string | null
  activo: boolean
  categoria_tipo_ticket: number | null

  constructor() {
    super()
    this.nombre = null
    this.activo = true
    this.categoria_tipo_ticket = null
  }
}
