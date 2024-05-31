import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class CitaMedica extends EntidadAuditable {
  sintomas: string | null
  observacion: string | null
  fecha_hora_cita: string | null
  estado_cita_medica: string | null
  tipo_cita_medica: string | null
  paciente: number | null
  paciente_id: number | null
  estado: string | null
  fecha_hora_cancelado: string | null
  fecha_hora_rechazo: string | null
  motivo_cancelacion: string | null
  motivo_rechazo: string | null
  dado_alta: boolean
  fecha_hora_solicitud: string | null
  fecha_hora_accidente: string | null
  tipo_cambio_cargo: string | null

  constructor() {
    super()
    this.sintomas = null
    this.observacion = null
    this.fecha_hora_cita = null
    this.estado_cita_medica = null
    this.tipo_cita_medica = null
    this.paciente = null
    this.paciente_id = null
    this.estado = null
    this.motivo_cancelacion = null
    this.motivo_rechazo = null
    this.fecha_hora_cancelado = null
    this.fecha_hora_rechazo = null
    this.dado_alta = false
    this.fecha_hora_solicitud = null
    this.fecha_hora_accidente = null
    this.tipo_cambio_cargo = null
  }
}

