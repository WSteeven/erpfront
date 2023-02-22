import { Validador } from 'shared/validadores/domain/Validador'
import { opcionesModoAsignacionTrabajo } from 'config/utils'
import { Trabajo } from '../../domain/Trabajo'

export class ValidarGrupoAsignado implements Validador {
  private subtarea: Trabajo

  constructor(subtarea: Trabajo) {
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
