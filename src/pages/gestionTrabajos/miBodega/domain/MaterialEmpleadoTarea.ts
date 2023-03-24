import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class MaterialEmpleadoTarea extends EntidadAuditable {
  item: number | null
  detalle_producto: string | null
  stock_actual: number | null
  tarea: number | null
  medida: number | null

  constructor() {
    super()
    this.item = null
    this.detalle_producto = null
    this.stock_actual = null
    this.tarea = null
    this.medida = null
  }
}
