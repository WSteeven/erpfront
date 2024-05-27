import { FichaMedica } from '../../seccionesFichas/domain/FichaMedica'

export class FichaReintegro extends FichaMedica {
  fecha_ultimo_dia_laboral: string | null
  fecha_reingreso: string | null
  causa_salida: string | null

  constructor() {
    super()
    this.fecha_ultimo_dia_laboral = null
    this.fecha_reingreso = null
    this.causa_salida = null
  }
}
