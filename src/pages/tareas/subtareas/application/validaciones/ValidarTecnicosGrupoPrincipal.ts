import { Validador } from "shared/validadores/domain/Validador"
import { Subtarea } from "../../domain/Subtarea"
import { Ref, UnwrapRef } from "vue"

export class ValidarTecnicosGrupoPrincipal implements Validador {
  private seDebeValidar: Ref<boolean>
  private subtarea: Subtarea

  constructor(
    subtarea: Subtarea,
    seDebeValidar: Ref<boolean>
  ) {
    this.subtarea = subtarea
    this.seDebeValidar = seDebeValidar
  }

  /**
   * cuando se ingresa un titulo también se debe ingresar un detalle
   * y viceversa
   * @returns
   */
  async validar() {
    console.log(this.subtarea)
    if (this.seDebeValidar.value) {
      const noEsValido = this.subtarea.tecnicos_grupo_principal.length === 0

      if (noEsValido)
        throw new Error("Debe asignar al menos un técnico del grupo asignado.")
    }
    return true
  }
}
