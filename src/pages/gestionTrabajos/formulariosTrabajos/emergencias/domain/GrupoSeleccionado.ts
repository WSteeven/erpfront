import { Grupo } from 'recursosHumanos/grupos/domain/Grupo'

export class GrupoSeleccionado extends Grupo {
  responsable: boolean

  constructor() {
    super()
    this.responsable = false
  }
}
