import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
export class ProductoVentas extends EntidadAuditable {
  plan: number | null
  plan_info: string | null
  bundle: number | null
  precio: number | null
  activo: boolean


  constructor() {
    super()
    this.plan = null
    this.plan_info = null
    this.bundle = null
    this.precio = null
    this.activo = true

  }
}
