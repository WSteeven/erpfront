import { Validador } from 'shared/validadores/domain/Validador'
import { opcionesModoAsignacionTrabajo } from 'config/utils'
import { Trabajo } from 'trabajos/domain/Trabajo'

export class ValidarEmpleadosSeleccionados implements Validador {
  private trabajo: Trabajo

  constructor(trabajo: Trabajo) {
    this.trabajo = trabajo
  }

  /**
   * Cuando se selecciona un grupo éste debe tener al menos un tecnico ingresado
   */
  async validar() {

    if (this.trabajo.modo_asignacion_trabajo === opcionesModoAsignacionTrabajo.por_trabajador) {
      const noEsValido = this.trabajo.empleados_seleccionados.length === 0

      if (noEsValido)
        throw new Error('Debe asignar al menos un empleado.')
    }

    return true
  }
}
