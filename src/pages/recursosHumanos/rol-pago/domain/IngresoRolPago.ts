import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class IngresoRolPago extends EntidadAuditable {
  id: number | null
  empleado: number | null
  empleado_info: number | null
  concepto: number | null
  concepto_info : string | null
  id_empleado: number | null
  monto: number | null
  id_rol_pago: number | null

  constructor() {
    super()
    this.id = null
    this.monto = null
    this.empleado = null
    this.empleado_info = null
    this.concepto = null
    this.concepto_info=null
    this.id_empleado = null
    this.id_rol_pago = null
  }
}
