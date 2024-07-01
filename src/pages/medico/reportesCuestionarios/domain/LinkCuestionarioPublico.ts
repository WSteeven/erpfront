import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class LinkCuestionarioPublico extends EntidadAuditable {
  link: string | null
  activo: boolean

  constructor() {
    super()
    this.link = null
    this.activo = true
  }
}
