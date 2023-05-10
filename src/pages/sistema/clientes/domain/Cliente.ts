import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class Cliente extends EntidadAuditable {
  empresa: string | null
  razon_social: string | null
  canton: string | null
  parroquia: string | null
  requiere_bodega: boolean | null
  estado: boolean
  logo_url: string|null

  constructor() {
    super()
    this.empresa = null
    this.razon_social = null
    this.canton = null
    this.parroquia = null
    this.requiere_bodega = false
    this.estado = true
    this.logo_url=null
  }
}
