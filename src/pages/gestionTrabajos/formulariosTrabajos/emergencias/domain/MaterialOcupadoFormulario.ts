import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

// Material ocupado en el seguimiento
export class MaterialOcupadoFormulario extends EntidadAuditable {
  detalle_producto_id: number | null
  detalle_producto: string | null
  stock_actual: number | null
  cantidad_utilizada: number | null
  cantidad_old: number | null
  medida: string | null

  constructor() {
    super()
    this.detalle_producto_id = null
    this.detalle_producto = null
    this.stock_actual = null
    this.cantidad_utilizada = null
    this.cantidad_old = null
    this.medida = null
  }
}
