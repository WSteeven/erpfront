import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
import { ConstanteVital } from '../../fichaPeriodicaPreocupacional/domain/ConstanteVital'
import { DescripcionAntecedenteTrabajo } from '../../fichaPeriodicaPreocupacional/domain/DescripcionAntecedenteTrabajo'

export class FichaMedica extends EntidadAuditable {
  accidente_trabajo: DescripcionAntecedenteTrabajo
  enfermedad_profesional: DescripcionAntecedenteTrabajo
  constante_vital: ConstanteVital

  constructor() {
    super()
    this.accidente_trabajo = new DescripcionAntecedenteTrabajo()
    this.enfermedad_profesional = new DescripcionAntecedenteTrabajo()
    this.constante_vital = new ConstanteVital()
  }
}
