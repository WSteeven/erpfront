import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class ControlCambio extends EntidadAuditable {
  codigo_tarea_jp: string | null
  codigo_tarea_cliente: string | null
  detalle_tarea: string | null
  cambios: string | null
  numero_elemento: string | null
  coordenada_x: string | null
  coordenada_y: string | null
  fecha: string | null
  aprobado_por: string | null
  observacion: string | null

  constructor() {
    super()
    this.codigo_tarea_jp = null
    this.codigo_tarea_cliente = null
    this.detalle_tarea = null
    this.cambios = null
    this.numero_elemento = null
    this.coordenada_x = null
    this.coordenada_y = null
    this.fecha = null
    this.aprobado_por = null
    this.observacion = null
  }
}
