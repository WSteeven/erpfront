import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class CitaMedica extends EntidadAuditable {
  sintomas: string | null
  observacion: string | null
  fecha_hora_cita: string | null
  estado_cita_medica: string | null
  paciente: number | null
  paciente_id: number | null
  estado: string | null

  constructor() {
    super()
    this.sintomas = null
    this.observacion = null
    this.fecha_hora_cita = null
    this.estado_cita_medica = null
    this.paciente = null
    this.paciente_id = null
    this.estado = null
  }
}
