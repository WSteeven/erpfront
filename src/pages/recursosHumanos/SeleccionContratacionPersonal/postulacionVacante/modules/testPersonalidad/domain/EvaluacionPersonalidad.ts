import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class EvaluacionPersonalidad extends EntidadAuditable {
  postulacion: number| null
  // token: string | null
  respuestas: []
  fecha_realizacion: string | null
  observacion: string | null
  completado: boolean
  enviada_mail: boolean

  constructor() {
    super()
    this.postulacion = null
    // this.token = null
    this.respuestas = []
    this.fecha_realizacion = null
    this.observacion = null
    this.completado = false
    this.enviada_mail = false
  }
}
