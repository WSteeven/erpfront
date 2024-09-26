import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class AptitudMedica extends EntidadAuditable {
  tipo_aptitud_id: number | null
  observacion: string | null
  limitacion: string | null

  constructor() {
    super()
    this.tipo_aptitud_id = null
    this.observacion = null
    this.limitacion = null
  }
}
