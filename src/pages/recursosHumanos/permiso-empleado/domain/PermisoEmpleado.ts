import { EntidadAuditable } from "shared/entidad/domain/entidadAuditable";

export class PermisoEmpleado extends EntidadAuditable {
  id: number | null
  motivo: string | null
  motivo_info: string | null
  estado: string | null
  estado_permiso_info: string | null
  fecha_inicio: string | null
  fecha_fin: string | null
  justificacion: string | null
  empleado_info: string | null

  constructor() {
    super()
    this.id = null
    this.motivo = null
    this.motivo_info = null
    this.estado = null
    this.estado_permiso_info = null
    this.fecha_inicio = null
    this.fecha_fin = null
    this.justificacion = null
    this.empleado_info = null
  }
}
