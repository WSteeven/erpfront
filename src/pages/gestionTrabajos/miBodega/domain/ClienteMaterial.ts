import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class ClienteMaterial extends EntidadAuditable {
  cliente_id: number | null
  razon_social: string | null

  constructor() {
    super()
    this.cliente_id = null
    this.razon_social = null
  }
}
