import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class ImagenesAdicionales extends EntidadAuditable {
  etiqueta: string | null
  activo: boolean

  constructor() {
    super()
    this.etiqueta = null
    this.activo = true
  }
}
