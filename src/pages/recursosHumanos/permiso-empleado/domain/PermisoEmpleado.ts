import { EntidadAuditable } from "shared/entidad/domain/entidadAuditable";

export class PermisoEmpleado extends EntidadAuditable {
  id: number | null
  empleado:number | null
  empleado_info: string |null
  tipo_permiso: string | null
  tipo_permiso_info: string | null
  estado: string | null
  estado_permiso_info: string | null
  fecha_hora_inicio: string | null
  fecha_hora_fin: string | null
  fecha_recuperacion: string | null
  hora_recuperacion: string |null
  dias_permiso: number | null
  recuperables: boolean | null
  justificacion: string | null
  documento: string |null
  cargo_vacaciones: boolean |null
  constructor() {
    super()
    this.id = null
    this.empleado = null
    this.empleado_info = null
    this.tipo_permiso = null
    this.tipo_permiso_info = null
    this.estado = null
    this.estado_permiso_info = null
    this.fecha_hora_inicio = null
    this.fecha_hora_fin = null
    this.fecha_recuperacion = null
    this.hora_recuperacion=null
    this.recuperables = null
    this.dias_permiso = null
    this.justificacion = null
    this.documento =null
    this.recuperables=false
    this.cargo_vacaciones = false
  }
}
