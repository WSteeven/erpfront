import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class Tarea extends EntidadAuditable {
  codigo_tarea: string | null
  codigo_tarea_cliente: string | null
  cliente: number | null
  cliente_final: number | null
  fecha_solicitud: string | null
  hora_solicitud: string | null
  detalle: string | null
  estado: string | null // pendiente
  supervisor: number | null
  es_proyecto: boolean
  codigo_proyecto: string | null

  constructor() {
    super()
    this.codigo_tarea = null
    this.codigo_tarea_cliente = null
    this.cliente = null
    this.cliente_final = null
    this.hora_solicitud = null
    this.fecha_solicitud = null
    this.detalle = null
    this.estado = null
    this.supervisor = null
    this.es_proyecto = false
    this.codigo_proyecto = null
  }
}
