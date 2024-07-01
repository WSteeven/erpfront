import { CuestionarioPublico } from 'pages/medico/cuestionariosPublicos/domain/CuestionarioPublico'
import { RespuestaCuestionarioEmpleado } from '../domain/RespuestaCuestionarioEmpleado'
import { Validador } from 'shared/validadores/domain/Validador'

export class ValidarCuestionarioLleno implements Validador {
  private respuestaCuestionarioEmpleado: RespuestaCuestionarioEmpleado | CuestionarioPublico

  constructor(respuestaCuestionarioEmpleado: RespuestaCuestionarioEmpleado | CuestionarioPublico) {
    this.respuestaCuestionarioEmpleado = respuestaCuestionarioEmpleado
  }

  async validar(): Promise<boolean> {
    const cuestionariosConIdValido = this.respuestaCuestionarioEmpleado.cuestionario.filter((cuestionario) => cuestionario.id_cuestionario)
    // console.log(cuestionariosConIdValido)

    if (this.respuestaCuestionarioEmpleado.cuestionario.length !== cuestionariosConIdValido.length) {
      throw new Error('No ha llenado todo el cuestionario!')
    }

    return true
  }
}
