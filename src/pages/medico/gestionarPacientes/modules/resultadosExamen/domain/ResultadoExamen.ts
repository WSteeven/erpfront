import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class ResultadoExamen extends EntidadAuditable {
  resultado: number | null
  configuracion_examen_campo: number | null
  examen_solicitado: number | null
  observaciones: string | null

  constructor() {
    super()
    this.resultado = null
    this.configuracion_examen_campo = null
    this.examen_solicitado = null
    this.observaciones = null
  }
}
