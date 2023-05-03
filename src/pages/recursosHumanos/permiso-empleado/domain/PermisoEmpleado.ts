import { EntidadAuditable } from "shared/entidad/domain/entidadAuditable";

export class PermisoEmpleado extends EntidadAuditable {
  nombre: string | null

  constructor() {
    super()
    this.nombre = null
  }
}
