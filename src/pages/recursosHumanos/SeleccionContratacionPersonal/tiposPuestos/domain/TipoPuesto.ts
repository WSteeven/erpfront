import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class TipoPuesto extends EntidadAuditable {
  nombre: string | null
  activo: boolean

  constructor() {
    super()
    this.nombre = null
    this.activo = true
  }
}
