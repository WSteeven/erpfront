import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class ExamenFisicoRegional extends EntidadAuditable {
  categoria_examen_fisico_id: number | null
  categoria_examen_fisico?: string | null
  observacion: string | null
  region_cuerpo: string | null

  constructor() {
    super()
    this.observacion = null
    this.categoria_examen_fisico_id = null
    this.categoria_examen_fisico = null
    this.region_cuerpo = null
  }
}
