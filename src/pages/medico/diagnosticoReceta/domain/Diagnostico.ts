import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class Diagnostico extends EntidadAuditable {
  cie: string | null
  recomendacion: string | null

  constructor() {
    super()
    this.cie = null
    this.recomendacion = null
  }
}
