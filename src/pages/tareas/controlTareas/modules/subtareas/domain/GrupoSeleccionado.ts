import { Grupo } from "tareas/grupos/domain/Grupo"

export class GrupoSeleccionado extends Grupo {
  responsable: boolean

  constructor() {
    super()
    this.responsable = false
  }
}
