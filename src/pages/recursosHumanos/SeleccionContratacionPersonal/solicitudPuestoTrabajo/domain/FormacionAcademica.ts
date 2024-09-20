import { EntidadAuditable } from "src/shared/entidad/domain/entidadAuditable"

export class FormacionAcademica extends EntidadAuditable {
  nombre: string | null
  nivel: string | null


  constructor() {
    super()
    this.nombre = null
    this.nivel = null
  }
}
