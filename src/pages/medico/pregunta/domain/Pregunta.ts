import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
export class Pregunta extends EntidadAuditable {
  codigo: string | null
  pregunta: number | null


  constructor() {
    super()
    this.codigo = null
    this.pregunta = null
  }
}
