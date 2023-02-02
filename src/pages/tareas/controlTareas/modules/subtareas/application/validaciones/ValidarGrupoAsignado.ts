// import { opcionesModoAsignacionTrabajo } from "config/utils"
import { Validador } from "shared/validadores/domain/Validador"
import { Ref } from "vue"
// import { Subtarea } from '../../domain/Subtarea'

export class ValidarGrupoAsignado implements Validador {
  private gruposSeleccionados: [] //Ref<any[]>

  constructor(gruposSeleccionados: []) {
    this.gruposSeleccionados = gruposSeleccionados
  }

  /**
   * Cuando se selecciona un grupo éste debe tener al menos un tecnico ingresado
   */
  async validar() {

    const noEsValido = this.gruposSeleccionados.length === 0

    if (noEsValido)
      throw new Error("Debe asignar al menos un grupo.")

    return true
  }
}
