import { EntidadAuditable } from "shared/entidad/domain/entidadAuditable";

export class Multa extends EntidadAuditable {
  nombre: string | null

  constructor() {
    super()
    this.nombre = null
  }
}
