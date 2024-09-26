import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class TipoAntecedente extends EntidadAuditable {
  nombre: string | null
  examen: string | null
  genero: string | null

  constructor() {
    super()
    this.nombre = null
    this.examen = null
    this.genero = null
  }
}
