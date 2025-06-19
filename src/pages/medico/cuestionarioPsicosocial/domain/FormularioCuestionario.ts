import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
import { Cuestionario } from './Cuestionario'

export class FormularioCuestionario extends EntidadAuditable {
  codigo: string | null
  pregunta: string | null
  respuesta: number | null | []
  cuestionario: Cuestionario[]

  constructor() {
    super()
    this.codigo = null
    this.pregunta = null
    this.respuesta = null
    this.cuestionario = []
  }
}
