import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class Cuestionario extends EntidadAuditable {
  // pregunta: number | null
  // respuesta: number | null
  respuesta_texto: number | null
  id_cuestionario ?: number | null
  // finalizado: boolean

  constructor() {
    super()
    // this.pregunta = null // revisar si se queda
    // this.respuesta = null
    this.respuesta_texto = null
    this.id_cuestionario = null
    // this.finalizado = false
  }
}
