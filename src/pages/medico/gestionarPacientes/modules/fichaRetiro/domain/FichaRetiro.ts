import { FichaMedica } from '../../seccionesFichas/domain/FichaMedica'

export class FichaRetiro extends FichaMedica {
  se_hizo_evaluacion_retiro: boolean
  observaciones_evaluacion_retiro: string | null

  constructor() {
    super()
    this.se_hizo_evaluacion_retiro = false
    this.observaciones_evaluacion_retiro = null
  }
}
