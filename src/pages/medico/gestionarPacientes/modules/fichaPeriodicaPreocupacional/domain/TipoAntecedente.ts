import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class TipoAntecedente extends EntidadAuditable {
  nombre: string | null
  genero: string | null

  constructor() {
    super()
    this.nombre = null
    this.genero = null
  }
}
