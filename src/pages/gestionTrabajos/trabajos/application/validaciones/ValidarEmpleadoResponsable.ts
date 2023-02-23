import { Validador } from 'shared/validadores/domain/Validador'
import { opcionesModoAsignacionTrabajo } from 'config/utils'
import { Trabajo } from '../../domain/Trabajo'
import { EmpleadoSeleccionado } from '../../domain/EmpleadoSeleccionado'

export class ValidarEmpleadoResponsable implements Validador {
  private subtarea: Trabajo

  constructor(subtarea: Trabajo) {
    this.subtarea = subtarea
  }

  /**
   * Cuando se selecciona un grupo éste debe tener al menos un tecnico ingresado
   */
  async validar() {

    if (this.subtarea.modo_asignacion_trabajo === opcionesModoAsignacionTrabajo.por_trabajador) {
      const noEsValido = !this.subtarea.empleados_seleccionados.some((empleado: EmpleadoSeleccionado) => empleado.responsable)

      if (noEsValido)
        throw new Error('Debe asignar a un empleado responsable.')
    }

    return true
  }
}
