import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class Certificacion extends EntidadAuditable {
  descripcion: string | null
  activo: boolean

  constructor() {
    super()
    this.descripcion = null
    this.activo = true
  }
}
