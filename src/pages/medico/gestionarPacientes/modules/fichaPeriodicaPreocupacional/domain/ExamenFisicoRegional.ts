import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class ExamenFisicoRegional extends EntidadAuditable {
  categoria_examen_fisico: number | null
  descripcion: string | null

  constructor() {
    super()
    this.descripcion = null
    this.categoria_examen_fisico = null
  }
}
