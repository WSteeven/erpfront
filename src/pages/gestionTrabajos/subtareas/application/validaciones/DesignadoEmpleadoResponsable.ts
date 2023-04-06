import { Validador } from 'shared/validadores/domain/Validador'
import { Subtarea } from '../../domain/Subtarea'
import { EmpleadoGrupo } from '../../domain/EmpleadoGrupo'
import { modosAsignacionTrabajo } from 'config/tareas.utils'
import { UnwrapRef } from 'vue'

export class DesignadoEmpleadoResponsable implements Validador {
  private subtarea: UnwrapRef<Subtarea>

  constructor(subtarea: UnwrapRef<Subtarea>) {
    this.subtarea = subtarea
  }

  /**
   * Validar que se haya designado a un empleado como responsable
   */
  async validar(): Promise<boolean> {
    console.log(this.subtarea)
    if (this.subtarea.modo_asignacion_trabajo === modosAsignacionTrabajo.por_grupo) {
      if (!this.subtarea.empleados_designados.some((empleado: EmpleadoGrupo) => empleado.es_responsable)) {
        throw new Error('Debe designar a un empleado como responsable.')
      }
    }
    return true
  }
}
