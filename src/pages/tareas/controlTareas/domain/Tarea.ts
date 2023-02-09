import { destinosTareas } from 'config/utils'
import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class Tarea extends EntidadAuditable {
  codigo_tarea: string | null
  codigo_tarea_cliente: string | null
  cliente: number | null
  cliente_final: number | null
  fecha_solicitud: string | null
  titulo: string | null
  detalle: string | null
  supervisor: number | null
  coordinador: number | null
  proyecto: number | null
  estado: string | null
  destino: string | null
  tipo_trabajo: string | null
  tiene_subtareas: boolean

  constructor() {
    super()
    this.codigo_tarea = null
    this.codigo_tarea_cliente = null
    this.cliente = null
    this.cliente_final = null
    this.fecha_solicitud = null
    this.titulo = null
    this.detalle = null
    this.supervisor = null
    this.coordinador = null
    this.proyecto = null
    this.estado = null
    this.destino = destinosTareas.paraProyecto
    this.tipo_trabajo = null
    this.tiene_subtareas = true
  }
}
