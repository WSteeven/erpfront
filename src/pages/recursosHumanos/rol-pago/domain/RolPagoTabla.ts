import { EntidadAuditable } from "shared/entidad/domain/entidadAuditable";

export class RolPagoTabla extends EntidadAuditable {
  empleado: number | null
  empleado_info: string | null
    dias: number | null
   alimentacion: number | null
  horas_extras: number | null
  comision: number | null

  constructor() {
    super()
    this.empleado = null
    this.empleado_info = null
    this.dias = null
    this.alimentacion = null
    this.alimentacion = null
    this.horas_extras = null
    this.comision = null
  }
}
