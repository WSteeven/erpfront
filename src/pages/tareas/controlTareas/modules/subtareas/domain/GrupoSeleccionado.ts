import { Grupo } from "pages/tareas/grupos/domain/Grupo"

export class GrupoSeleccionado extends Grupo {
  principal: boolean

  constructor() {
    super()
    this.principal = false
  }
}
