import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class Cuestionario extends EntidadAuditable {
  pregunta: number | null
  respuesta: number | null
  id_cuestionario ?: number | null
  constructor() {
    super()
    this.pregunta = null
    this.respuesta = null
    this.id_cuestionario = null
  }
}
