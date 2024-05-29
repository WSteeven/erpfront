import { FichaMedica } from '../../seccionesFichas/domain/FichaMedica'

export class FichaRetiro extends FichaMedica {
  fecha_inicio_labores: string | null
  fecha_salida: string | null
  antecedentes_clinicos_quirurgicos: string | null
  se_realizo_evaluacion_medica_retiro: boolean
  observacion_evaluacion_medica_retiro: string | null

  constructor() {
    super()
    this.fecha_inicio_labores = null
    this.fecha_salida = null
    this.antecedentes_clinicos_quirurgicos = null
    this.se_realizo_evaluacion_medica_retiro = true
    this.observacion_evaluacion_medica_retiro = null
  }
}
