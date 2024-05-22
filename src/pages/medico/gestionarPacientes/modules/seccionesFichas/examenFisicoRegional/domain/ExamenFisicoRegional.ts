import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class ExamenFisicoRegional extends EntidadAuditable {
  categoria_examen_fisico_id: number | null
  observacion: string | null

  constructor() {
    super()
    this.categoria_examen_fisico_id = null
    this.observacion = null
  }
}
