import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class ImagenesAdicionales extends EntidadAuditable {
  etiqueta: string | null
  ruta: string | null
  activo: boolean

  constructor() {
    super()
    this.etiqueta = null
    this.ruta = null
    this.activo = true
  }
}
