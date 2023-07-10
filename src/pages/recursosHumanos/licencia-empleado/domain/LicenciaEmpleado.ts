import { EntidadAuditable } from "shared/entidad/domain/entidadAuditable";

export class LicenciaEmpleado extends EntidadAuditable {
  id: number | null
  empleado:number | null
  empleado_info: string |null
  tipo_licencia: string | null
  tipo_licencia_info: string | null
  estado: string | null
  estado_licencia_info: string | null
  fecha_inicio: string | null
  fecha_fin: string | null
   justificacion: string | null
  documento: string |null
  tieneDocumento: boolean | null

  constructor() {
    super()
    this.id = null
    this.empleado = null
    this.empleado_info = null
    this.fecha_inicio = null
    this.fecha_fin = null
    this.tipo_licencia = null
    this.tipo_licencia_info = null
    this.estado = null
    this.estado_licencia_info = null
    this.justificacion = null
    this.documento =null
    this.tieneDocumento = null

  }
}
