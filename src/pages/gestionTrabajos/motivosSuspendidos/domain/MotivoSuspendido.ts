import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class MotivoSuspendido extends EntidadAuditable {
  motivo: string | null
  activo: boolean

  constructor() {
    super()
    this.motivo = null
    this.activo = true
  }
}
