import { FichaMedica } from '../../seccionesFichas/domain/FichaMedica'

export class FichaRetiro extends FichaMedica {
  se_hizo_evaluacion_retiro: boolean
  observaciones_evaluacion_retiro: string | null
  examenes_fisicos_regionales: any[]
  observaciones_examen_fisico_regional: string | null

  constructor() {
    super()
    this.se_hizo_evaluacion_retiro = false
    this.observaciones_evaluacion_retiro = null
    this.examenes_fisicos_regionales = []
    this.observaciones_examen_fisico_regional = null
  }
}
