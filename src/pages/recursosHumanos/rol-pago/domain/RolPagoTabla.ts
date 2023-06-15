import { EntidadAuditable } from "shared/entidad/domain/entidadAuditable";

export class RolPagoTabla extends EntidadAuditable {
  empleado: number | null
  empleado_info: string | null
    dias: number | null
   alimentacion: number | null
  horas_extras: number | null
  comision: number | null
  bonificacion:   number | null
  extension_convenio_salud: number | null
  multas: number | null
  descuentos: number | null
  subcidio_iess: number | null


  constructor() {
    super()
    this.empleado = null
    this.empleado_info = null
    this.dias = null
    this.alimentacion = null
    this.alimentacion = null
    this.horas_extras = null
    this.comision = null
    this.bonificacion = null
    this.extension_convenio_salud = null
    this.multas = null
    this.descuentos = null
    this.subcidio_iess = null
  }
}
