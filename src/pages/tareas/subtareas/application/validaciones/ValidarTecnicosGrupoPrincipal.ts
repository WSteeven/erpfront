import { opcionesModoAsignacionTrabajo } from "config/utils"
import { Validador } from "shared/validadores/domain/Validador"
import { Ref } from "vue"
import { Subtarea } from '../../domain/Subtarea'

export class ValidarTecnicosGrupoPrincipal implements Validador {
  private subtarea: Ref<any[]>

  constructor(subtarea: Ref<any[]>) {
    this.subtarea = subtarea
  }

  /**
   * Cuando se selecciona un grupo éste debe tener al menos un tecnico ingresado
   */
  async validar() {

    const noEsValido = this.subtarea.value.length === 0

    if (noEsValido)
      throw new Error("Debe asignar al menos un empleado.")


    return true
  }
}
