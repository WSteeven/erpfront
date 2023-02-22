import { Validador } from 'shared/validadores/domain/Validador'
import { opcionesModoAsignacionTrabajo } from 'config/utils'
import { Trabajo } from '../../domain/Trabajo'

export class ValidarEmpleadosSeleccionados implements Validador {
  private subtarea: Trabajo

  constructor(subtarea: Trabajo) {
    this.subtarea = subtarea
  }

  /**
   * Cuando se selecciona un grupo éste debe tener al menos un tecnico ingresado
   */
  async validar() {

    if (!this.subtarea.tiene_subtrabajos && this.subtarea.modo_asignacion_trabajo === opcionesModoAsignacionTrabajo.por_trabajador) {
      const noEsValido = this.subtarea.empleados_seleccionados.length === 0

      if (noEsValido)
        throw new Error('Debe asignar al menos un empleado.')
    }

    return true
  }
}
