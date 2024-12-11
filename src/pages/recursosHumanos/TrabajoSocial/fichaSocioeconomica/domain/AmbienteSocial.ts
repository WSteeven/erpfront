import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class AmbienteSocial extends EntidadAuditable {
  problemas: any
  observaciones: string | null

  constructor() {
    super()
    this.problemas = []
    this.observaciones = null
  }
}
