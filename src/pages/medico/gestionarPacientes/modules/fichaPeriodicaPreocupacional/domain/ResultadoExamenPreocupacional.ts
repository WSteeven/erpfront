import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class ResultadoExamenPreocupacional extends EntidadAuditable {
  tiempo: string | null
  resultado: number | null
  tipo_antecedente: number | string | null
  ficha_preocupacional: number | null

  constructor() {
    super()
    this.tiempo = null
    this.resultado = null
    this.tipo_antecedente = null
    this.ficha_preocupacional = null
  }
}
