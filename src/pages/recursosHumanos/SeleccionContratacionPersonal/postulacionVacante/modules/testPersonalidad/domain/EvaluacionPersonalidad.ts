import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class EvaluacionPersonalidad extends EntidadAuditable {
  postulacion: string | null
  token: string | null
  respuestas: []
  fecha_realizacion: string | null
  completado: boolean

  constructor() {
    super()
    this.postulacion = null
    this.token = null
    this.respuestas = []
    this.fecha_realizacion = null
    this.completado = false
  }
}
