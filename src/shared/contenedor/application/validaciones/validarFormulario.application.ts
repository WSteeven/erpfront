import {Validador} from "@shared/validadores/domain/validador.domain"
import {Ref} from "@vue/composition-api"

export class ValidarFormulario implements Validador {
  private formulario: Ref<any>

  constructor(formulario: Ref<any>) {
    this.formulario = formulario
  }

  /**
   * Valida que el formulario cumpla con las validaciones de vee-validate
   * @returns true, cuando el veevalidate, evalue la correctitud del formulario
   */
  async validar() {
    return await this.formulario.value.validate()
  }
}
