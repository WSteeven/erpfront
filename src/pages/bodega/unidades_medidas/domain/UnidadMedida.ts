import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class UnidadMedida extends EntidadAuditable {
  nombre: string | null
  simbolo: string | null

  constructor() {
    super()
    this.nombre = null
    this.simbolo = null
  }
}
