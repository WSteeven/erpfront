import { Validador } from 'shared/validadores/domain/Validador'
import { EvaluacionDesempeno } from 'capacitacion/evaluacionDesempeño/domain/EvaluacionDesempeno'

export class ValidarRespuestasEvaluacionDesempeno implements Validador{
  private evaluacion : EvaluacionDesempeno

  constructor(evaluacion: EvaluacionDesempeno) {
    this.evaluacion = evaluacion
  }

  async validar(): Promise<boolean>{
    const invalidField = this.evaluacion.respuestas.find(field => field.required && !field.valor)
    if (invalidField) {
      throw new Error('Por favor llena todos los campos marcados con asterisco (*) porque son requeridos')
    }

    return true
  }

}
