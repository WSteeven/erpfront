import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
import { AntecedenteGinecoObstetrico } from './AntecedenteGinecoObstetrico'

export class FichaPeriodicaPreocupacional extends EntidadAuditable {
  religion: number | null
  orientacion_sexual: number | null
  identidad_genero: number | null
  lateralidad: string | null
  motivo_consulta: string | null
  antecedente_gineco_obstetrico: AntecedenteGinecoObstetrico

  constructor() {
    super()
    this.religion = null
    this.orientacion_sexual = null
    this.identidad_genero = null
    this.lateralidad = null
    this.motivo_consulta = null
    this.antecedente_gineco_obstetrico = new AntecedenteGinecoObstetrico()
  }
}
