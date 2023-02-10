import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class Cliente extends EntidadAuditable {
  empresa: string | null
  razon_social: string | null
  parroquia: string | null
  requiere_bodega: string | null
  estado: string | null

  constructor() {
    super()
    this.empresa = null
    this.razon_social = null
    this.parroquia = null
    this.requiere_bodega = null
    this.estado = null
  }
}
