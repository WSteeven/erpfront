import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class Notificacion extends EntidadAuditable {
  id: number
  mensaje: string
  link: string
  per_originador: number
  per_destinatario: number
  leida: boolean
  tipo_notificacion: string
  created_at: string

  constructor() {
    super()
    this.id = 0
    this.mensaje = ''
    this.link = ''
    this.per_originador = 0
    this.per_destinatario = 0
    this.leida = false
    this.tipo_notificacion = ''
    this.created_at = ''

  }
}
