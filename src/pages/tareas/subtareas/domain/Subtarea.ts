import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class Subtarea extends EntidadAuditable {
  coordinador: string | null
  codigo_tarea_cliente: string | null
  codigo_subtarea: string | null
  descripcion_completa: string | null
  // detalle_tarea: string | null
  detalle: string | null
  tecnico_responsable: string | null
  actividad_realizada: string | null
  novedades: string | null
  cliente: string | null
  estado: string | null
  // Tiempos
  fecha_asignacion: string | null
  fecha_inicio: string | null
  fecha_finalizacion: string | null
  cantidad_dias: string | null // para calculo
  // NEDETEL
  fiscalizador: string | null
  ing_soporte: string | null
  ing_instalacion: string | null
  tipo_intervencion: string | null
  causa_intervencion: string | null
  // TELCONET
  tipo_instalacion: string | null
  id_servicio: string | null
  ticket_phoenix: string | null
  // Foreign keys
  codigo_tarea_jp: string | null
  tipo_trabajo: number | null
  servicio: number | null
  ubicacion_origen: number | null
  ubicacion_fin: number | null
  grupo: string | null

  constructor() {
    super()
    this.coordinador = null
    this.codigo_tarea_cliente = null
    this.codigo_subtarea = null
    this.descripcion_completa = null
    // this.detalle_tarea = null
    this.detalle = null
    this.tecnico_responsable = null
    this.actividad_realizada = null
    this.novedades = null
    this.cliente = null
    this.estado = null
    // Tiempos
    this.fecha_asignacion = null
    this.fecha_inicio = null
    this.fecha_finalizacion = null
    this.cantidad_dias = null
    // NEDETEL
    this.fiscalizador = null
    this.ing_soporte = null
    this.ing_instalacion = null
    this.tipo_intervencion = null
    this.causa_intervencion = null
    // TELCONET
    this.tipo_instalacion = null // Subterranea - Aerea
    this.id_servicio = null
    this.ticket_phoenix = null
    // Foreign keys
    this.codigo_tarea_jp = null
    this.tipo_trabajo = null
    this.servicio = null
    this.ubicacion_origen = null
    this.ubicacion_fin = null
    this.grupo = null
  }
}
