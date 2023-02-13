import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class Provincia extends EntidadAuditable {
  descripcion: string | null

  constructor() {
    super()
    this.descripcion = null
  }
}
