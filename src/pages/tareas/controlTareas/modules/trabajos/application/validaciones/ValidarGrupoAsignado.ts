import { Validador } from 'shared/validadores/domain/Validador'
import { opcionesModoAsignacionTrabajo } from 'config/utils'
import { Subtarea } from '../../domain/Trabajo'

export class ValidarGrupoAsignado implements Validador {
  private subtarea: Subtarea

  constructor(subtarea: Subtarea) {
    this.subtarea = subtarea
  }

  /**
   * Cuando se selecciona un grupo éste debe tener al menos un tecnico ingresado
   */
  async validar() {

    if (this.subtarea.modo_asignacion_trabajo === opcionesModoAsignacionTrabajo.por_grupo) {
      const noEsValido = this.subtarea.grupos_seleccionados.length === 0

      if (noEsValido)
        throw new Error('Debe asignar al menos un grupo.')
    }

    return true
  }
}
