import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class DetalleCategFactorRiesgoFrPuestoTrabAct extends EntidadAuditable {
  categoria_factor_riesgo: number | null
  fr_puesto_trabajo_actual: number | null

  constructor() {
    super()
    this.categoria_factor_riesgo = null
    this.fr_puesto_trabajo_actual = null
  }
}
