import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class Inventario extends EntidadAuditable {
  producto: number | null
  detalle: number | null
  sucursal: number | null
  cliente: number | null
  condicion: number | null
  cantidad: number | null
  prestados: number | null
  estado: string | null

  constructor() {
    super()
    this.producto= null
    this.detalle= null
    this.sucursal= null
    this.cliente= null
    this.condicion= null
    this.cantidad= null
    this.prestados= null
    this.estado= null
  }
}
