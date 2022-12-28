import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class MaterialOcupado extends EntidadAuditable {
  detalle: string | null
  cantidad_despachada: number | null
  cantidad_utilizada: number | null

  constructor() {
    super()
    this.detalle = null
    this.cantidad_despachada = null
    this.cantidad_utilizada = null
  }
}
