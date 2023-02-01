import { EntidadAuditable } from "shared/entidad/domain/entidadAuditable"

export class Grupo extends EntidadAuditable {
  nombre: string | null
  empleado_id: number | null
  activo: boolean

  constructor() {
    super()
    this.nombre = null
    this.empleado_id = null // responsable
    this.activo = false
  }
}
