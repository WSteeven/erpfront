import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
import { Formulario } from 'capacitacion/forms/domain/Formulario'

export class EvaluacionDesempeno extends EntidadAuditable {
  evaluado: number | null
  evaluador: number | null
  calificacion: number | null
  formulario: number | null
  respuestas: any|string|null
  tiene_respuestas: boolean

  constructor() {
    super()
    this.evaluado = null
    this.evaluador = null
    this.calificacion = null
    this.formulario = null
    this.respuestas = new Formulario().formulario
    this.tiene_respuestas = false
  }
}
