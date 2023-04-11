import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class MaterialEmpleadoTarea extends EntidadAuditable {
  detalle_producto_id: number | null
  item: number | null
  producto: string | null
  categoria: string | null
  detalle_producto: string | null
  stock_actual: number | null
  tarea: number | null
  medida: number | null

  constructor() {
    super()
    this.detalle_producto_id = null
    this.item = null
    this.producto = null
    this.categoria = null
    this.detalle_producto = null
    this.stock_actual = null
    this.tarea = null
    this.medida = null
  }
}
