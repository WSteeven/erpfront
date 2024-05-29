import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class TipoCuestionario extends EntidadAuditable {
  titulo: string | null

  constructor() {
    super()
    this.titulo = null
  }
}
