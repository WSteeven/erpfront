import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class Examen extends EntidadAuditable {
  tipo_examen: string | number | null
  categoria_examen: string | number | null
  examen: string | number | null

  constructor() {
    super()
    this.tipo_examen = null
    this.categoria_examen = null
    this.examen = null
  }
}
