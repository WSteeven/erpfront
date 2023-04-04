import { Validador } from 'shared/validadores/domain/Validador'
import { Subtarea } from '../../domain/Subtarea'
import { EmpleadoGrupo } from '../../domain/EmpleadoGrupo'

export class DesignadoEmpleadoResponsable implements Validador {
  private subtarea: Subtarea

  constructor(subtarea: Subtarea) {
    this.subtarea = subtarea
  }

  /**
   * Validar que se haya designado a un empleado como responsable
   */
  async validar(): Promise<boolean> {
    if (!this.subtarea.empleados_designados.some((empleado: EmpleadoGrupo) => empleado.es_responsable)) {
      throw new Error('Debe designar a un empleado como responsable.')
    }
    return true
  }
}
