import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class Ticket extends EntidadAuditable {
  codigo: string | null
  asunto: string | null
  descripcion: string | null
  prioridad: string | null
  fecha_hora_limite: string | null
  estado: string | null
  observaciones_solicitante: string | null
  calificacion_solicitante: number | null
  solicitante: number | null
  solicitante_id: number | null
  responsable: number | null
  responsable_id: number | null
  departamento_responsable: []
  departamento_solicitante: string | null
  tipo_ticket: number | null
  categoria_tipo_ticket: number | null
  establecer_hora_limite: boolean
  fecha_hora_solicitud: string | null
  calificaciones: any
  pendiente_calificar: boolean
  ticket_interno: boolean
  ticket_para_mi: boolean
  calificado_solicitante: boolean
  calificado_responsable: boolean
  tiempo_hasta_finalizar: string | null
  tiempo_ocupado_pausas: string | null

  constructor() {
    super()
    this.codigo = null
    this.asunto = null
    this.descripcion = null
    this.prioridad = null
    this.fecha_hora_limite = null
    this.estado = null
    this.observaciones_solicitante = null
    this.calificacion_solicitante = null
    this.solicitante = null
    this.solicitante_id = null
    this.responsable = null
    this.responsable_id = null
    this.departamento_responsable = []
    this.departamento_solicitante = null
    this.tipo_ticket = null
    this.categoria_tipo_ticket = null
    this.establecer_hora_limite = false
    this.fecha_hora_solicitud = null
    this.calificaciones = []
    this.pendiente_calificar = false
    this.ticket_interno = false
    this.ticket_para_mi = false
    this.calificado_solicitante = false
    this.calificado_responsable = false
    this.tiempo_hasta_finalizar = null
    this.tiempo_ocupado_pausas = null
  }
}
