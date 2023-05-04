import { EntidadAuditable } from "shared/entidad/domain/entidadAuditable";

export class PermisoEmpleado extends EntidadAuditable {
  motivo: string | null
  estado: string | null
  fecha_inicio: string | null
  fecha_fin: string | null
  justificacion: string | null

  constructor() {
    super()
    this.motivo = null
    this.estado = null
    this.fecha_inicio = null
    this.fecha_fin = null
    this.justificacion = null
  }
}
