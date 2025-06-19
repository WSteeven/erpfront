import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class ValorCargadoRol extends EntidadAuditable {
  tipo: string | null
  mes: string | null
  empleado: string | null
  monto: string | null
  model_type: string | null
  model_id: string | null
  rol_pago: number | null

  constructor() {
    super()
    this.tipo = null
    this.mes = null
    this.empleado = null
    this.monto = null
    this.model_type = null
    this.model_id = null
    this.rol_pago = null
  }
}
