import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class MaterialOcupadoFormulario extends EntidadAuditable {
  detalle_producto_id: number | null
  detalle_producto: string | null
  stock_actual: number | null
  cantidad_utilizada: number | null
  medida: string | null

  constructor() {
    super()
    this.detalle_producto_id = null
    this.detalle_producto = null
    this.stock_actual = null
    this.cantidad_utilizada = null
    this.medida = null
  }
}
