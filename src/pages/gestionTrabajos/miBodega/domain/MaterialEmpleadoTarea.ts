import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

// Material para mostrar en mi bodega tarea
export class MaterialEmpleadoTarea extends EntidadAuditable {
  detalle_producto_id: number | null
  item: number | null
  producto: string | null
  categoria: string | null
  detalle_producto: string | null
  stock_actual: number | null
  tarea: number | null
  medida: number | null
  serial: string | null
  cliente: string | null
  etapa: string | null
  despachado: number | null

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
    this.serial = null
    this.cliente = null
    this.etapa = null
    this.despachado = null
  }
}
