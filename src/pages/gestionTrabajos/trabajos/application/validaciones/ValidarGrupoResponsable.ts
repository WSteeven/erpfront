import { opcionesModoAsignacionTrabajo } from 'config/utils'
import { Validador } from 'shared/validadores/domain/Validador'
import { GrupoSeleccionado } from '../../domain/GrupoSeleccionado'
import { Trabajo } from '../../domain/Trabajo'

export class ValidarGrupoResponsable implements Validador {
  private subtarea: Trabajo

  constructor(subtarea: Trabajo) {
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
