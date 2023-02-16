import { EntidadAuditable } from "shared/entidad/domain/entidadAuditable";

export class Cargo extends EntidadAuditable {
  nombre: string | null
  
  constructor() {
    super()
    this.nombre = null
  }
}
