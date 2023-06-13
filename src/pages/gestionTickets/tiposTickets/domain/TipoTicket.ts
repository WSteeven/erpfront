import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class TipoTicket extends EntidadAuditable {
  nombre: string | null
  activo: boolean

  constructor() {
    super()
    this.nombre = null
    this.activo = true
  }
}
