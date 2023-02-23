import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class Notificacion extends EntidadAuditable {
  usuario: string | null
  fecha: Date | null
  descripcion: string | null

  constructor() {
    super()
    this.usuario = null
    this.fecha = null
    this.descripcion = null
  }
}
