import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class UmbralVentas extends EntidadAuditable {
  id: number | null
  cantidad_ventas: number | null
  vendedor: number | null
  vendedor_info: string | null
  constructor() {
    super()
    this.id = null
    this.cantidad_ventas = null
    this.vendedor = null
    this.vendedor_info = null

  }
}
