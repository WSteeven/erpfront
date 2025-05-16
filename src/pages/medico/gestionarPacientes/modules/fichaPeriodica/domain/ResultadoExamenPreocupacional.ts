import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class ResultadoExamenPreocupacional extends EntidadAuditable {
  tiempo: string | null
  resultado: number | null
  // tipo_antecedente: number | string | null
  // tipo_antecedente_id: number | null
  examen_id: number | null
  examen: string | null
  ficha_preocupacional: number | null

  constructor() {
    super()
    this.tiempo = null
    this.resultado = null
    this.examen_id = null
    this.examen = null
    // this.tipo_antecedente = null
    // this.tipo_antecedente_id = null
    this.ficha_preocupacional = null
  }
}
