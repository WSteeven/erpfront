import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
import { DetalleCategFactorRiesgoFrPuestoTrabAct } from './DetalleCategFactorRiesgoFrPuestoTrabAct'

export class FrPuestoTrabajoActual extends EntidadAuditable {
  puesto_trabajo: string | null
  actividad: string | null
  medidas_preventivas: string | null
  ficha_preocupacional: number | null
  detalle_categ_factor_riesgo_fr_puesto_trab_act: DetalleCategFactorRiesgoFrPuestoTrabAct[] | number[]

  constructor() {
    super()
    this.puesto_trabajo = null
    this.actividad = null
    this.medidas_preventivas = null
    this.detalle_categ_factor_riesgo_fr_puesto_trab_act = []
    this.ficha_preocupacional = null
  }
}
