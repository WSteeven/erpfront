import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class RolPago extends EntidadAuditable {
  id: number | null
  mes: string | null
  empleado: number | null
  empleado_info: string | null
  salario: string | null
  sueldo: number | null
  dias: number | null
  concepto_ingreso: number | null
  descuento_ley_info: number | null
  concepto_ingreso_info: string | null
  descuento_general_info: string | null
  medio_tiempo:boolean|null
  multa_info: string | null
  descuento_general: number | null
  descuento_ley: number | null
  multa: number | null
  fondos_reserva: number | null
  prestamo_empresarial: number | null
  decimo_tercero: number |null
  decimo_cuarto: number| null
  total_ingreso: number | null
  total_egreso: number | null
  bonificacion: number | null
  bono_recurente: number | null
  ingreso: number | null
  egreso: number | null
  horas_extra_tipo: number | null
  horas_extra_subtipo: number | null
  total: number | null
  ingresos: any | null
  egresos: any | null
  roles: any | null
  dias_permiso_sin_recuperar: number | null
  estado: string | null
  tieneDocumento: boolean | null
  rol_pago_id : number | null
  anticipo: string | null
  iess: string | null
  es_quincena : boolean | null
porcentaje_anticipo: number | null
  constructor() {
    super()
    this.id = null
    this.mes = null
    this.empleado = null
    this.empleado_info = null
    this.salario = null
    this.sueldo = null
    this.dias = null
    this.concepto_ingreso = null
    this.concepto_ingreso_info = null
    this.descuento_ley_info = null
    this.descuento_general_info = null
    this.descuento_general = null
    this.multa_info = null
    this.decimo_tercero = null
    this.decimo_cuarto = null
    this.descuento_ley = null
    this.multa = null
    this.fondos_reserva = null
    this.prestamo_empresarial= null
    this.ingreso = null
    this.egreso = null
    this.total_ingreso = null
    this.total_egreso = null
    this.bonificacion = null
    this.bono_recurente = null
    this.horas_extra_tipo = null
    this.horas_extra_subtipo = null
    this.total = null
    this.ingresos = null
    this.egresos = null
    this.roles = null
    this.dias_permiso_sin_recuperar = null
    this.estado = null
    this.tieneDocumento = false
    this.rol_pago_id = null
    this.anticipo = null
    this.iess = null
    this.es_quincena = false
    this.medio_tiempo = false
    this.porcentaje_anticipo = null
  }
}
