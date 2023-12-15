import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class EgresoRolPago extends EntidadAuditable {
  id: number | null
  empleado: number | null
  empleado_info: number | null
  tipo: string | null
  descuento: string | null
  id_descuento: number | null
  id_empleado: number | null
  monto: number | null
  id_rol_pago: number | null

  constructor() {
    super()
    this.id = null
    this.monto = null
    this.empleado = null
    this.empleado_info = null
    this.tipo = null
    this.descuento = null
    this.id_descuento = null
    this.id_empleado = null
    this.id_rol_pago = null
  }
}
