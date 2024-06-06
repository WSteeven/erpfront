import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class TipoFactorRiesgo extends EntidadAuditable {
  nombre: string | null

  constructor() {
    super()
    this.nombre = null
  }
}
