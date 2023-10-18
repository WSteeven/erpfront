import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
export class ValorAcreditar extends EntidadAuditable {
  empleado: number | null
  empleado_info: string | null
  acreditacion_semana: number  | null
  acreditacion_semana_info: string | null
  monto_generado: number | null
  monto_modificado: number | null

  constructor() {
    super()
    this.empleado = null
    this.empleado_info = null
    this.acreditacion_semana = null
    this.acreditacion_semana_info = null
    this.monto_generado = null
    this.monto_modificado = null

  }
}
