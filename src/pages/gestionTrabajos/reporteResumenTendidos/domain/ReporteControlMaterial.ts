import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class ReporteControlMaterial extends EntidadAuditable {
  item: number | null
  detalle_material: string | null
  stock_inicial: number | null
  utilizado: number | null
  stock_final_dia: number | null

  constructor() {
    super()
    this.item = null
    this.detalle_material = null
    this.stock_inicial = null
    this.utilizado = null
    this.stock_final_dia = null
  }
}
