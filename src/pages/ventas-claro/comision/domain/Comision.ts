import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
export class Comision extends EntidadAuditable {
  plan: number | null
  plan_info: string | null
  forma_pago: string | null
  comision: number | null
  constructor() {
    super()
    this.plan = null
    this.plan_info = null
    this.forma_pago = null
    this.comision = null
  }
}
