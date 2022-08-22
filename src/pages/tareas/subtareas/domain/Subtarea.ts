export class Subtarea {
  coordinador: string | null
  codigo_tarea_jp: string | null
  tipo_trabajo: number | null
  codigo_tarea_cliente: string | null
  codigo_subtarea: string | null
  detalle_tarea: string | null
  detalle_subtarea: string | null
  grupo: string | null
  tecnico_responsable: string | null
  actividad_realizada: string | null
  novedades: string | null
  cliente: string | null
  estado: string | null

  constructor() {
    this.coordinador = null
    this.codigo_tarea_jp = null
    this.tipo_trabajo = null
    this.codigo_tarea_cliente = null
    this.codigo_subtarea = null
    this.detalle_tarea = null
    this.detalle_subtarea = null
    this.grupo = null
    this.tecnico_responsable = null
    this.actividad_realizada = null
    this.novedades = null
    this.cliente = null
    this.estado = null
  }
}
