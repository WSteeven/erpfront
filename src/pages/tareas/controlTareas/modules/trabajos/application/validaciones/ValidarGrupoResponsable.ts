import { opcionesModoAsignacionTrabajo } from 'config/utils'
import { Validador } from 'shared/validadores/domain/Validador'
import { GrupoSeleccionado } from '../../domain/GrupoSeleccionado'
import { Subtarea } from '../../domain/Trabajo'

export class ValidarGrupoResponsable implements Validador {
  private subtarea: Subtarea

  constructor(subtarea: Subtarea) {
    this.subtarea = subtarea
  }

  /**
   * Cuando se selecciona un grupo éste debe tener al menos un tecnico ingresado
   */
  async validar() {

    if (this.subtarea.modo_asignacion_trabajo === opcionesModoAsignacionTrabajo.por_grupo) {
      const noEsValido = !this.subtarea.grupos_seleccionados.some((grupo: GrupoSeleccionado) => grupo.responsable)

      if (noEsValido)
        throw new Error('Debe asignar a un grupo como principal.') // Borrame please
    }
    return true
  }
}
