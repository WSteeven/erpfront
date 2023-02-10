import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class Canton extends EntidadAuditable {
  descripcion: string | null
  provincia: number | null

  constructor() {
    super()
    this.descripcion = null
    this.provincia = null
  }
}
