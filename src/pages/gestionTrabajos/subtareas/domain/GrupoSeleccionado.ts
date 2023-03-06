import { Grupo } from 'recursosHumanos/grupos/domain/Grupo'

export class GrupoSeleccionado extends Grupo {
  es_responsable: boolean

  constructor() {
    super()
    this.es_responsable = false
  }
}
