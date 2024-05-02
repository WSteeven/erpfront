import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
import { ConstanteVital } from '../../fichaPeriodicaPreocupacional/domain/ConstanteVital'
import { DescripcionAntecedenteTrabajo } from '../../fichaPeriodicaPreocupacional/domain/DescripcionAntecedenteTrabajo'
import { ExamenFisicoRegional } from '../../fichaPeriodicaPreocupacional/domain/ExamenFisicoRegional'

export class FichaMedica extends EntidadAuditable {
  accidente_trabajo: DescripcionAntecedenteTrabajo
  enfermedad_profesional: DescripcionAntecedenteTrabajo
  constante_vital: ConstanteVital
  examenes_fisicos_regionales: ExamenFisicoRegional[]

  constructor() {
    super()
    this.accidente_trabajo = new DescripcionAntecedenteTrabajo()
    this.enfermedad_profesional = new DescripcionAntecedenteTrabajo()
    this.constante_vital = new ConstanteVital()
    this.examenes_fisicos_regionales = []
  }
}
