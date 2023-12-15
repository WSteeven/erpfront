import { EntidadAuditable } from "shared/entidad/domain/entidadAuditable";

export class DescuentosGenrales extends EntidadAuditable {
  nombre: string | null
  abreviatura: string | null

  constructor() {
    super()
    this.nombre = null
    this.abreviatura = null
  }
}
