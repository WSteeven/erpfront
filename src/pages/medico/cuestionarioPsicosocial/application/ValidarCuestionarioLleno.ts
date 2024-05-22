import { RespuestaCuestionarioEmpleado } from '../domain/RespuestaCuestionarioEmpleado'
import { Validador } from 'shared/validadores/domain/Validador'

export class ValidarCuestionarioLleno implements Validador {
  private respuestaCuestionarioEmpleado: RespuestaCuestionarioEmpleado

  constructor(respuestaCuestionarioEmpleado: RespuestaCuestionarioEmpleado) {
    this.respuestaCuestionarioEmpleado = respuestaCuestionarioEmpleado
  }

  async validar(): Promise<boolean> {
    const cuestionariosConIdValido = this.respuestaCuestionarioEmpleado.cuestionario.filter((cuestionario) => cuestionario.id_cuestionario)

    if (this.respuestaCuestionarioEmpleado.cuestionario.length !== cuestionariosConIdValido.length) {
      throw new Error('No ha llenado todo el cuestionario!')
    }

    return true
  }
}
