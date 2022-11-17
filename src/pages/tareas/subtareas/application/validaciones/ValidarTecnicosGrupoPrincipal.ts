import { Validador } from "shared/validadores/domain/Validador"
import { Subtarea } from '../../domain/Subtarea'

export class ValidarTecnicosGrupoPrincipal implements Validador {
  private subtarea: Subtarea

  constructor(subtarea: Subtarea) {
    this.subtarea = subtarea
  }

  /**
   * Cuando se selecciona un grupo éste debe tener al menos un tecnico ingresado
   */
  async validar() {
    const noEsValido = this.subtarea.tecnicos_grupo_principal.length === 0

    if (noEsValido)
      throw new Error("Debe asignar al menos un técnico al grupo asignado.")

    return true
  }
}
