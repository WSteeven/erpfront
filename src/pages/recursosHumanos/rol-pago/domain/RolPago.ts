import { EntidadAuditable } from "shared/entidad/domain/entidadAuditable";

export class RolPago extends EntidadAuditable {
  id: number | null
  empleado: number| null
  empleado_info: string | null
  salario: string | null
  dias: number | null
  sueldo: number | null
  decimo_tercero: number | null
  decimo_cuarto: number |null
  fondos_reserva: number | null
  alimentacion: number | null
  horas_extras: number | null
  total_ingreso: number | null
  comisiones: number | null
  iess: number | null
  anticipo: number |null
  prestamo_quirorafario: number |null
  prestamo_hipotecario: number |null
  extension_conyugal: number |null
  prestamo_empresarial: number |null
  sancion_pecuniaria: number |null
  total_egreso: number |null
  constructor() {
    super()
    this.id = null
    this.empleado = null
    this.empleado_info = null
    this.salario = null
    this.dias = 30
    this.sueldo = null
    this.decimo_tercero = null
    this.decimo_cuarto = null
    this.alimentacion = null
    this.fondos_reserva = null
    this.alimentacion = null
    this.horas_extras = null
    this.total_ingreso = null
    this.comisiones = null
    this.iess = null
    this.anticipo = null
    this.prestamo_quirorafario = null
    this.prestamo_hipotecario = null
    this.extension_conyugal = null
    this.prestamo_empresarial = null
    this.sancion_pecuniaria = null
    this.total_egreso = null
  }
}
