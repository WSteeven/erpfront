import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
export class TipoChargeBack extends EntidadAuditable {
  id: number | null
  nombre: string | null

  constructor() {
    super()
    this.id = null
    this.nombre = null
  }
}
