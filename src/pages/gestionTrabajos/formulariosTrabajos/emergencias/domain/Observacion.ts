import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export default class Observacion extends EntidadAuditable {
  observacion: string | null

  constructor() {
    super()
    this.observacion = null
  }
}
