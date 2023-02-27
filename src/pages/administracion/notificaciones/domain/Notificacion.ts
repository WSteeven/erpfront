import { EntidadAuditable } from "shared/entidad/domain/entidadAuditable";

export class Notificacion extends EntidadAuditable {
  mensaje: string | null
  link: string | null
  per_originador: number | null
  per_destinatario: number | null
  leida:boolean

  constructor() {
    super()
    this.mensaje = null
    this.link = null
    this.per_originador = null
    this.per_destinatario = null
    this.leida = false
  }
}
