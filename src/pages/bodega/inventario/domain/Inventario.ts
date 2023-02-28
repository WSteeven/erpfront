import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class Inventario extends EntidadAuditable {
  producto: number | null
  detalle: number | null
  detalle_id: number | null
  sucursal: number | null
  sucursal_id: number | null
  cliente: number | null
  cliente_id: number | null
  condicion: number | null
  por_recibir: number | null
  cantidad: number | null
  por_entregar: number | null
  estado: string | null

  constructor() {
    super()
    this.producto= null
    this.detalle= null
    this.detalle_id= null
    this.sucursal= null
    this.sucursal_id= null
    this.cliente= null
    this.cliente_id= null
    this.condicion= null
    this.por_recibir= null
    this.cantidad= null
    this.por_entregar= null
    this.estado= null
  }
}
