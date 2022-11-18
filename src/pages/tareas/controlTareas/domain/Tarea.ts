import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
import { UbicacionTarea } from './UbicacionTarea'

export class Tarea extends EntidadAuditable {
  codigo_tarea: string | null
  codigo_tarea_cliente: string | null
  cliente: number | null
  cliente_final: number | null
  fecha_solicitud: string | null
  detalle: string | null
  supervisor: number | null
  es_proyecto: boolean
  codigo_proyecto: string | null
  ubicacion_tarea: UbicacionTarea


  constructor() {
    super()
    this.codigo_tarea = null
    this.codigo_tarea_cliente = null
    this.cliente = null
    this.cliente_final = null
    this.fecha_solicitud = null
    this.detalle = null
    this.supervisor = null
    this.es_proyecto = false
    this.codigo_proyecto = null
    this.ubicacion_tarea = new UbicacionTarea()
  }
}
