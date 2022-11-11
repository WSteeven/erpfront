import { EntidadAuditable } from "shared/entidad/domain/entidadAuditable"

export class SolicitudMaterial extends EntidadAuditable {
  fecha_solicitud: string | null
  codigo_tarea_jp: string | null
  detalle_tarea: string | null
  grupo: string | null
  estado: string | null

  constructor() {
    super()
    this.fecha_solicitud = null
    this.codigo_tarea_jp = null
    this.detalle_tarea = null
    this.grupo = null
    this.estado = null // Completo - Pendiente - Parcial
  }
}
