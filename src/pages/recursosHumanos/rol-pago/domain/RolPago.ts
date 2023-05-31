import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class RolPago extends EntidadAuditable {
  id: number | null
  mes: string | null
  empleado: number | null
  empleado_info: string | null
  salario: string | null
  dias: number | null
  concepto_ingreso: number | null
  concepto_egreso: number | null
  total_egreso: number | null
  bonificacion: number | null
  bono_recurente: number | null
  ingreso: number | null
  egreso: number | null
  total: number | null
  ingresos: any | null
  egresos: any | null
  roles: any | null
  constructor() {
    super()
    this.id = null
    this.mes = null
    this.empleado = null
    this.empleado_info = null
    this.salario = null
    this.dias = 30
    this.concepto_ingreso = null
    this.concepto_egreso = null
    this.ingreso = null
    this.egreso = null
    this.total_egreso = null
    this.bonificacion = null
    this.bono_recurente = null
    this.total = null
    this.ingresos  = null
    this.egresos = null
    this.roles = null
  }
}
