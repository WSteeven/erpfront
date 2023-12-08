import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

// Material ocupado en el seguimiento
export class MaterialOcupadoFormulario extends EntidadAuditable {
  detalle_producto_id: number | null
  detalle_producto: string | null
  despachado: number | null
  stock_actual: number
  total_cantidad_utilizada: number
  cantidad_utilizada: number | null
  cantidad_old: number | null
  serial: string | null
  medida: string | null
  devuelto: number | null
  cliente: string | null

  constructor() {
    super()
    this.detalle_producto_id = null
    this.detalle_producto = null
    this.despachado = null
    this.stock_actual = 0
    this.total_cantidad_utilizada = 0
    this.cantidad_utilizada = null
    this.cantidad_old = null
    this.serial = null
    this.medida = null
    this.devuelto = null
    this.cliente = null
  }
}
