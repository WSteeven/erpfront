import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class ResultadoHabitoToxico extends EntidadAuditable {
  tiempo_consumo_meses: number | null
  tiempo_abstinencia_meses: number | null
  ficha_preocupacional: number | null
  tipo_habito_toxico: number | string | null
  tipo_habito_toxico_id: number | null
  consume:boolean
  ex_consumidor: boolean
  cantidad: number | null

  constructor() {
    super()
    this.tiempo_consumo_meses = null
    this.cantidad = null
    this.consume = false
    this.ex_consumidor = false
    this.tipo_habito_toxico = null
    this.tipo_habito_toxico_id = null
    this.tiempo_abstinencia_meses = null
    this.ficha_preocupacional = null
  }
}
