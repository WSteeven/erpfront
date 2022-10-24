import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class Subtarea extends EntidadAuditable {
  codigo_subtarea: string | null
  detalle: string | null
  grupo: string | null
  tecnico_responsable: string | null
  tipo_trabajo: number | null
  cliente: number | null

  // Tiempos
  fecha_hora_creacion: string | null
  fecha_hora_asignacion: string | null
  fecha_hora_inicio: string | null
  fecha_hora_finalizacion: string | null
  fecha_hora_realizado: string | null
  fecha_hora_suspendido: string | null
  causa_suspencion: string | null
  fecha_hora_cancelacion: string | null
  cantidad_dias: string | null

  es_dependiente: boolean
  subtarea_dependiente: string | null

  es_ventana: boolean
  hora_inicio_ventana: string | null
  hora_fin_ventana: string | null

  descripcion_completa: string | null

  actividad_realizada: string | null
  novedades: string | null
  estado: string | null

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
  servicio: number | null
  ubicacion_origen: number | null
  ubicacion_fin: number | null

  constructor() {
    super()
    this.codigo_subtarea = null
    this.descripcion_completa = null
    this.es_dependiente = false
    this.es_ventana = false
    this.hora_inicio_ventana = null
    this.hora_fin_ventana = null
    this.subtarea_dependiente = null

    this.detalle = null
    this.tecnico_responsable = null
    this.actividad_realizada = null
    this.novedades = null
    this.estado = null
    this.cliente = null

    // Tiempos
    this.fecha_hora_creacion = null
    this.fecha_hora_asignacion = null
    this.fecha_hora_inicio = null
    this.fecha_hora_finalizacion = null
    this.fecha_hora_realizado = null
    this.fecha_hora_suspendido = null
    this.causa_suspencion = null
    this.fecha_hora_cancelacion = null
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
