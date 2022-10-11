import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class Inventario extends EntidadAuditable {
  producto: number | null
  detalle_id: number | null
  sucursal_id: number | null
  cliente_id: number | null
  condicion: number | null
  cantidad: number | null
  prestados: number | null
  estado: string | null

  constructor() {
    super()
    this.producto= null
    this.detalle_id= null
    this.sucursal_id= null
    this.cliente_id= null
    this.condicion= null
    this.cantidad= null
    this.prestados= null
    this.estado= null
  }
}
