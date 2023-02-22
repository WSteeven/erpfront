import { destinosTareas } from 'config/utils'
import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class Tarea extends EntidadAuditable {
  codigo_tarea: string | null
  codigo_tarea_cliente: string | null
  fecha_solicitud: string | null
  titulo: string | null
  para_cliente_proyecto: string | null

  // Foreign keys
  cliente: number | null
  proyecto: number | null
  fiscalizador: number | null
  coordinador: number | null
  cliente_final: number | null

  constructor() {
    super()
    this.codigo_tarea = null
    this.codigo_tarea_cliente = null
    this.fecha_solicitud = null
    this.titulo = null
    this.para_cliente_proyecto = destinosTareas.paraProyecto

    // Foreign key
    this.cliente = null
    this.proyecto = null
    this.coordinador = null
    this.fiscalizador = null
    this.cliente_final = null
  }
}
