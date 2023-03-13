import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class MotivoPausa extends EntidadAuditable {
  motivo: string | null
  activo: boolean

  constructor() {
    super()
    this.motivo = null
    this.activo = true
  }
}
