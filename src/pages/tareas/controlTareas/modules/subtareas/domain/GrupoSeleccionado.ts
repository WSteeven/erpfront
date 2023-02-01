import { EntidadAuditable } from "shared/entidad/domain/entidadAuditable"

export class GrupoSeleccionado extends EntidadAuditable {
  nombre: string | null
  principal: boolean

  constructor() {
    super()
    this.nombre = null
    this.principal = false
  }
}
