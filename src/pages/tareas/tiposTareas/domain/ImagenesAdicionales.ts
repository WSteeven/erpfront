import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class ImagenesAdicionales extends EntidadAuditable {
  etiqueta: string | null
  tipo_tarea: number | null
  activo: boolean

  constructor() {
    super()
    this.etiqueta = null
    this.tipo_tarea = null
    this.activo = true
  }
}
